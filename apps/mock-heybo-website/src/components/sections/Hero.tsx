import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, Clock, Heart } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-400 overflow-hidden min-h-[600px]">
      {/* Background decoration with brush strokes */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-300/20 via-yellow-300/20 to-orange-400/20" />

      {/* Brush stroke effects */}
      <div className="absolute top-0 right-0 w-full h-full">
        <svg className="w-full h-full" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M200 100 Q400 50 600 150 Q700 200 800 100" stroke="rgba(255,255,255,0.1)" strokeWidth="40" fill="none"/>
          <path d="M0 300 Q200 250 400 350 Q600 400 800 300" stroke="rgba(255,255,255,0.1)" strokeWidth="60" fill="none"/>
          <path d="M100 500 Q300 450 500 550 Q700 600 800 500" stroke="rgba(255,255,255,0.1)" strokeWidth="30" fill="none"/>
        </svg>
      </div>

      <div className="relative container section">
        <div className="text-center space-y-8">
          {/* Main Title - Tokyo Yokocho Style */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-red-500 text-white px-6 py-2 rounded-full text-sm font-bold transform -rotate-2">
              <span>ORIGINAL TASTE</span>
              <span>FROM</span>
              <span>SHIBUYA</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-none tracking-tight">
              <span className="block text-stroke-black">TOKYO</span>
              <span className="block text-yellow-300 -mt-4">YOKOCHO</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl mx-auto">
              Authentic Japanese street food experience with bold flavors and fresh ingredients
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link href="/menu" className="bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-yellow-100 transition-colors duration-200 shadow-lg">
              Order Now
            </Link>
          </div>

          {/* Food Images */}
          <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
            {/* Left Bowl */}
            <div className="relative">
              <div className="w-full h-64 bg-white rounded-3xl shadow-xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <Image
                  src="/food/kampong-table.png"
                  alt="Tori Sasaki Bowl"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              {/* Rating and info overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3">
                <h3 className="font-bold text-gray-900">Tori Sasaki</h3>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium">4.5</span>
                  </div>
                  <span className="text-sm text-gray-600">45.5</span>
                </div>
              </div>
              {/* NEW badge */}
              <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                NEW
              </div>
            </div>

            {/* Right Bowl */}
            <div className="relative">
              <div className="w-full h-64 bg-white rounded-3xl shadow-xl overflow-hidden transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <Image
                  src="/food/spice-trade.png"
                  alt="Una Umai Bowl"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Rating and info overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3">
                <h3 className="font-bold text-gray-900">Una Umai</h3>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium">3.7</span>
                  </div>
                  <span className="text-sm text-gray-600">37.4</span>
                </div>
              </div>
              {/* NEW badge */}
              <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                NEW
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
