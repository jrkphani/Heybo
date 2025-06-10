import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  preload: true,
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "LULU - HeyBo AI Assistant",
  description: "Meet LULU, your AI-powered warm grain bowl ordering assistant from HeyBo",
  keywords: ["LULU", "HeyBo", "chatbot", "AI", "grain bowls", "food ordering", "assistant"],
  authors: [{ name: "1CloudHub" }],
  creator: "1CloudHub",
  robots: {
    index: false, // Widget should not be indexed
    follow: false,
  },
  icons: {
    icon: [
      {
        url: 'https://d1cz3dbw9lrv6.cloudfront.net/favicon.png',
        type: 'image/png',
      },
    ],
    shortcut: 'https://d1cz3dbw9lrv6.cloudfront.net/favicon.png',
    apple: 'https://d1cz3dbw9lrv6.cloudfront.net/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} ${inter.variable}`} style={{ fontFamily: 'var(--font-inter), system-ui, arial, sans-serif' }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
