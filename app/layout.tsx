import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import SkipNav from '@/components/SkipNav'
import NavProgressBar from '@/components/NavProgressBar'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GoogleAnalytics from '@/components/Analytics'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
})

export const metadata: Metadata = {
  title: {
    default: 'ProTech | Professional Technology Solutions',
    template: '%s | ProTech',
  },
  description: 'ProTech - Professional Technology Solutions Portfolio. Transforming ideas into cutting-edge digital experiences with innovative technology and expert craftsmanship.',
  keywords: ['web development', 'technology solutions', 'portfolio', 'software development', 'UI/UX design', 'cloud solutions', 'Next.js', 'React', 'TypeScript'],
  authors: [{ name: 'KenshinPH', url: 'https://github.com/ProTechPh' }],
  creator: 'KenshinPH',
  publisher: 'ProTech',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'ProTech',
    title: 'ProTech | Professional Technology Solutions',
    description: 'Transforming ideas into cutting-edge digital experiences with innovative technology and expert craftsmanship',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ProTech - Professional Technology Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProTech | Professional Technology Solutions',
    description: 'Transforming ideas into cutting-edge digital experiences with innovative technology and expert craftsmanship',
    creator: '@ProTechPh',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ProTech',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/logo.png`,
              description: 'Professional Technology Solutions - Transforming ideas into cutting-edge digital experiences',
              sameAs: ['https://github.com/ProTechPh'],
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'jerickogarcia0@gmail.com',
                contactType: 'Customer Service',
              },
            }),
          }}
        />
      </head>
      <body className={inter.variable}>
        <NavProgressBar />
        <SkipNav />
        <GoogleAnalytics />
        <Navbar />
        <main id="main-content">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}

