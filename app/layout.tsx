import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'HBS Entrepreneurship Summit 2026',
  description: 'Digital program for the Harvard Business School Entrepreneurship Summit 2026. March 29 — 30+ founders, $5B+ raised.',
  openGraph: {
    title: 'HBS Entrepreneurship Summit 2026',
    description: 'Harvard Business School · March 29 · 30+ Founders · $5B+ Raised',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={playfair.variable}>
      <body>
        {children}
      </body>
    </html>
  )
}
