import { NextResponse } from 'next/server'

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'ProTechPh'
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`
const TIMEOUT_MS = 5000 // 5 second timeout

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

// Fallback mock data for when GitHub API is unavailable
const mockProjects: Project[] = [
  {
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution with Next.js, TypeScript, and Stripe integration',
    tags: ['TypeScript', 'React', 'Next.js', 'E-Commerce'],
    links: {
      github: `https://github.com/${GITHUB_USERNAME}/ecommerce-platform`,
    },
    gradient: gradients[0],
    updatedAt: new Date().toISOString(),
    stars: 0,
  },
  {
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates',
    tags: ['TypeScript', 'React', 'Firebase'],
    links: {
      github: `https://github.com/${GITHUB_USERNAME}/task-manager`,
    },
    gradient: gradients[1],
    updatedAt: new Date().toISOString(),
    stars: 0,
  },
  {
    title: 'Portfolio Website',
    description: 'Modern portfolio website built with Next.js and TypeScript',
    tags: ['TypeScript', 'Next.js', 'React'],
    links: {
      demo: 'https://protech.ph',
      github: `https://github.com/${GITHUB_USERNAME}/portfolio`,
    },
    gradient: gradients[2],
    updatedAt: new Date().toISOString(),
    stars: 0,
  },
  {
    title: 'Weather Dashboard',
    description: 'Real-time weather dashboard with interactive maps and forecasts',
    tags: ['JavaScript', 'React', 'API'],
    links: {
      github: `https://github.com/${GITHUB_USERNAME}/weather-dashboard`,
    },
    gradient: gradients[3],
    updatedAt: new Date().toISOString(),
    stars: 0,
  },
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

export async function GET() {
  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && {
          Authorization: process.env.GITHUB_TOKEN.startsWith('github_pat_')
            ? `Bearer ${process.env.GITHUB_TOKEN}`
            : `token ${process.env.GITHUB_TOKEN}`,
        }),
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const repos: GitHubRepo[] = await response.json()

    const filteredRepos = repos
      .filter(repo => !repo.fork)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 12)

    const projects = filteredRepos.map((repo, index) =>
      transformRepoToProject(repo, index)
    )

    return NextResponse.json({
      projects,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch repositories', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

