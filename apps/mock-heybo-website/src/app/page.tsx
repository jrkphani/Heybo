import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Hero from '@/components/sections/Hero'
import FeaturedBowls from '@/components/sections/FeaturedBowls'
import WhyHeyBo from '@/components/sections/WhyHeyBo'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'HeyBo - Warm Grain Bowls | Fresh, Bold, Wholesome',
  description: 'Discover HeyBo\'s signature warm grain bowls. Customizable, protein-packed, and made with fresh ingredients. Order online for pickup or delivery.',
}

export default function HomePage() {
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Featured Bowls Section */}
      <FeaturedBowls />
      
      {/* Why HeyBo Section */}
      <WhyHeyBo />
      
      {/* Footer */}
      <Footer />
    </>
  )
}
