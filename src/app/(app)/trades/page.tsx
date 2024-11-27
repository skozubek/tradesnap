// src/app/(app)/trades/page.tsx
import { Suspense } from 'react'
import { auth } from '@clerk/nextjs/server'
import { getTrades } from '@/lib/actions/trades'
import { TradeList } from '@/components/trades/TradeList'
import { TradesLoading } from '@/components/trades/TradesLoading'

export const metadata = {
  title: 'Your Trades - TradeSnap',
  description: 'View and manage your trading history'
}

async function TradesContent() {
  const { userId } = await auth()

  if (!userId) {
    return <div>Please sign in to view your trades</div>
  }

  const trades = await getTrades(userId)
  return <TradeList initialTrades={trades} />
}

export default function TradesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Your Trades</h1>
        </div>
        <Suspense fallback={<TradesLoading />}>
          <TradesContent />
        </Suspense>
      </div>
    </div>
  )
}