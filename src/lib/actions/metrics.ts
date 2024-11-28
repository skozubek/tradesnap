// src/lib/actions/metrics.ts
'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export interface DashboardMetrics {
  totalPnL: number
  totalTrades: number
  winRate: number
  winningTrades: number
  losingTrades: number
  tradesByDate: Record<string, { pnl: number; trades: number }>
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  try {
    const closedTrades = await prisma.trade.findMany({
      where: {
        userId,
        status: 'CLOSED',
        pnl: { not: null }
      },
      select: {
        pnl: true,
        createdAt: true
      }
    })

    const totalTrades = closedTrades.length
    const totalPnL = closedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0)
    const winningTrades = closedTrades.filter(trade => (trade.pnl || 0) > 0).length
    const losingTrades = closedTrades.filter(trade => (trade.pnl || 0) < 0).length
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0

    const tradesByDate = closedTrades.reduce((acc, trade) => {
      const date = trade.createdAt.toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { pnl: 0, trades: 0 }
      }
      acc[date].pnl += trade.pnl || 0
      acc[date].trades += 1
      return acc
    }, {} as DashboardMetrics['tradesByDate'])

    return {
      totalPnL,
      totalTrades,
      winRate,
      winningTrades,
      losingTrades,
      tradesByDate
    }
  } catch (error) {
    console.error('Failed to fetch dashboard metrics:', error)
    throw new Error('Failed to fetch dashboard metrics')
  }
}