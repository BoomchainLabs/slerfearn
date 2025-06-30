import React from 'react'
import './globals.css'
import { Inter, Orbitron, Audiowide, JetBrains_Mono } from 'next/font/google'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

const audiowide = Audiowide({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-audiowide',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata = {
  title: '$LERF Rewards Hub - Earn Real Crypto Rewards',
  description: 'Professional Web3 platform offering authentic $LERF token rewards through daily trivia, staking, and community engagement. Join the future of decentralized rewards.',
  keywords: 'LERF, crypto rewards, Web3, blockchain, DeFi, staking, trivia, NFT, Base network',
  openGraph: {
    title: '$LERF Rewards Hub - Earn Real Crypto Rewards',
    description: 'Professional Web3 platform offering authentic $LERF token rewards through daily trivia, staking, and community engagement.',
    url: 'https://boomchainlab.com',
    siteName: '$LERF Rewards Hub',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: '$LERF Rewards Hub'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '$LERF Rewards Hub - Earn Real Crypto Rewards',
    description: 'Professional Web3 platform offering authentic $LERF token rewards.',
    images: ['/api/og'],
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} ${audiowide.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 font-inter antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(15, 23, 42, 0.9)',
                color: '#f1f5f9',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                backdropFilter: 'blur(12px)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}