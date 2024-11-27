// src/app/api/trades/route.ts
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { createAppError } from '@/lib/error-utils';
import { withApiErrorHandling } from '@/lib/api-utils';
import type { Trade, PaginatedApiResponse } from '@/types';

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

export async function GET(request: Request) {
  return withApiErrorHandling(async () => {
    const { userId } = await auth();
    if (!userId) {
      console.error('GET /api/trades: No userId found');
      throw createAppError('auth', 'Unauthorized', { status: 401 });
    }

    const url = new URL(request.url);
    const cursor = url.searchParams.get('cursor');
    const requestedLimit = parseInt(url.searchParams.get('limit') || String(DEFAULT_PAGE_SIZE));
    const limit = Math.min(Math.max(1, requestedLimit), MAX_PAGE_SIZE);

    console.log('GET /api/trades: Handling request', {
      userId,
      cursor,
      limit
    });

    try {
      const totalCount = await prisma.trade.count({
        where: { userId }
      });

      console.log(`GET /api/trades: Total trade count: ${totalCount}`);

      const trades = await prisma.trade.findMany({
        where: {
          userId,
          ...(cursor
            ? {
                createdAt: {
                  lt: new Date(cursor)
                }
              }
            : {})
        },
        take: limit + 1,
        orderBy: {
          createdAt: 'desc'
        },
      });

      console.log(`GET /api/trades: Fetched ${trades.length} trades`);

      const hasNext = trades.length > limit;
      const items = hasNext ? trades.slice(0, -1) : trades;
      const nextCursor = hasNext ? items[items.length - 1].createdAt.toISOString() : null; // Changed to null

      console.log('GET /api/trades: Pagination info', {
        hasNext,
        itemsReturned: items.length,
        nextCursor
      });

      // Ensure the response data is properly structured
      const responseData = {
        success: true as const,
        data: {
          items: items.map(item => ({
            ...item,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
            exitDate: item.exitDate?.toISOString() || null
          })),
          nextCursor: nextCursor,
          totalCount
        }
      };

      console.log('GET /api/trades: Response being prepared:', JSON.stringify(responseData));

      // Use Response constructor directly
      return new Response(JSON.stringify(responseData), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        },
      });

    } catch (error) {
      console.error('GET /api/trades: Database error:', error);
      throw createAppError(
        'database',
        'Failed to fetch trades',
        { status: 500 }
      );
    }
  });
}