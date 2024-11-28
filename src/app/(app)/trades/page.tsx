// src/app/(app)/trades/page.tsx
import { Suspense } from 'react'
import { auth } from '@clerk/nextjs/server'
import { getTrades } from '@/lib/actions/trades'
import { TradeList } from '@/components/trades/TradeList'
import { TradesLoading } from '@/components/trades/TradesLoading'
import type { TradeFilters } from '@/types'

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

    const params = await searchParams
    const selectedTradeId = typeof params.selected === 'string' ? params.selected : undefined

    // Extract filters from URL params
    const filters: TradeFilters = {
      status: typeof params.status === 'string' ? params.status as TradeFilters['status'] : undefined,
      type: typeof params.type === 'string' ? params.type as TradeFilters['type'] : undefined,
      strategy: typeof params.strategy === 'string' ? params.strategy : undefined,
      timeframe: typeof params.timeframe === 'string' ? params.timeframe as TradeFilters['timeframe'] : undefined,
      symbol: typeof params.symbol === 'string' ? params.symbol : undefined,
      dateFrom: typeof params.dateFrom === 'string' ? params.dateFrom : undefined,
      dateTo: typeof params.dateTo === 'string' ? params.dateTo : undefined,
      profitability: typeof params.profitability === 'string'
        ? params.profitability as TradeFilters['profitability']
        : undefined
    }

    // If we have a selected trade ID, filter for just that trade
    const tradeFilters = selectedTradeId
      ? { id: selectedTradeId }
      : Object.keys(filters).length > 0
        ? filters
        : undefined

    // Clean up undefined values
    if (tradeFilters) {
      Object.keys(tradeFilters).forEach(key => {
        if (tradeFilters[key as keyof typeof tradeFilters] === undefined) {
          delete tradeFilters[key as keyof typeof tradeFilters]
        }
      })
    }

    const cursorParam = params?.cursor
    const cursor = typeof cursorParam === 'string' ? cursorParam : undefined

    const { trades, nextCursor, totalCount } = await getTrades(userId, {
      limit: selectedTradeId ? 1 : TRADES_PER_PAGE,
      cursor,
      filters: tradeFilters
    })

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">
              {selectedTradeId ? 'Trade Details' : 'Your Trades'}
            </h1>
          </div>
          <Suspense fallback={<TradesLoading />}>
            <TradeList
              initialTrades={trades}
              nextCursor={nextCursor}
              totalCount={totalCount}
              userId={userId}
              selectedTradeId={selectedTradeId}
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