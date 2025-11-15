'use client'

import { Component, ReactNode } from 'react'
import styles from './ErrorBoundary.module.css'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className={styles.errorContainer} role="alert" aria-live="assertive">
          <div className={styles.errorContent}>
            <svg
              className={styles.errorIcon}
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h2 className={styles.errorTitle}>Something went wrong</h2>
            <p className={styles.errorMessage}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className={styles.errorActions}>
              <button
                onClick={this.handleReset}
                className={styles.retryButton}
                aria-label="Try again"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className={styles.homeButton}
                aria-label="Go to homepage"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Functional wrapper for use in app directory
export function ErrorBoundaryWrapper({ children }: { children: ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}