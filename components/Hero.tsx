'use client'

import Link from 'next/link'
import styles from './Hero.module.css'

export default function Hero() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      const offsetTop = (element as HTMLElement).offsetTop - 80
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.heroBackground}>
        <div className={styles.floatingShape1}></div>
        <div className={styles.floatingShape2}></div>
        <div className={styles.floatingShape3}></div>
        <div className={styles.gradientOrb1}></div>
        <div className={styles.gradientOrb2}></div>
      </div>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <div className={styles.titleWrapper}>
            <span className={styles.heroSubtitle}>Welcome to</span>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroMain}>ProTech</span>
              <span className={styles.heroAccent}>Solutions</span>
            </h1>
          </div>
          <p className={styles.heroDescription}>
            Transforming ideas into cutting-edge digital experiences with innovative technology and expert craftsmanship
          </p>
          <div className={styles.heroButtons}>
            <a href="#projects" className={styles.btnPrimary} onClick={(e) => handleNavClick(e, '#projects')}>
              <span>View Projects</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#contact" className={styles.btnSecondary} onClick={(e) => handleNavClick(e, '#contact')}>
              <span>Get in Touch</span>
            </a>
          </div>
        </div>
      </div>
      <div className={styles.scrollIndicator}>
        <span></span>
      </div>
    </section>
  )
}

