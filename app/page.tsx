import { Metadata } from 'next'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Services from '@/components/Services'
import Skills from '@/components/Skills'
import Projects from '@/components/Projects'
import Testimonials from '@/components/Testimonials'
import Blog from '@/components/Blog'
import Contact from '@/components/Contact'

export const metadata: Metadata = {
  title: 'Home',
  description: 'ProTech - Professional Technology Solutions. Transforming ideas into cutting-edge digital experiences with innovative technology and expert craftsmanship.',
  openGraph: {
    title: 'ProTech | Professional Technology Solutions',
    description: 'Transforming ideas into cutting-edge digital experiences with innovative technology and expert craftsmanship',
    url: '/',
  },
}

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Services />
      <Skills />
      <Projects />
      <Testimonials />
      <Blog />
      <Contact />
    </main>
  )
}

