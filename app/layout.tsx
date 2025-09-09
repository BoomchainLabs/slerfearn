import React from 'react'

export const metadata = {
  title: 'SlerfHub - Web3 Rewards Platform',
  description: 'Earn $SLERF tokens through daily missions, staking, gaming, and social activities in the ultimate Web3 rewards ecosystem',
  manifest: '/manifest.json',
  themeColor: '#FF6B35',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SlerfHub'
  },
  openGraph: {
    title: 'SlerfHub - Web3 Rewards Platform',
    description: 'Earn $SLERF tokens through daily missions, staking, gaming, and social activities',
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SlerfHub - Web3 Rewards Platform',
    description: 'Earn $SLERF tokens through daily missions, staking, gaming, and social activities'
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'SlerfHub',
    'application-name': 'SlerfHub',
    'msapplication-TileColor': '#FF6B35',
    'msapplication-tap-highlight': 'no'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/icon-192x192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/icons/icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="96x96" href="/icons/icon-96x96.png" />
        <link rel="apple-touch-icon" sizes="128x128" href="/icons/icon-128x128.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="mask-icon" href="/icons/icon-192x192.png" color="#FF6B35" />
        <script async src="/register-sw.js"></script>
      </head>
      <body className="touch-manipulation select-none overscroll-none">
        {children}
      </body>
    </html>
  )
}
