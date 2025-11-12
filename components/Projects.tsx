'use client'

import { useEffect, useRef } from 'react'
import useSWR from 'swr'
import styles from './Projects.module.css'

interface Project {
  title: string
  description: string
  tags: string[]
  links: {
    demo?: string
    github?: string
  }
  gradient: string
  updatedAt?: string
  stars?: number
}

interface ProjectsResponse {
  projects: Project[]
  lastUpdated: string
}

const fetcher = async (url: string): Promise<ProjectsResponse> => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch projects')
  }
  return res.json()
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
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
      className={styles.projectCard}
      style={{
        opacity: 0,
        transform: 'translateY(30px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        transitionDelay: `${index * 0.1}s`,
      }}
    >
      <div className={styles.projectImage}>
        <div className={styles.projectPlaceholder} style={{ background: project.gradient }}></div>
      </div>
      <div className={styles.projectContent}>
        <h3 className={styles.projectTitle}>{project.title}</h3>
        <p className={styles.projectDescription}>{project.description}</p>
        <div className={styles.projectTags}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className={styles.projectLinks}>
          {project.links.demo && (
            <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
              Live Demo
            </a>
          )}
          {project.links.github && (
            <a href={project.links.github} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const { data, error, isLoading } = useSWR<ProjectsResponse>(
    '/api/github/repos',
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 10000,
    }
  )

  const projects = data?.projects || []

  return (
    <section id="projects" className={styles.projects}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Projects</h2>
          <p className={styles.sectionSubtitle}>
            {isLoading
              ? 'Loading projects...'
              : error
              ? 'Failed to load projects. Please try again later.'
              : data?.lastUpdated
              ? `Our recent work and success stories • Updated ${new Date(data.lastUpdated).toLocaleTimeString()}`
              : 'Our recent work and success stories'}
          </p>
        </div>
        {error && (
          <div className={styles.errorMessage}>
            <p>Unable to fetch projects from GitHub. Showing cached data if available.</p>
          </div>
        )}
        {isLoading && projects.length === 0 ? (
          <div className={styles.loadingGrid}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={styles.skeletonCard}></div>
            ))}
          </div>
        ) : (
          <div className={styles.projectsGrid}>
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </div>
        )}
        {projects.length === 0 && !isLoading && !error && (
          <p className={styles.noProjects}>No projects found.</p>
        )}
      </div>
    </section>
  )
}

