import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getAllPostsMeta } from '@/lib/markdown'
import { format } from 'date-fns'
import styles from './page.module.css'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = getAllPostsMeta()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main className={styles.postPage}>
      <div className={styles.container}>
        <Link href="/blog" className={styles.backLink}>
          ← Back to Blog
        </Link>

        <article className={styles.post}>
          <header className={styles.postHeader}>
            <h1 className={styles.postTitle}>{post.title}</h1>
            <div className={styles.postMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Published:</span>
                <time dateTime={post.date}>{format(new Date(post.date), 'MMMM d, yyyy')}</time>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Author:</span>
                <span>{post.author}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Reading time:</span>
                <span>{post.readingTime} min</span>
              </div>
            </div>
            {post.tags.length > 0 && (
              <div className={styles.tags}>
                {post.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <footer className={styles.postFooter}>
            <Link href="/blog" className={styles.backToBlog}>
              ← Back to Blog
            </Link>
          </footer>
        </article>
      </div>
    </main>
  )
}

