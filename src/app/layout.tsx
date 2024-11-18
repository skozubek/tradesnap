// src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './Providers'
import DynamicLayout from '@/components/DynamicLayout'
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from 'next-themes';

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClerkProvider dynamic>
            <DynamicLayout>{children}</DynamicLayout>
            <Toaster />
          </ClerkProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}