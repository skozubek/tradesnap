// src/app/trades/page.tsx
import { Suspense } from 'react'
import { getTradesForUser } from '@/lib/server/trades'
import { TradeList } from '@/components/trades/TradeList'
import { TradesLoading } from '@/components/trades/TradesLoading'
import { TradesError } from '@/components/trades/TradesError'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export const metadata = {
  title: 'Your Trades - TradeSnap',
  description: 'View and manage your trading history'
}

async function TradesContent() {
  try {
    const paginatedTrades = await getTradesForUser();

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Trades</h1>
        </div>
        <TradeList initialData={paginatedTrades} />
      </div>
    )
  } catch (error) {
    return <TradesError error={error instanceof Error ? error.message : 'Failed to load trades'} />
  }
}

export default function TradesPage() {
  return (
    <ErrorBoundary fallback={<TradesError />}>
      <Suspense fallback={<TradesLoading />}>
        <div className="min-h-screen bg-white dark:bg-gray-800 text-foreground">
          <TradesContent />
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}