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
      <div className={styles.heroBackground}></div>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroSubtitle}>Welcome to</span>
            <span className={styles.heroMain}>ProTech Solutions</span>
          </h1>
          <p className={styles.heroDescription}>
            Transforming ideas into cutting-edge digital experiences with innovative technology and expert craftsmanship
          </p>
          <div className={styles.heroButtons}>
            <a href="#projects" className={styles.btnPrimary} onClick={(e) => handleNavClick(e, '#projects')}>
              View Projects
            </a>
            <a href="#contact" className={styles.btnSecondary} onClick={(e) => handleNavClick(e, '#contact')}>
              Get in Touch
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

