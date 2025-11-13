'use client'

import { useEffect, useRef } from 'react'
import styles from './Services.module.css'
import cardStyles from './AnimatedCard.module.css'
import headerStyles from './SectionHeader.module.css'

interface Service {
  title: string
  description: string
  icon: React.ReactNode
}

const services: Service[] = [
  {
    title: 'Web Development',
    description: 'Custom web applications built with modern frameworks and best practices for optimal performance and scalability.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    ),
  },
  {
    title: 'UI/UX Design',
    description: 'Beautiful, intuitive interfaces that provide exceptional user experiences and drive engagement.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    ),
  },
  {
    title: 'Cloud Solutions',
    description: 'Scalable cloud infrastructure and deployment strategies for modern, high-availability applications.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    ),
  },
  {
    title: 'API Development',
    description: 'Robust and secure APIs designed for seamless integration and efficient data exchange.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
      </svg>
    ),
  },
  {
    title: 'Security Consulting',
    description: 'Comprehensive security audits and implementation of industry-standard security practices.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
  },
  {
    title: 'Performance Optimization',
    description: 'Speed and efficiency improvements that enhance user experience and reduce operational costs.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    ),
  },
]

function ServiceCard({ service, index }: { service: Service; index: number }) {
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
      className={`${cardStyles.card} ${cardStyles.cardGlass} ${styles.serviceCard}`}
      style={{
        opacity: 0,
        transform: 'translateY(30px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        transitionDelay: `${index * 0.1}s`,
      }}
    >
      <div className={cardStyles.cardContent}>
        <div className={`${cardStyles.cardIcon} ${styles.serviceIcon}`}>
          {service.icon}
        </div>
        <h3 className={`${cardStyles.cardTitle} ${styles.serviceTitle}`}>{service.title}</h3>
        <p className={`${cardStyles.cardDescription} ${styles.serviceDescription}`}>{service.description}</p>
        <button className={`${cardStyles.cardButton} ${styles.learnMore}`}>
          Learn More
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14"/>
            <path d="m12 5 7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function Services() {
  return (
    <section id="services" className={styles.services}>
      <div className={styles.container}>
        <div className={headerStyles.sectionHeader}>
          <span className={headerStyles.sectionBadge}>What We Do</span>
          <h2 className={headerStyles.sectionTitle}>Our Services</h2>
          <div className={headerStyles.sectionDivider}></div>
          <p className={headerStyles.sectionSubtitle}>
            Comprehensive solutions for your digital needs. We deliver cutting-edge technology 
            services that drive innovation and accelerate your business growth.
          </p>
        </div>
        <div className={`${cardStyles.cardGrid} ${styles.servicesGrid}`}>
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

