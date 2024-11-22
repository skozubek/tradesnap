// src/lib/server/trades.ts
import { cache } from 'react'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import type { ActionResult } from '@/lib/actions/trades'
import type { Trade } from '@prisma/client'

export type PaginatedTrades = {
  trades: Trade[];
  nextCursor?: string;
  totalCount: number;
}

export const getTradesForUser = cache(async (
  cursor?: string,
  limit: number = 10
): Promise<PaginatedTrades> => {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  return unstable_cache(
    async () => {
      try {
        const [trades, totalCount] = await Promise.all([
          prisma.trade.findMany({
            where: { userId },
            take: limit + 1,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: 'desc' },
          }),
          prisma.trade.count({
            where: { userId }
          })
        ]);

        let nextCursor: string | undefined = undefined;

        if (trades.length > limit) {
          const nextItem = trades.pop();
          nextCursor = nextItem?.id;
        }

        return {
          trades,
          nextCursor,
          totalCount
        };
      } catch (error) {
        console.error('Failed to fetch trades:', error);
        throw new Error('Failed to fetch trades');
      }
    },
    [`trades-${userId}-${cursor}-${limit}`],
    {
      revalidate: process.env.NODE_ENV === 'development' ? false : 60,
      tags: [`user-${userId}-trades`],
    }
  )();
});

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