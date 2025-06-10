import Link from 'next/link'
import { ArrowRight, Sparkles, Clock, Heart } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-gradient-warm overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-green-50 opacity-60" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-primary rounded-full opacity-10 transform translate-x-32 -translate-y-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-secondary rounded-full opacity-10 transform -translate-x-16 translate-y-16" />
      
      <div className="relative container section">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-200">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-700">
                Fresh • Bold • Wholesome
              </span>
            </div>
            
            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Warm Grain Bowls
                <span className="block text-primary-600">
                  Made Your Way
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
                Customize your perfect bowl with fresh ingredients, bold flavors, and wholesome nutrition. 
                Every bowl is crafted with care and packed with protein.
              </p>
            </div>
            
            {/* Features */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-green-500" />
                <span>Ready in 5-7 mins</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-green-500" />
                <span>Made fresh daily</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-green-500" />
                <span>Fully customizable</span>
              </div>
            </div>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/build" className="btn btn-primary btn-lg group">
                Build Your Bowl
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link href="/menu" className="btn btn-outline btn-lg">
                View Menu
              </Link>
            </div>
            
            {/* Social proof */}
            <div className="pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">Trusted by thousands of bowl lovers</p>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">50K+</div>
                  <div className="text-xs text-gray-500">Bowls served</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">4.8★</div>
                  <div className="text-xs text-gray-500">Customer rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">15+</div>
                  <div className="text-xs text-gray-500">Locations</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative animate-slide-up">
            <div className="relative">
              {/* Main bowl image placeholder */}
              <div className="w-full h-96 lg:h-[500px] bg-gradient-to-br from-brown-200 via-brown-300 to-brown-400 rounded-3xl shadow-large flex items-center justify-center">
                <div className="text-center text-brown-700">
                  <div className="w-24 h-24 mx-auto mb-4 bg-brown-500 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🍲</span>
                  </div>
                  <p className="text-lg font-medium">Delicious Grain Bowl</p>
                  <p className="text-sm opacity-75">Image placeholder</p>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-secondary-400 rounded-2xl shadow-medium flex items-center justify-center animate-pulse-soft">
                <span className="text-2xl">🥗</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400 rounded-xl shadow-medium flex items-center justify-center animate-pulse-soft">
                <span className="text-xl">🌱</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
