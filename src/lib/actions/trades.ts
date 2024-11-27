// src/lib/actions/trades.ts
'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { tradeSchema, type TradeFormData, type Trade } from '@/types'

interface GetTradesOptions {
  limit?: number
  cursor?: string
}

interface GetTradesResult {
  trades: Trade[]
  nextCursor: string | null
  totalCount: number
}

export async function getTrades(
  userId: string,
  options: GetTradesOptions = {}
): Promise<GetTradesResult> {
  const { limit = 10, cursor } = options

  if (!userId) {
    return {
      trades: [],
      nextCursor: null,
      totalCount: 0
    }
  }

  try {
    // Get total count of all trades
    const totalCount = await prisma.trade.count({
      where: { userId }
    })

    // If cursor is provided, get trades created before the cursor
    // If no cursor, get the most recent trades
    const trades = await prisma.trade.findMany({
      where: {
        userId,
        ...(cursor ? {
          createdAt: {
            lt: new Date(cursor)
          }
        } : {})
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
    })

    // Check if there are more trades
    const hasMore = trades.length > limit
    const paginatedTrades = hasMore ? trades.slice(0, -1) : trades

    // Only set nextCursor if there are more trades and we have trades in current page
    const nextCursor = hasMore && paginatedTrades.length > 0
      ? paginatedTrades[paginatedTrades.length - 1].createdAt.toISOString()
      : null

    return {
      trades: paginatedTrades,
      nextCursor,
      totalCount
    }
  } catch (error) {
    console.error('Failed to fetch trades:', error)
    throw new Error('Failed to fetch trades')
  }
}

export async function createTrade(formData: TradeFormData): Promise<Trade> {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const validatedData = tradeSchema.parse(formData)

  try {
    const trade = await prisma.trade.create({
      data: {
        userId,
        ...validatedData,
        exitDate: validatedData.exitDate ? new Date(validatedData.exitDate) : null,
      },
    })

    revalidatePath('/trades')
    return trade
  } catch (error) {
    console.error('Failed to create trade:', error)
    throw new Error('Failed to create trade')
  }
}

export async function updateTrade(id: string, formData: TradeFormData): Promise<Trade> {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const validatedData = tradeSchema.parse(formData)

  const existingTrade = await prisma.trade.findUnique({
    where: { id },
    select: { userId: true },
  })

  if (!existingTrade) {
    throw new Error('Trade not found')
  }

  if (existingTrade.userId !== userId) {
    throw new Error('Not authorized to update this trade')
  }

  try {
    const trade = await prisma.trade.update({
      where: { id },
      data: {
        ...validatedData,
        exitDate: validatedData.exitDate ? new Date(validatedData.exitDate) : null,
      },
    })

    revalidatePath('/trades')
    return trade
  } catch (error) {
    console.error('Failed to update trade:', error)
    throw new Error('Failed to update trade')
  }
}

export async function deleteTrade(id: string): Promise<void> {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const trade = await prisma.trade.findUnique({
    where: { id },
    select: { userId: true },
  })

  if (!trade) {
    throw new Error('Trade not found')
  }

  if (trade.userId !== userId) {
    throw new Error('Not authorized to delete this trade')
  }

  try {
    await prisma.trade.delete({ where: { id } })
    revalidatePath('/trades')
  } catch (error) {
    console.error('Failed to delete trade:', error)
    throw new Error('Failed to delete trade')
  }
}