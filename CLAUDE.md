# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ProTech is a professional technology solutions portfolio website built with Next.js 14, React 18, and TypeScript. The site features a modern component-based architecture with server-side rendering, static site generation, and client-side interactivity. It includes a blog system, GitHub API integration for project showcasing, and Vercel Analytics integration.

## Common Commands

```bash
# Development
npm run dev          # Start development server at localhost:3000

# Build
npm run build        # Create production build

# Production
npm start            # Start production server (requires build first)

# Linting
npm run lint         # Run Next.js linter
```

## Architecture

### Directory Structure
- `app/` - Next.js 14 App Router pages and API routes
  - `api/` - Backend API routes (GitHub repos, blog posts, contact form)
  - `blog/` - Blog listing and individual post pages
- `components/` - React components (Hero, About, Services, Projects, etc.)
- `lib/` - Shared utilities and business logic
  - `cache.ts` - File-based caching system (FileCache, GitHubCache)
  - `markdown.ts` - Blog post processing (gray-matter + remark)
  - `theme.tsx` - Theme provider for light/dark mode
- `content/blog/` - Markdown blog posts with frontmatter

### Key Components
- **Layout & Navigation**: `layout.tsx`, `Navbar.tsx`, `Footer.tsx`, `NavProgressBar.tsx`
- **Landing Page Sections**: `Hero.tsx`, `About.tsx`, `Services.tsx`, `Skills.tsx`, `Projects.tsx`, `Testimonials.tsx`, `Blog.tsx`, `Contact.tsx`
- **Accessibility**: `SkipNav.tsx` for keyboard navigation, `Breadcrumb.tsx` for page hierarchy
- **Error Handling**: `ErrorBoundary.tsx` for graceful error recovery
- **UI Components**: `Button.tsx`, `LoadingSkeleton.tsx`

### API Routes

#### `/api/github/repos` (GET, DELETE)
- **GET**: Fetches GitHub repositories for the configured username
- Implements file-based caching with 1-hour TTL (`.cache/github/`)
- Returns fallback to stale cache on API errors/rate limits
- Comprehensive error handling: rate limits, timeouts, network errors, 404s
- Auto-generates project cards with gradients and language tags
- **DELETE**: Clears the GitHub cache

#### `/api/blog/posts` (GET)
- Returns all blog posts metadata from `content/blog/` directory
- Reads markdown files with frontmatter (title, date, excerpt, author, tags)

#### `/api/contact` (POST)
- Handles contact form submissions with validation and rate limiting
- In-memory rate limiting: 5 requests per minute per IP
- Optional Resend API integration for email delivery
- Input sanitization to prevent XSS

### Caching System

The custom `FileCache` class (`lib/cache.ts`) provides:
- File-based caching in `.cache/` directory with configurable TTL
- Automatic cache expiration and cleanup
- Cache info queries (age, TTL, expiration status)
- Specialized `GitHubCache` subclass for GitHub API responses

**Important**: The `.cache/` directory is gitignored but created at runtime. Cache files are stored as JSON with metadata (timestamp, TTL, key).

### Blog System

Blog posts are stored as Markdown files in `content/blog/` with frontmatter:
```markdown
---
title: "Post Title"
date: "2024-01-15"
excerpt: "Brief description"
author: "KenshinPH"
tags: ["tag1", "tag2"]
---
Post content...
```

Posts are processed using `gray-matter` for frontmatter parsing and `remark`/`remark-html` for Markdown to HTML conversion. Reading time is auto-calculated at 200 words per minute.

### Environment Variables

Configure in `.env` (see `.env.example`):
- `GITHUB_USERNAME` - GitHub username for project fetching (default: "ProTechPh")
- `GITHUB_TOKEN` - Optional GitHub PAT to increase rate limits from 60/hr to 5000/hr (requires `public_repo` scope)
- `RESEND_API_KEY` - Optional API key for contact form email delivery
- `CONTACT_EMAIL` - Recipient email for contact form (default: "jerickogarcia0@gmail.com")
- `GOOGLE_SITE_VERIFICATION` - Google Search Console verification
- `NEXT_PUBLIC_SITE_URL` - Site URL for metadata (default: "http://localhost:3000")
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics ID

### Path Aliases

TypeScript is configured with `@/*` as an alias for the root directory (`./`):
```typescript
import Hero from '@/components/Hero'
import { githubCache } from '@/lib/cache'
```

### Styling

- CSS Modules for component-scoped styles (e.g., `Hero.module.css`)
- Global styles in `app/globals.css`
- Inter font family loaded via `next/font/google` with optimized display swap
- CSS variables for theming (light/dark mode support via `lib/theme.tsx`)

### Analytics & SEO

- Vercel Analytics integrated via `@vercel/analytics/next`
- Custom Google Analytics component (`components/Analytics.tsx`)
- Comprehensive metadata configuration in `app/layout.tsx` (OpenGraph, Twitter Cards, robots, schema.org)
- Dynamic sitemap (`app/sitemap.ts`) and robots.txt (`app/robots.ts`)

## Development Notes

- The site uses Next.js App Router with a mix of server and client components
- Projects component uses SWR for data fetching with 5-minute refresh interval
- GitHub API integration includes retry logic and graceful degradation
- All API routes implement error handling and return appropriate HTTP status codes
- TypeScript strict mode is enabled (`strict: true`)
- Contact form includes CSRF protection via rate limiting and input sanitization
