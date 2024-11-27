// src/app/actions/trades.ts
'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { tradeSchema, type TradeFormData, type Trade } from '@/types'

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

// For Server Components
export async function getTrades(userId: string): Promise<Trade[]> {
  if (!userId) return []

  try {
    return await prisma.trade.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error('Failed to fetch trades:', error)
    throw new Error('Failed to fetch trades')
  }
}