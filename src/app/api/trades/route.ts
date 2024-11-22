// src/app/api/trades/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const url = new URL(request.url);
    const cursor = url.searchParams.get('cursor');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const trades = await prisma.trade.findMany({
      where: { userId },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    const headersList = await headers();
    const revalidate = headersList.get('x-revalidate');

    let nextCursor: string | undefined = undefined;
    if (trades.length > limit) {
      const nextItem = trades.pop();
      nextCursor = nextItem?.id;
    }

    const totalCount = await prisma.trade.count({
      where: { userId }
    });

    return NextResponse.json(
      {
        trades,
        nextCursor,
        totalCount
      },
      {
        headers: {
          'Cache-Control': revalidate ? 'no-cache' : 's-maxage=60, stale-while-revalidate=30'
        }
      }
    );
  } catch (error) {
    console.error('Error fetching trades:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}