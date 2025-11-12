'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './Testimonials.module.css'

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  avatar?: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'CEO',
    company: 'TechStart Inc.',
    content:
      'ProTech delivered an exceptional web application that exceeded our expectations. Their attention to detail and technical expertise is unmatched. The project was completed on time and within budget.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Product Manager',
    company: 'InnovateLab',
    content:
      'Working with ProTech was a game-changer for our business. They transformed our ideas into a beautiful, functional platform. Their team is professional, responsive, and truly understands modern web development.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Founder',
    company: 'Digital Solutions Co.',
    content:
      'The quality of work from ProTech is outstanding. They not only built a great product but also provided valuable insights throughout the development process. Highly recommended!',
    rating: 5,
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'CTO',
    company: 'CloudTech Systems',
    content:
      'ProTech helped us modernize our infrastructure and improve our application performance significantly. Their expertise in cloud solutions and optimization is impressive.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    role: 'Marketing Director',
    company: 'BrandBoost',
    content:
      'We needed a complete redesign of our website, and ProTech delivered beyond our expectations. The new site is fast, beautiful, and has significantly improved our user engagement.',
    rating: 5,
  },
]

function TestimonialCard({ testimonial, isActive }: { testimonial: Testimonial; isActive: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cardRef.current) {
      if (isActive) {
        cardRef.current.style.opacity = '1'
        cardRef.current.style.transform = 'scale(1)'
      } else {
        cardRef.current.style.opacity = '0.5'
        cardRef.current.style.transform = 'scale(0.95)'
      }
    }
  }, [isActive])

  return (
    <div
      ref={cardRef}
      className={`${styles.testimonialCard} ${isActive ? styles.active : ''}`}
      style={{
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      <div className={styles.testimonialHeader}>
        <div className={styles.avatar}>
          {testimonial.avatar ? (
            <img src={testimonial.avatar} alt={testimonial.name} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {testimonial.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </div>
          )}
        </div>
        <div className={styles.testimonialInfo}>
          <h4 className={styles.testimonialName}>{testimonial.name}</h4>
          <p className={styles.testimonialRole}>
            {testimonial.role} at {testimonial.company}
          </p>
          <div className={styles.rating}>
            {[...Array(testimonial.rating)].map((_, i) => (
              <span key={i} className={styles.star}>
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className={styles.testimonialContent}>"{testimonial.content}"</p>
    </div>
  )
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
      }, 5000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying])

  const getVisibleTestimonials = () => {
    const visible: { testimonial: Testimonial; index: number; isActive: boolean }[] = []
    const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length
    const nextIndex = (currentIndex + 1) % testimonials.length

    visible.push({ testimonial: testimonials[prevIndex], index: prevIndex, isActive: false })
    visible.push({ testimonial: testimonials[currentIndex], index: currentIndex, isActive: true })
    visible.push({ testimonial: testimonials[nextIndex], index: nextIndex, isActive: false })

    return visible
  }

  return (
    <section id="testimonials" className={styles.testimonials}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Client Testimonials</h2>
          <p className={styles.sectionSubtitle}>What our clients say about working with us</p>
        </div>
        <div className={styles.testimonialsWrapper}>
          <button className={styles.navButton} onClick={prevSlide} aria-label="Previous testimonial">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <div className={styles.testimonialsCarousel}>
            {getVisibleTestimonials().map(({ testimonial, index, isActive }) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} isActive={isActive} />
            ))}
          </div>
          <button className={styles.navButton} onClick={nextSlide} aria-label="Next testimonial">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        <div className={styles.dots}>
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

