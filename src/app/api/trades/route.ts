// src/app/api/trades/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

const TradeSchema = z.object({
  symbol: z.string().min(1).max(20),
  direction: z.enum(['LONG', 'SHORT']),
  entryPrice: z.number().positive(),
  stopLoss: z.number().nullable().optional(),
  takeProfit: z.number().nullable().optional(),
  quantity: z.number().positive(),
  timeframe: z.string().min(1).optional(),
  strategyName: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  status: z.enum(['OPEN', 'CLOSED']),
  exitPrice: z.number().nullable().optional(),
  exitDate: z.string().datetime().nullable().optional(),
});

export async function GET() {
  try {
    const { userId } = await auth();
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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = TradeSchema.parse(body);

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
      strategyName: validatedData.strategyName,
      timeframe: validatedData.timeframe,
      exitPrice: validatedData.exitPrice,
      exitDate: validatedData.exitDate ? new Date(validatedData.exitDate) : null,
      pnl: validatedData.exitPrice && validatedData.status === 'CLOSED'
        ? (validatedData.exitPrice - validatedData.entryPrice) * validatedData.quantity *
          (validatedData.direction === 'LONG' ? 1 : -1)
        : null,
    };

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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Trade ID is required' }, { status: 400 });
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
      strategyName: validatedData.strategyName,
      timeframe: validatedData.timeframe,
      exitPrice: validatedData.exitPrice,
      exitDate: validatedData.exitDate ? new Date(validatedData.exitDate) : null,
      pnl: validatedData.exitPrice && validatedData.status === 'CLOSED'
        ? (validatedData.exitPrice - validatedData.entryPrice) * validatedData.quantity *
          (validatedData.direction === 'LONG' ? 1 : -1)
        : null,
    };

    const trade = await prisma.trade.findUnique({
      where: { id },
    });

    if (!trade) {
      return NextResponse.json({ error: 'Trade not found' }, { status: 404 });
    }

    if (trade.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedTrade = await prisma.trade.update({
      where: { id },
      data: tradeData,
    });

    return NextResponse.json(updatedTrade);
  } catch (error) {
    console.error('Error updating trade:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update trade' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Trade ID is required' }, { status: 400 });
    }

    const trade = await prisma.trade.findUnique({
      where: { id },
    });

    if (!trade) {
      return NextResponse.json({ error: 'Trade not found' }, { status: 404 });
    }

    if (trade.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.trade.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Trade deleted successfully' });
  } catch (error) {
    console.error('Error deleting trade:', error);
    return NextResponse.json(
      { error: 'Failed to delete trade' },
      { status: 500 }
    );
  }
}