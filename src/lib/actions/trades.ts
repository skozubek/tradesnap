// src/lib/actions/trades.ts
'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { validateTradeForm, type TradeFormData } from '@/lib/validations/trade'

export async function getTrades(userId: string, options: { limit?: number; cursor?: string } = {}) {
  const { limit = 10, cursor } = options

  if (!userId) {
    return {
      trades: [],
      nextCursor: null,
      totalCount: 0
    }
  }

  try {
    const totalCount = await prisma.trade.count({
      where: { userId }
    })

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

    const hasMore = trades.length > limit
    const paginatedTrades = hasMore ? trades.slice(0, -1) : trades
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

export async function createTrade(formData: TradeFormData) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  try {
    const validatedData = validateTradeForm(formData)

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
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to create trade')
  }
}

export async function updateTrade(id: string, formData: TradeFormData) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const validatedData = validateTradeForm(formData)

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
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to update trade')
  }
}

export async function deleteTrade(id: string) {
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