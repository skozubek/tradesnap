// File: app/layout.tsx
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './Providers'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TradeSnap',
  description: 'One-click trade journaling and sharing platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}