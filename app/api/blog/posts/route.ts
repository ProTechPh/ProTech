import { NextResponse } from 'next/server'
import { getAllPostsMeta } from '@/lib/markdown'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const posts = getAllPostsMeta()
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({ posts: [] }, { status: 200 })
  }
}

