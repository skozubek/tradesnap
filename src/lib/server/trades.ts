// src/lib/server/trades.ts
import { cache } from 'react'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import type { ActionResult } from '@/lib/actions/trades'
import type { Trade } from '@prisma/client'

export const getTradesForUser = cache(async (): Promise<Trade[]> => {
    const { userId } = await auth();
  
    if (!userId) {
      throw new Error('Unauthorized');
    }

    return unstable_cache(
      async () => {
        try {
          const trades = await prisma.trade.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
          });
          return trades;
        } catch (error) {
          console.error('Failed to fetch trades:', error);
          throw new Error('Failed to fetch trades');
        }
      },
      [`trades-${userId}`], // Ensure this is a string
      {
        revalidate: process.env.NODE_ENV === 'development' ? false : 60, // Changed from `0` to `false`
        tags: [`user-${userId}-trades`],
      }
    )();
  });

// Helper for single trade fetch using existing types
export async function getTradeById(id: string): Promise<ActionResult<Trade | null>> {
  const { userId } = await auth()
  
  if (!userId) {
    return {
      error: {
        type: 'auth',
        message: 'Unauthorized'
      }
    }
  }

  try {
    const trade = await prisma.trade.findUnique({
      where: { id }
    })

    if (trade && trade.userId !== userId) {
      return {
        error: {
          type: 'auth',
          message: 'Unauthorized'
        }
      }
    }

    return { data: trade }
  } catch (error) {
    return {
      error: {
        type: 'database',
        message: 'Failed to fetch trade'
      }
    }
  }
}