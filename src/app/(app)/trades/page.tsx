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

const TRADES_PER_PAGE = 10

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

async function TradesPage({ searchParams }: PageProps) {
  const { userId } = await auth()

  if (!userId) {
    return <div>Please sign in to view your trades</div>
  }

  try {
    const params = await searchParams; // Ensure searchParams is awaited
    const cursorParam = params?.cursor; // Access properties after awaiting
    const cursor = typeof cursorParam === 'string' ? cursorParam : undefined

    const { trades, nextCursor, totalCount } = await getTrades(userId, {
      limit: TRADES_PER_PAGE,
      cursor
    })

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">Your Trades</h1>
          </div>
          <Suspense fallback={<TradesLoading />}>
            <TradeList
              initialTrades={trades}
              nextCursor={nextCursor}
              totalCount={totalCount}
              userId={userId}
            />
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching trades:', error)
    return (
      <div className="p-4 text-red-500">
        Failed to load trades. Please try again later.
      </div>
    )
  }
}

export default TradesPage