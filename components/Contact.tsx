'use client'

import { useState, FormEvent } from 'react'
import styles from './Contact.module.css'

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
  general?: string
}

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (formData: FormData): FormErrors => {
    const newErrors: FormErrors = {}
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string

    if (!name || name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!subject || subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters'
    }

    if (!message || message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    return newErrors
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const validationErrors = validateForm(formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setSubmitSuccess(true)
      e.currentTarget.reset()

      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An error occurred. Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Get In Touch</h2>
          <p className={styles.sectionSubtitle}>Let's discuss your next project</p>
        </div>
        <div className={styles.contactContent}>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div>
                <h4>Email</h4>
                <p>jerickogarcia0@gmail.com</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </div>
              <div>
                <h4>Facebook</h4>
                <p>
                  <a
                    href="https://www.facebook.com/profile.php?id=61574105611075"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactLink}
                  >
                    @ProTechPH
                  </a>
                </p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div>
                <h4>Location</h4>
                <p>Philippines</p>
              </div>
            </div>
          </div>
          <form className={styles.contactForm} onSubmit={handleSubmit}>
            {errors.general && <div className={styles.errorMessage}>{errors.general}</div>}
            <div className={styles.formGroup}>
              <input
                type="text"
                name="name"
                className={`${styles.formInput} ${errors.name ? styles.inputError : ''}`}
                placeholder="Your Name"
                required
              />
              {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
            </div>
            <div className={styles.formGroup}>
              <input
                type="email"
                name="email"
                className={`${styles.formInput} ${errors.email ? styles.inputError : ''}`}
                placeholder="Your Email"
                required
              />
              {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
            </div>
            <div className={styles.formGroup}>
              <input
                type="text"
                name="subject"
                className={`${styles.formInput} ${errors.subject ? styles.inputError : ''}`}
                placeholder="Subject"
                required
              />
              {errors.subject && <span className={styles.fieldError}>{errors.subject}</span>}
            </div>
            <div className={styles.formGroup}>
              <textarea
                name="message"
                className={`${styles.formInput} ${errors.message ? styles.inputError : ''}`}
                rows={5}
                placeholder="Your Message"
                required
              ></textarea>
              {errors.message && <span className={styles.fieldError}>{errors.message}</span>}
            </div>
            <button
              type="submit"
              className={`${styles.btnPrimary} ${styles.btnFull} ${submitSuccess ? styles.btnSuccess : ''}`}
              disabled={isSubmitting || submitSuccess}
            >
              {isSubmitting ? 'Sending...' : submitSuccess ? 'Message Sent!' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

