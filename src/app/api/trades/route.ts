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
  timeframe: z.string().min(1).optional(),
  strategy: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['OPEN', 'CLOSED']),
  exitPrice: z.number().optional(),
  exitDate: z.string().datetime().optional(),
});

// Add GET handler to fetch trades
export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const trades = await prisma.trade.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(trades);
  } catch (error) {
    console.error('Error fetching trades:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trades' },
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

    // Map the form data to match Prisma schema
    const tradeData = {
      userId,
      symbol: validatedData.symbol,
      type: validatedData.direction === 'LONG' ? 'BUY' : 'SELL',
      price: validatedData.entryPrice,
      amount: validatedData.quantity,
      stopLoss: validatedData.stopLoss,
      takeProfit: validatedData.takeProfit,
      status: validatedData.status,
      notes: validatedData.notes,
      strategyName: validatedData.strategy, // Map strategy to strategyName
      timeframe: validatedData.timeframe,
      exitPrice: validatedData.exitPrice,
      exitDate: validatedData.exitDate ? new Date(validatedData.exitDate) : undefined,
    };

    console.log('Creating trade with data:', tradeData);

    const newTrade = await prisma.trade.create({
      data: tradeData,
    });

    return NextResponse.json(newTrade, { status: 201 });
  } catch (error) {
    console.error('Error creating trade:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
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

    const tradeData = {
      symbol: validatedData.symbol,
      type: validatedData.direction === 'LONG' ? 'BUY' : 'SELL',
      price: validatedData.entryPrice,
      amount: validatedData.quantity,
      stopLoss: validatedData.stopLoss,
      takeProfit: validatedData.takeProfit,
      status: validatedData.status,
      notes: validatedData.notes,
      strategyName: validatedData.strategy, // Map strategy to strategyName
      timeframe: validatedData.timeframe,
      exitPrice: validatedData.exitPrice,
      exitDate: validatedData.exitDate ? new Date(validatedData.exitDate) : undefined,
    };

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
      data: tradeData,
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