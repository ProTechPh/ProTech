import { Metadata } from 'next'
import Link from 'next/link'
import { getAllPostsMeta } from '@/lib/markdown'
import { format } from 'date-fns'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read our latest articles about web development, technology, and best practices.',
  openGraph: {
    title: 'Blog | ProTech',
    description: 'Read our latest articles about web development, technology, and best practices.',
    url: '/blog',
  },
}

export default function BlogPage() {
  const posts = getAllPostsMeta()

  return (
    <main className={styles.blogPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Blog</h1>
          <p className={styles.subtitle}>Insights, tutorials, and updates from the ProTech team</p>
        </div>

        {posts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className={styles.postsGrid}>
            {posts.map((post) => (
              <article key={post.slug} className={styles.postCard}>
                <div className={styles.postMeta}>
                  <time dateTime={post.date} className={styles.postDate}>
                    {format(new Date(post.date), 'MMMM d, yyyy')}
                  </time>
                  <span className={styles.readingTime}>{post.readingTime} min read</span>
                </div>
                <h2 className={styles.postTitle}>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className={styles.postExcerpt}>{post.excerpt}</p>
                <div className={styles.postFooter}>
                  <div className={styles.tags}>
                    {post.tags.slice(0, 3).map((tag) => (
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
        )}
      </div>
    </main>
  )
}

