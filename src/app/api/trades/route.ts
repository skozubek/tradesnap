// src/app/api/trades/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const trades = await prisma.trade.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(trades);
  } catch (error) {
    console.error('Error fetching trades:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Trade ID is required', { status: 400 });
    }

    const trade = await prisma.trade.findUnique({
      where: { id },
    });

    if (!trade) {
      return new NextResponse('Trade not found', { status: 404 });
    }

    if (trade.userId !== userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.trade.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Trade deleted successfully' });
  } catch (error) {
    console.error('Error deleting trade:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}