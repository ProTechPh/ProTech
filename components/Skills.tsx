'use client'

import { useEffect, useRef } from 'react'
import styles from './Skills.module.css'

interface Skill {
  name: string
  level: number
  icon?: string
}

interface SkillCategory {
  title: string
  skills: Skill[]
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    skills: [
      { name: 'React', level: 90 },
      { name: 'Next.js', level: 85 },
      { name: 'TypeScript', level: 88 },
      { name: 'JavaScript', level: 92 },
      { name: 'HTML/CSS', level: 95 },
      { name: 'Tailwind CSS', level: 80 },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'Python', level: 82 },
      { name: 'REST APIs', level: 88 },
      { name: 'GraphQL', level: 75 },
      { name: 'PostgreSQL', level: 80 },
      { name: 'MongoDB', level: 78 },
    ],
  },
  {
    title: 'Tools & Technologies',
    skills: [
      { name: 'Git', level: 90 },
      { name: 'Docker', level: 75 },
      { name: 'AWS', level: 70 },
      { name: 'CI/CD', level: 80 },
      { name: 'Linux', level: 85 },
      { name: 'VS Code', level: 95 },
    ],
  },
]

function SkillBar({ skill, index }: { skill: Skill; index: number }) {
  const barRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const element = barRef.current
    if (!element) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current && barRef.current) {
            hasAnimated.current = true
            const progressBar = barRef.current.querySelector(`.${styles.progressBar}`) as HTMLElement
            if (progressBar) {
              progressBar.style.width = `${skill.level}%`
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
  }, [skill.level])

  return (
    <div ref={barRef} className={styles.skillItem}>
      <div className={styles.skillHeader}>
        <span className={styles.skillName}>{skill.name}</span>
        <span className={styles.skillLevel}>{skill.level}%</span>
      </div>
      <div className={styles.progressContainer}>
        <div className={styles.progressBar} style={{ width: '0%' }}></div>
      </div>
    </div>
  )
}

function SkillCategoryCard({ category, index }: { category: SkillCategory; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const element = cardRef.current
    if (!element) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && cardRef.current) {
            cardRef.current.style.opacity = '1'
            cardRef.current.style.transform = 'translateY(0)'
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }
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

  return (
    <div
      ref={cardRef}
      className={styles.categoryCard}
      style={{
        opacity: 0,
        transform: 'translateY(30px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        transitionDelay: `${index * 0.1}s`,
      }}
    >
      <h3 className={styles.categoryTitle}>{category.title}</h3>
      <div className={styles.skillsList}>
        {category.skills.map((skill, skillIndex) => (
          <SkillBar key={skill.name} skill={skill} index={skillIndex} />
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className={styles.skills}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Skills & Technologies</h2>
          <p className={styles.sectionSubtitle}>
            A comprehensive overview of my technical expertise and proficiency levels
          </p>
        </div>
        <div className={styles.skillsGrid}>
          {skillCategories.map((category, index) => (
            <SkillCategoryCard key={category.title} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

