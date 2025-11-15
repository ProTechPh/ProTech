import { NextResponse } from 'next/server'
import { githubCache } from '@/lib/cache'

export async function GET() {
  try {
    const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'ProTechPh'
    const cacheInfo = await githubCache.getCacheInfo(`repos_${GITHUB_USERNAME}`)
    
    return NextResponse.json({
      success: true,
      cache: {
        exists: cacheInfo.exists,
        isExpired: cacheInfo.isExpired,
        age: cacheInfo.age,
        ttl: cacheInfo.ttl,
        ageMinutes: cacheInfo.age ? Math.round(cacheInfo.age / 1000 / 60) : 0,
        ttlMinutes: cacheInfo.ttl ? Math.round(cacheInfo.ttl / 1000 / 60) : 0,
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to get cache info'
    }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'ProTechPh'
    await githubCache.delete(`repos_${GITHUB_USERNAME}`)
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

export async function POST() {
  try {
    const cleanedCount = await githubCache.cleanup()
    
    return NextResponse.json({
      success: true,
      message: `Cache cleanup completed. Cleaned ${cleanedCount} expired entries.`
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to cleanup cache'
    }, { status: 500 })
  }
}