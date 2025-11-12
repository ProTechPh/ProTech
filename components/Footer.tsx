'use client'

import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
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
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <h3 className={styles.logo}>
              Pro<span>Tech</span>
            </h3>
            <p>Building tomorrow's technology today</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <a href="#home" onClick={(e) => handleNavClick(e, '#home')}>
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" onClick={(e) => handleNavClick(e, '#about')}>
                    About
                  </a>
                </li>
                <li>
                  <a href="#services" onClick={(e) => handleNavClick(e, '#services')}>
                    Services
                  </a>
                </li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h4>Services</h4>
              <ul>
                <li>
                  <a href="#services" onClick={(e) => handleNavClick(e, '#services')}>
                    Web Development
                  </a>
                </li>
                <li>
                  <a href="#services" onClick={(e) => handleNavClick(e, '#services')}>
                    UI/UX Design
                  </a>
                </li>
                <li>
                  <a href="#services" onClick={(e) => handleNavClick(e, '#services')}>
                    Cloud Solutions
                  </a>
                </li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h4>Connect</h4>
              <ul>
                <li>
                  <a href="https://github.com/ProTechPh" target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="mailto:jerickogarcia0@gmail.com">Email</a>
                </li>
                <li>
                  <a href="https://github.com/ProTechPh?tab=repositories" target="_blank" rel="noopener noreferrer">
                    Projects
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2025 ProTech by KenshinPH. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

