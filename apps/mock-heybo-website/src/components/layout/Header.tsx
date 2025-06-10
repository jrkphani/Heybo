'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ShoppingBag, User } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'BREAKFAST', href: '/breakfast' },
    { name: 'KARAAGE', href: '/karaage' },
    { name: 'UDON & RICE', href: '/udon-rice' },
    { name: 'SIDES & SNACKS', href: '/sides' },
    { name: 'BEVERAGES', href: '/beverages' },
  ]

  return (
    <header className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 sticky top-0 z-40 shadow-lg">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/brand/heybo-logo.png"
                alt="HeyBo"
                width={120}
                height={40}
                className="h-8 w-auto brightness-0 invert"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-yellow-200 font-medium text-sm transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-white hover:text-yellow-200 transition-colors duration-200">
              <User className="w-5 h-5" />
            </button>
            <button className="p-2 text-white hover:text-yellow-200 transition-colors duration-200 relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </button>
            <Link href="/order" className="bg-white text-orange-600 px-4 py-2 rounded-full font-medium hover:bg-yellow-100 transition-colors duration-200">
              Order Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white hover:text-yellow-200 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-orange-300 py-4 animate-slide-up bg-orange-500">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-yellow-200 font-medium transition-colors duration-200 px-4 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center justify-between px-4 pt-4 border-t border-orange-300">
                <div className="flex items-center space-x-4">
                  <button className="p-2 text-white hover:text-yellow-200 transition-colors duration-200">
                    <User className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-white hover:text-yellow-200 transition-colors duration-200 relative">
                    <ShoppingBag className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      0
                    </span>
                  </button>
                </div>
                <Link href="/order" className="bg-white text-orange-600 px-3 py-2 rounded-full font-medium text-sm">
                  Order Now
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
