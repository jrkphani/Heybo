import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Hero from '@/components/sections/Hero'
import FeaturedBowls from '@/components/sections/FeaturedBowls'
import Footer from '@/components/layout/Footer'
import { ChatbotWidget } from '@/components/ChatbotWidget'

export const metadata: Metadata = {
  title: 'Tokyo Yokocho - Premium Japanese Street Food | Singapore',
  description: 'Experience authentic Japanese street food with bold flavors and fresh ingredients. Premium food from Singapore.',
}

export default function HomePage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Featured Bowls Section */}
      <FeaturedBowls />

      {/* Footer */}
      <Footer />

      {/* HeyBo Chatbot Widget */}
      <ChatbotWidget />
    </>
  )
}
