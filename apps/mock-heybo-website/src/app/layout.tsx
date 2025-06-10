import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3001'),
  title: 'HeyBo - Warm Grain Bowls | Order Online',
  description: 'Order delicious, customizable warm grain bowls from HeyBo. Fresh ingredients, bold flavors, and wholesome nutrition delivered to your door.',
  keywords: 'grain bowls, healthy food, warm bowls, protein bowls, HeyBo, food delivery, custom bowls',
  authors: [{ name: 'HeyBo Team' }],
  creator: 'HeyBo',
  publisher: 'HeyBo',
  robots: 'noindex, nofollow', // Development site - prevent indexing
  openGraph: {
    type: 'website',
    locale: 'en_SG',
    url: 'http://localhost:3001',
    title: 'HeyBo - Warm Grain Bowls | Order Online',
    description: 'Order delicious, customizable warm grain bowls from HeyBo. Fresh ingredients, bold flavors, and wholesome nutrition.',
    siteName: 'HeyBo',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HeyBo - Warm Grain Bowls',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HeyBo - Warm Grain Bowls | Order Online',
    description: 'Order delicious, customizable warm grain bowls from HeyBo. Fresh ingredients, bold flavors, and wholesome nutrition.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
}

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: '#F97316', // HeyBo primary orange
    colorScheme: 'light',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          as="style"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          />
        </noscript>
        
        {/* Favicon and app icons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* PWA manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Theme color for mobile browsers */}
        <meta name="msapplication-TileColor" content="#F97316" />
        
        {/* Development environment indicator */}
        <meta name="environment" content="development" />
        
        {/* Chatbot widget preparation */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prepare global namespace for chatbot widget
              window.HeyBoWidget = window.HeyBoWidget || {};
              window.HeyBoWidget.config = {
                apiUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://api.heybo.sg',
                environment: 'development',
                debug: true,
                theme: 'heybo-warm'
              };
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Development banner */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-500 text-yellow-900 text-center py-2 px-4 text-sm font-medium">
            🚧 Development Environment - Mock HeyBo Website for Chatbot Testing
          </div>
        )}
        
        {/* Main content */}
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        
        {/* HeyBo Chatbot Widget Integration */}
        <div id="heybo-chatbot-root" />
        
        {/* Development tools */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 left-4 z-50">
            <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-xs font-mono">
              Mock HeyBo Website v1.0
            </div>
          </div>
        )}
      </body>
    </html>
  )
}
