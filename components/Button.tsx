'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  children: ReactNode
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const buttonClasses = [
    styles.btn,
    styles[`btn-${variant}`],
    styles[`btn-${size}`],
    loading && styles.loading,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span className={styles.spinner} aria-hidden="true">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
        </span>
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.content}>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  )
}