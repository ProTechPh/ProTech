import { NextResponse } from 'next/server'
import { githubCache } from '@/lib/cache'

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'ProTechPh'
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`
const TIMEOUT_MS = 10000 // 10 second timeout
const RATE_LIMIT_THRESHOLD = 10 // Remaining requests threshold

// Rate limit error detection
function isRateLimited(error: any): boolean {
  return error?.message?.includes('rate limit') ||
         error?.status === 403 ||
         error?.response?.status === 403
}

// Network timeout error detection
function isTimeoutError(error: any): boolean {
  return error?.name === 'AbortError' ||
         error?.code === 'UND_ERR_CONNECT_TIMEOUT' ||
         error?.message?.includes('timeout') ||
         error?.message?.includes('ETIMEDOUT')
}

// GitHub API error classification
function classifyGitHubError(error: any, response?: Response): {
  type: 'rate_limit' | 'timeout' | 'network' | 'not_found' | 'server' | 'unknown'
  message: string
  canRetry: boolean
} {
  if (response) {
    const status = response.status
    const remaining = response.headers.get('x-ratelimit-remaining')
    
    if (status === 403 && remaining && parseInt(remaining) === 0) {
      return {
        type: 'rate_limit',
        message: 'GitHub API rate limit exceeded',
        canRetry: false
      }
    }
    
    if (status === 404) {
      return {
        type: 'not_found',
        message: `GitHub user '${GITHUB_USERNAME}' not found`,
        canRetry: false
      }
    }
    
    if (status >= 500) {
      return {
        type: 'server',
        message: 'GitHub API server error',
        canRetry: true
      }
    }
  }
  
  if (isRateLimited(error)) {
    return {
      type: 'rate_limit',
      message: 'GitHub API rate limit exceeded',
      canRetry: false
    }
  }
  
  if (isTimeoutError(error)) {
    return {
      type: 'timeout',
      message: 'GitHub API request timeout',
      canRetry: true
    }
  }
  
  if (error?.code === 'ENOTFOUND' || error?.code === 'ECONNREFUSED') {
    return {
      type: 'network',
      message: 'GitHub API network error',
      canRetry: true
    }
  }
  
  return {
    type: 'unknown',
    message: error?.message || 'Unknown GitHub API error',
    canRetry: true
  }
}

interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  topics: string[]
  language: string | null
  updated_at: string
  created_at: string
  stargazers_count: number
  fork: boolean
}

interface Project {
  title: string
  description: string
  tags: string[]
  links: {
    demo?: string
    github?: string
  }
  gradient: string
  updatedAt: string
  stars: number
}

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
]


const languageToTags: Record<string, string[]> = {
  TypeScript: ['TypeScript', 'React', 'Next.js'],
  JavaScript: ['JavaScript', 'React', 'Node.js'],
  Python: ['Python'],
  'Jupyter Notebook': ['Python', 'Data Science'],
  Java: ['Java'],
  'C++': ['C++'],
  Go: ['Go'],
  Rust: ['Rust'],
  PHP: ['PHP'],
  Ruby: ['Ruby'],
}

function getGradient(index: number): string {
  return gradients[index % gradients.length]
}

function getTags(repo: GitHubRepo): string[] {
  const tags: string[] = []
  
  if (repo.language) {
    const languageTags = languageToTags[repo.language] || [repo.language]
    tags.push(...languageTags)
  }
  
  if (repo.topics && repo.topics.length > 0) {
    const topicTags = repo.topics
      .filter(topic => !tags.includes(topic))
      .slice(0, 3)
    tags.push(...topicTags)
  }
  
  if (tags.length === 0) {
    tags.push('Project')
  }
  
  return tags.slice(0, 5)
}

function transformRepoToProject(repo: GitHubRepo, index: number): Project {
  return {
    title: repo.name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    description: repo.description || 'A project showcasing modern development practices.',
    tags: getTags(repo),
    links: {
      ...(repo.homepage && { demo: repo.homepage }),
      github: repo.html_url,
    },
    gradient: getGradient(index),
    updatedAt: repo.updated_at,
    stars: repo.stargazers_count,
  }
}

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

async function fetchGitHubRepos(): Promise<{
  repos: GitHubRepo[]
  rateLimit: {
    remaining: number
    resetTime: string
  }
}> {
  const response = await fetchWithTimeout(GITHUB_API_URL, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'ProTech-Portfolio/1.0',
      ...(process.env.GITHUB_TOKEN && {
        Authorization: process.env.GITHUB_TOKEN.startsWith('github_pat_')
          ? `Bearer ${process.env.GITHUB_TOKEN}`
          : `token ${process.env.GITHUB_TOKEN}`,
      }),
    },
  }, TIMEOUT_MS)

  if (!response.ok) {
    const errorClassification = classifyGitHubError(null, response)
    throw new Error(`${errorClassification.message} (${response.status})`)
  }

  const repos: GitHubRepo[] = await response.json()
  
  // Extract rate limit info
  const remaining = parseInt(response.headers.get('x-ratelimit-remaining') || '0')
  const resetTimestamp = parseInt(response.headers.get('x-ratelimit-reset') || '0')
  const resetTime = new Date(resetTimestamp * 1000).toISOString()

  return {
    repos,
    rateLimit: {
      remaining,
      resetTime
    }
  }
}

export async function GET() {
  const startTime = Date.now()
  let cacheHit = false

  try {
    console.log('📡 GitHub API request initiated...')
    
    // Try to get from cache first
    const cachedData = await githubCache.get(`repos_${GITHUB_USERNAME}`)
    const cacheInfo = await githubCache.getCacheInfo(`repos_${GITHUB_USERNAME}`)
    
    if (cachedData && cacheInfo.exists && !cacheInfo.isExpired) {
      console.log(`✅ Cache hit - using cached data (age: ${Math.round((cacheInfo.age || 0) / 1000 / 60)}min)`)
      cacheHit = true
      
      return NextResponse.json({
        ...(cachedData as any),
        source: 'cache',
        cacheInfo: {
          age: cacheInfo.age,
          ttl: cacheInfo.ttl,
        }
      })
    }

    // Cache miss or expired - fetch from GitHub
    console.log('🔄 Cache miss/expired - fetching from GitHub API...')
    
    const { repos, rateLimit } = await fetchGitHubRepos()
    console.log(`✅ Successfully fetched ${repos.length} repositories from GitHub`)
    console.log(`📊 Rate limit: ${rateLimit.remaining} requests remaining`)

    // Check if we're approaching rate limit
    if (rateLimit.remaining <= RATE_LIMIT_THRESHOLD) {
      console.warn(`⚠️  Approaching rate limit: ${rateLimit.remaining} requests remaining`)
    }

    // Filter and process repositories
    const filteredRepos = repos
      .filter(repo => !repo.fork) // Include all non-forks, even without descriptions
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 12)

    if (filteredRepos.length === 0) {
      console.warn('⚠️  No repositories found for user:', GITHUB_USERNAME)
      return NextResponse.json({
        projects: [],
        lastUpdated: new Date().toISOString(),
        source: 'github-api' as const,
        message: `No public repositories found for user ${GITHUB_USERNAME}`,
        rateLimit,
        performance: {
          fetchTime: Date.now() - startTime
        }
      })
    }

    const projects = filteredRepos.map((repo, index) =>
      transformRepoToProject(repo, index)
    )

    const responseData = {
      projects,
      lastUpdated: new Date().toISOString(),
      source: 'github-api' as const,
      totalRepos: repos.length,
      filteredCount: filteredRepos.length,
      rateLimit,
      performance: {
        fetchTime: Date.now() - startTime
      }
    }

    // Cache the successful response
    await githubCache.set(`repos_${GITHUB_USERNAME}`, responseData)
    console.log('💾 Data cached successfully')

    return NextResponse.json(responseData)

  } catch (error) {
    const errorClassification = classifyGitHubError(error)
    
    console.error('❌ GitHub API error:', {
      type: errorClassification.type,
      message: errorClassification.message,
      canRetry: errorClassification.canRetry,
      username: GITHUB_USERNAME
    })

    // Try to return stale cache as fallback
    const staleCache = await githubCache.get(`repos_${GITHUB_USERNAME}`)
    if (staleCache) {
      console.log('🔄 Using stale cache as fallback')
      return NextResponse.json({
        ...(staleCache as any),
        source: 'stale-cache',
        warning: `Using cached data - ${errorClassification.message}`,
        error: {
          type: errorClassification.type,
          canRetry: errorClassification.canRetry
        }
      })
    }

    // No cache available - return error response
    console.error('❌ No cached data available, returning error')
    
    return NextResponse.json({
      projects: [],
      lastUpdated: new Date().toISOString(),
      source: 'error' as const,
      error: {
        type: errorClassification.type,
        message: errorClassification.message,
        canRetry: errorClassification.canRetry
      },
      performance: {
        fetchTime: Date.now() - startTime
      }
    }, {
      status: errorClassification.type === 'rate_limit' ? 429 : 503
    })
  }
}

// Cleanup endpoint for cache management
export async function DELETE() {
  try {
    await githubCache.clear()
    const cleanedCount = await githubCache.cleanup()
    
    return NextResponse.json({
      success: true,
      message: `Cache cleared successfully. Cleaned ${cleanedCount} expired entries.`
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to clear cache'
    }, { status: 500 })
  }
}

