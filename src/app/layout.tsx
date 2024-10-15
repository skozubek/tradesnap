// src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './Providers'
import DynamicLayout from '@/components/DynamicLayout'

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
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Providers>
            <DynamicLayout>{children}</DynamicLayout>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}