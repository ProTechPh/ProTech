'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import styles from './Blog.module.css'

interface BlogPostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  author: string
  tags: string[]
  readingTime: number
}

export default function Blog() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [posts, setPosts] = useState<BlogPostMeta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cardsVisible, setCardsVisible] = useState(false)

  useEffect(() => {
    const element = sectionRef.current
    if (!element) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && sectionRef.current) {
            sectionRef.current.style.opacity = '1'
            sectionRef.current.style.transform = 'translateY(0)'
          }
        })
      },
      { threshold: 0.1 }
    )

    observerRef.current.observe(element)

    return () => {
      if (observerRef.current && element) {
        try {
          observerRef.current.unobserve(element)
        } catch (e) {
        }
        observerRef.current.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    fetch('/api/blog/posts')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts?.slice(0, 3) || [])
        setIsLoading(false)
        setTimeout(() => setCardsVisible(true), 100)
      })
      .catch((error) => {
        console.error('Error fetching blog posts:', error)
        setIsLoading(false)
        setPosts([
          {
            slug: 'getting-started-with-nextjs-14',
            title: 'Getting Started with Next.js 14',
            date: '2025-01-14',
            excerpt: 'Learn how to build modern web applications with Next.js 14, featuring the App Router and server components.',
            author: 'ProTech Team',
            tags: ['Next.js', 'React'],
            readingTime: 2,
          },
          {
            slug: 'typescript-best-practices',
            title: 'TypeScript Best Practices for Modern Development',
            date: '2025-01-09',
            excerpt: 'Discover essential TypeScript patterns and practices that will improve your code quality and developer experience.',
            author: 'ProTech Team',
            tags: ['TypeScript', 'Programming'],
            readingTime: 1,
          },
          {
            slug: 'building-responsive-designs',
            title: 'Building Responsive Designs in 2025',
            date: '2025-01-04',
            excerpt: 'Learn modern techniques for creating responsive web designs that work beautifully on all devices.',
            author: 'ProTech Team',
            tags: ['CSS', 'Responsive Design'],
            readingTime: 1,
          },
        ])
        setTimeout(() => setCardsVisible(true), 100)
      })
  }, [])

  return (
    <section id="blog" className={styles.blog} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Latest Blog Posts</h2>
          <p className={styles.sectionSubtitle}>Insights, tutorials, and updates from our team</p>
        </div>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            Loading blog posts...
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className={styles.postsGrid}>
              {posts.map((post, index) => (
            <article
              key={post.slug}
              className={styles.postCard}
              style={{
                opacity: cardsVisible ? 1 : 0,
                transform: cardsVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
                transitionDelay: `${index * 0.1}s`,
              }}
            >
              <div className={styles.postMeta}>
                <time dateTime={post.date} className={styles.postDate}>
                  {format(new Date(post.date), 'MMM d, yyyy')}
                </time>
                <span className={styles.readingTime}>{post.readingTime} min read</span>
              </div>
              <h3 className={styles.postTitle}>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              <p className={styles.postExcerpt}>{post.excerpt}</p>
              <div className={styles.postFooter}>
                <div className={styles.tags}>
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                  Read more →
                </Link>
              </div>
            </article>
              ))}
            </div>
            <div className={styles.viewAll}>
              <Link href="/blog" className={styles.viewAllLink}>
                View All Posts →
              </Link>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <p>No blog posts available at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  )
}

