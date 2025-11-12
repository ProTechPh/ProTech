'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    setMobileMenuOpen(false)
  }

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.navWrapper}>
          <Link href="/" className={styles.logo}>
            Pro<span>Tech</span>
          </Link>
          <ul className={`${styles.navMenu} ${mobileMenuOpen ? styles.active : ''}`}>
            <li>
              <a href="#home" className={styles.navLink} onClick={(e) => handleNavClick(e, '#home')}>
                Home
              </a>
            </li>
            <li>
              <a href="#about" className={styles.navLink} onClick={(e) => handleNavClick(e, '#about')}>
                About
              </a>
            </li>
            <li>
              <a href="#services" className={styles.navLink} onClick={(e) => handleNavClick(e, '#services')}>
                Services
              </a>
            </li>
            <li>
              <a href="#skills" className={styles.navLink} onClick={(e) => handleNavClick(e, '#skills')}>
                Skills
              </a>
            </li>
            <li>
              <a href="#projects" className={styles.navLink} onClick={(e) => handleNavClick(e, '#projects')}>
                Projects
              </a>
            </li>
            <li>
              <Link
                href="/blog"
                className={styles.navLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
            </li>
            <li>
              <a href="#contact" className={styles.navLink} onClick={(e) => handleNavClick(e, '#contact')}>
                Contact
              </a>
            </li>
          </ul>
          <div className={styles.navActions}>
            <button
              className={`${styles.mobileMenuToggle} ${mobileMenuOpen ? styles.active : ''}`}
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

