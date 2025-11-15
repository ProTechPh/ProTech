'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Breadcrumb.module.css'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  currentPage?: string
}

export default function Breadcrumb({ items, currentPage }: BreadcrumbProps) {
  const pathname = usePathname()

  // Auto-generate breadcrumb items from pathname if not provided
  const breadcrumbItems = items || generateBreadcrumbItems(pathname)

  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
      <ol className={styles.breadcrumbList} itemScope itemType="https://schema.org/BreadcrumbList">
        <li 
          className={styles.breadcrumbItem}
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          <Link href="/" className={styles.breadcrumbLink} itemProp="item">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span itemProp="name">Home</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>

        {breadcrumbItems.map((item, index) => (
          <li
            key={item.href}
            className={styles.breadcrumbItem}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <span className={styles.separator} aria-hidden="true">
              /
            </span>
            <Link href={item.href} className={styles.breadcrumbLink} itemProp="item">
              <span itemProp="name">{item.label}</span>
            </Link>
            <meta itemProp="position" content={String(index + 2)} />
          </li>
        ))}

        {currentPage && (
          <li
            className={`${styles.breadcrumbItem} ${styles.current}`}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <span className={styles.separator} aria-hidden="true">
              /
            </span>
            <span 
              className={styles.breadcrumbCurrent} 
              aria-current="page"
              itemProp="item"
            >
              <span itemProp="name">{currentPage}</span>
            </span>
            <meta itemProp="position" content={String(breadcrumbItems.length + 2)} />
          </li>
        )}
      </ol>
    </nav>
  )
}

function generateBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = []

  paths.forEach((path, index) => {
    if (index < paths.length - 1) {
      const href = '/' + paths.slice(0, index + 1).join('/')
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')
      items.push({ label, href })
    }
  })

  return items
}