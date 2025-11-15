'use client'

import { useEffect, useState } from 'react'
import styles from './NavProgressBar.module.css'

export default function NavProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const calculateScrollProgress = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      
      // Calculate progress as percentage
      const scrollableHeight = documentHeight - windowHeight
      const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0
      
      setScrollProgress(progress)
    }

    // Initial calculation
    calculateScrollProgress()

    // Add scroll listener with throttling for performance
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calculateScrollProgress()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', calculateScrollProgress, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', calculateScrollProgress)
    }
  }, [])

  return (
    <div 
      className={styles.progressBar}
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div 
        className={styles.progressFill}
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
}