import { promises as fs } from 'fs'
import { join } from 'path'

export interface CacheEntry<T = any> {
  data: T
  timestamp: number
  ttl: number // Time to live in milliseconds
  key: string
}

export interface CacheOptions {
  ttl?: number // Default TTL in milliseconds
  directory?: string // Cache directory path
}

export class FileCache {
  private directory: string
  private defaultTTL: number

  constructor(options: CacheOptions = {}) {
    this.directory = options.directory || join(process.cwd(), '.cache')
    this.defaultTTL = options.ttl || 60 * 60 * 1000 // 1 hour default
  }

  private async ensureCacheDirectory(): Promise<void> {
    try {
      await fs.access(this.directory)
    } catch {
      await fs.mkdir(this.directory, { recursive: true })
    }
  }

  private getCacheFilePath(key: string): string {
    // Sanitize key for filename
    const sanitizedKey = key.replace(/[^a-zA-Z0-9-_]/g, '_')
    return join(this.directory, `${sanitizedKey}.json`)
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      await this.ensureCacheDirectory()
      const filePath = this.getCacheFilePath(key)
      
      const fileContent = await fs.readFile(filePath, 'utf-8')
      const cacheEntry: CacheEntry<T> = JSON.parse(fileContent)
      
      const now = Date.now()
      const isExpired = now > (cacheEntry.timestamp + cacheEntry.ttl)
      
      if (isExpired) {
        // Clean up expired cache
        await this.delete(key)
        return null
      }
      
      return cacheEntry.data
    } catch (error) {
      // Cache miss or error
      return null
    }
  }

  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    try {
      await this.ensureCacheDirectory()
      const filePath = this.getCacheFilePath(key)
      
      const cacheEntry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttl || this.defaultTTL,
        key
      }
      
      await fs.writeFile(filePath, JSON.stringify(cacheEntry, null, 2), 'utf-8')
    } catch (error) {
      console.error('Failed to write cache:', error)
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const filePath = this.getCacheFilePath(key)
      await fs.unlink(filePath)
    } catch {
      // File doesn't exist or other error - ignore
    }
  }

  async has(key: string): Promise<boolean> {
    const data = await this.get(key)
    return data !== null
  }

  async clear(): Promise<void> {
    try {
      await this.ensureCacheDirectory()
      const files = await fs.readdir(this.directory)
      
      await Promise.all(
        files
          .filter(file => file.endsWith('.json'))
          .map(file => fs.unlink(join(this.directory, file)))
      )
    } catch (error) {
      console.error('Failed to clear cache:', error)
    }
  }

  async getCacheInfo(key: string): Promise<{
    exists: boolean
    isExpired?: boolean
    age?: number
    ttl?: number
  }> {
    try {
      const filePath = this.getCacheFilePath(key)
      const fileContent = await fs.readFile(filePath, 'utf-8')
      const cacheEntry: CacheEntry = JSON.parse(fileContent)
      
      const now = Date.now()
      const age = now - cacheEntry.timestamp
      const isExpired = age > cacheEntry.ttl
      
      return {
        exists: true,
        isExpired,
        age,
        ttl: cacheEntry.ttl
      }
    } catch {
      return { exists: false }
    }
  }

  async cleanup(): Promise<number> {
    let cleanedCount = 0
    
    try {
      await this.ensureCacheDirectory()
      const files = await fs.readdir(this.directory)
      
      for (const file of files) {
        if (!file.endsWith('.json')) continue
        
        try {
          const filePath = join(this.directory, file)
          const fileContent = await fs.readFile(filePath, 'utf-8')
          const cacheEntry: CacheEntry = JSON.parse(fileContent)
          
          const now = Date.now()
          const isExpired = now > (cacheEntry.timestamp + cacheEntry.ttl)
          
          if (isExpired) {
            await fs.unlink(filePath)
            cleanedCount++
          }
        } catch {
          // Invalid cache file, remove it
          await fs.unlink(join(this.directory, file))
          cleanedCount++
        }
      }
    } catch (error) {
      console.error('Failed to cleanup cache:', error)
    }
    
    return cleanedCount
  }
}

// GitHub-specific cache utilities
export class GitHubCache extends FileCache {
  constructor() {
    super({
      ttl: 60 * 60 * 1000, // 1 hour
      directory: join(process.cwd(), '.cache', 'github')
    })
  }

  async getRepos(username: string) {
    return this.get(`repos_${username}`)
  }

  async setRepos(username: string, repos: any[]) {
    return this.set(`repos_${username}`, repos)
  }

  async getReposCacheInfo(username: string) {
    return this.getCacheInfo(`repos_${username}`)
  }
}

// Create singleton instance
export const githubCache = new GitHubCache()