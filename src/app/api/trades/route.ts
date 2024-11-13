// src/app/api/trades/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

const TradeSchema = z.object({
  symbol: z.string().min(1).max(20),
  direction: z.enum(['LONG', 'SHORT']),
  entryPrice: z.number().positive(),
  stopLoss: z.number().optional(),
  takeProfit: z.number().optional(),
  quantity: z.number().positive(),
  timeframe: z.string().min(1),
  strategy: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['OPEN', 'CLOSED']),
  exitPrice: z.number().optional(),
  exitDate: z.string().datetime().optional(),
});

export async function GET(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const strategy = searchParams.get('strategy');

    const where = {
      userId,
      ...(status && { status }),
      ...(strategy && { strategy }),
    };

    const trades = await prisma.trade.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(trades);
  } catch (error) {
    console.error('Error fetching trades:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = TradeSchema.parse(body);

    const newTrade = await prisma.trade.create({
      data: {
        userId,
        ...validatedData,
      },
    });

    return NextResponse.json(newTrade, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating trade:', error);
    return NextResponse.json(
      { error: 'Failed to create trade' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tradeId = searchParams.get('id');

    if (!tradeId) {
      return NextResponse.json(
        { error: 'Trade ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = TradeSchema.parse(body);

    // Verify trade belongs to user
    const existingTrade = await prisma.trade.findUnique({
      where: { id: tradeId },
    });

    if (!existingTrade) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      );
    }

    if (existingTrade.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const updatedTrade = await prisma.trade.update({
      where: { id: tradeId },
      data: validatedData,
    });

    return NextResponse.json(updatedTrade);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating trade:', error);
    return NextResponse.json(
      { error: 'Failed to update trade' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tradeId = searchParams.get('id');

    if (!tradeId) {
      return NextResponse.json(
        { error: 'Trade ID is required' },
        { status: 400 }
      );
    }

    // Verify trade belongs to user
    const existingTrade = await prisma.trade.findUnique({
      where: { id: tradeId },
    });

    if (!existingTrade) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      );
    }

    if (existingTrade.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await prisma.trade.delete({
      where: { id: tradeId },
    });

    return NextResponse.json(
      { message: 'Trade deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting trade:', error);
    return NextResponse.json(
      { error: 'Failed to delete trade' },
      { status: 500 }
    );
  }
}