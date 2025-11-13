'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Navbar.module.css'

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = theme === 'dark' || (!theme && prefersDark)
    
    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle('dark', shouldBeDark)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    document.documentElement.classList.toggle('dark', newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggleTheme}
      className={styles.themeToggle}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="m12 1v2"/>
          <path d="m12 21v2"/>
          <path d="M4.22 4.22l1.42 1.42"/>
          <path d="m18.36 18.36l1.42 1.42"/>
          <path d="M1 12h2"/>
          <path d="M21 12h2"/>
          <path d="m4.22 19.78l1.42-1.42"/>
          <path d="m18.36 5.64l1.42-1.42"/>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  )
}

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
    setMobileMenuOpen(false)
    
    // If we're not on the home page, navigate to home first
    if (pathname !== '/') {
      window.location.href = `/${href}`
      return
    }
    
    // If we're on home page, scroll to section
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
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.navWrapper}>
          <Link href="/" className={styles.logo}>
            Pro<span>Tech</span>
          </Link>
          <ul className={`${styles.navMenu} ${mobileMenuOpen ? styles.active : ''}`}>
            <li>
              {pathname === '/' ? (
                <a href="#home" className={styles.navLink} onClick={(e) => handleNavClick(e, '#home')}>
                  Home
                </a>
              ) : (
                <Link href="/" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
              )}
            </li>
            <li>
              {pathname === '/' ? (
                <a href="#about" className={styles.navLink} onClick={(e) => handleNavClick(e, '#about')}>
                  About
                </a>
              ) : (
                <Link href="/#about" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
                  About
                </Link>
              )}
            </li>
            <li>
              {pathname === '/' ? (
                <a href="#services" className={styles.navLink} onClick={(e) => handleNavClick(e, '#services')}>
                  Services
                </a>
              ) : (
                <Link href="/#services" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
                  Services
                </Link>
              )}
            </li>
            <li>
              {pathname === '/' ? (
                <a href="#skills" className={styles.navLink} onClick={(e) => handleNavClick(e, '#skills')}>
                  Skills
                </a>
              ) : (
                <Link href="/#skills" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
                  Skills
                </Link>
              )}
            </li>
            <li>
              {pathname === '/' ? (
                <a href="#projects" className={styles.navLink} onClick={(e) => handleNavClick(e, '#projects')}>
                  Projects
                </a>
              ) : (
                <Link href="/#projects" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
                  Projects
                </Link>
              )}
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
              {pathname === '/' ? (
                <a href="#contact" className={styles.navLink} onClick={(e) => handleNavClick(e, '#contact')}>
                  Contact
                </a>
              ) : (
                <Link href="/#contact" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </Link>
              )}
            </li>
          </ul>
          <div className={styles.navActions}>
            <ThemeToggle />
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

