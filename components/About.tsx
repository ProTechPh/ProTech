'use client'

import { useEffect, useRef } from 'react'
import styles from './About.module.css'

interface StatItemProps {
  number: number
  label: string
}

function StatItem({ number, label }: StatItemProps) {
  const statRef = useRef<HTMLHeadingElement>(null)
  const hasAnimated = useRef(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const element = statRef.current
    if (!element) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current && statRef.current) {
            hasAnimated.current = true
            animateCounter(statRef.current, number)
            if (observerRef.current) {
              observerRef.current.unobserve(entry.target)
            }
          }
        })
      },
      { threshold: 0.5 }
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
  }, [number])

  const animateCounter = (element: HTMLHeadingElement, target: number) => {
    let current = 0
    const increment = target / 50
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        element.textContent = target + '+'
        clearInterval(timer)
      } else {
        element.textContent = Math.floor(current) + '+'
      }
    }, 30)
  }

  return (
    <div className={styles.statItem}>
      <h3 ref={statRef} className={styles.statNumber}>
        0
      </h3>
      <p className={styles.statLabel}>{label}</p>
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>About ProTech</h2>
          <p className={styles.sectionSubtitle}>Innovation meets excellence</p>
        </div>
        <div className={styles.aboutContent}>
          <div className={styles.aboutText}>
            <p className={styles.aboutDescription}>
              Hi! I'm KenshinPH, a passionate developer creating diverse web applications ranging from productivity tools to e-commerce and AI projects. At ProTech, I specialize in delivering cutting-edge technology solutions that drive innovation and success.
            </p>
            <p className={styles.aboutDescription}>
              My expertise spans across modern web technologies including TypeScript, Python, React, and Next.js. I'm committed to building scalable, efficient solutions that solve real-world problems and enhance user experiences.
            </p>
            <div className={styles.stats}>
              <StatItem number={48} label="Public Repositories" />
              <StatItem number={5} label="Followers" />
              <StatItem number={3} label="Years Experience" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

