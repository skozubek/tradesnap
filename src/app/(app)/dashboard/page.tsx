// src/app/(app)/dashboard/page.tsx
import { Suspense } from 'react'
import { getDashboardMetrics } from '@/lib/actions/metrics'
import { getTrades } from '@/lib/actions/trades'
import { auth } from '@clerk/nextjs/server'
import MetricWidget from '@/components/MetricWidget'
import Calendar from '@/components/Calendar'
import RecentTrades from '@/components/RecentTrades'

const RECENT_TRADES_LIMIT = 3

async function DashboardContent() {
  try {
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    const [metrics, tradesData] = await Promise.all([
      getDashboardMetrics(),
      getTrades(userId, { limit: RECENT_TRADES_LIMIT })
    ])

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricWidget
            title="Total P&L"
            value={`$${metrics.totalPnL.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`}
            trend={metrics.totalPnL >= 0 ? 'up' : 'down'}
            percentage={`${metrics.totalTrades} trades`}
          />
          <MetricWidget
            title="Win Rate"
            value={`${metrics.winRate.toFixed(1)}%`}
            trend={metrics.winRate >= 50 ? 'up' : 'down'}
            percentage={`${metrics.winningTrades}W/${metrics.losingTrades}L`}
          />
          <MetricWidget
            title="Total Trades"
            value={metrics.totalTrades.toString()}
            trend="up"
            percentage="Closed trades"
          />
        </div>

        <RecentTrades trades={tradesData.trades} />
        <Calendar tradesByDate={metrics.tradesByDate} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return (
      <div className="p-4 text-red-500">
        Failed to load dashboard. Please try again later.
      </div>
    )
  }
}

function DashboardLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-card text-card-foreground rounded-lg shadow p-6 animate-pulse">
          <div className="h-4 w-24 bg-muted rounded mb-4" />
          <div className="h-8 w-32 bg-muted rounded" />
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        </div>
        <Suspense fallback={<DashboardLoading />}>
          <DashboardContent />
        </Suspense>
      </div>
    </div>
  )
}