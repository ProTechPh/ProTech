'use client'

import styles from './LoadingSkeleton.module.css'

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card'
  width?: string | number
  height?: string | number
  count?: number
  className?: string
}

export default function LoadingSkeleton({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
}: SkeletonProps) {
  const skeletonStyle = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  }

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`${styles.skeleton} ${styles[variant]} ${className}`}
      style={skeletonStyle}
      aria-hidden="true"
      role="status"
      aria-label="Loading content"
    />
  ))

  return <>{skeletons}</>
}

// Specific skeleton components for common use cases
export function ProjectCardSkeleton() {
  return (
    <div className={styles.projectCard} role="status" aria-label="Loading project">
      <LoadingSkeleton variant="rectangular" height={200} />
      <div className={styles.cardContent}>
        <LoadingSkeleton variant="text" width="80%" height={24} />
        <LoadingSkeleton variant="text" width="100%" height={16} count={2} />
        <div className={styles.tags}>
          <LoadingSkeleton variant="rectangular" width={60} height={24} count={3} />
        </div>
      </div>
      <span className="sr-only">Loading project details...</span>
    </div>
  )
}

export function BlogCardSkeleton() {
  return (
    <div className={styles.blogCard} role="status" aria-label="Loading blog post">
      <LoadingSkeleton variant="rectangular" height={180} />
      <div className={styles.cardContent}>
        <LoadingSkeleton variant="text" width="90%" height={28} />
        <LoadingSkeleton variant="text" width="40%" height={14} />
        <LoadingSkeleton variant="text" width="100%" height={16} count={3} />
      </div>
      <span className="sr-only">Loading blog post...</span>
    </div>
  )
}

export function TestimonialSkeleton() {
  return (
    <div className={styles.testimonial} role="status" aria-label="Loading testimonial">
      <LoadingSkeleton variant="text" width="100%" height={16} count={4} />
      <div className={styles.author}>
        <LoadingSkeleton variant="circular" width={48} height={48} />
        <div>
          <LoadingSkeleton variant="text" width={120} height={18} />
          <LoadingSkeleton variant="text" width={100} height={14} />
        </div>
      </div>
      <span className="sr-only">Loading testimonial...</span>
    </div>
  )
}