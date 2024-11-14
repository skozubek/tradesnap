// src/types/index.ts

export type TradeStatus = 'OPEN' | 'CLOSED';
export type TradeDirection = 'LONG' | 'SHORT';
export type TradeType = 'BUY' | 'SELL';

export interface TradeInput {
  symbol: string;
  direction: TradeDirection;
  entryPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  quantity: number;
  timeframe?: string;
  strategyName?: string;  // Changed from strategy to strategyName
  notes?: string;
  status: TradeStatus;
  exitPrice?: number;
  exitDate?: string;
}

export interface Trade {
  id: string;
  userId: string;
  symbol: string;
  type: TradeType;        // Maps to BUY/SELL
  price: number;          // Maps to entryPrice in form
  amount: number;         // Maps to quantity in form
  stopLoss?: number;
  takeProfit?: number;
  status: TradeStatus;
  notes?: string;
  strategyName?: string;  // Matches Prisma schema
  timeframe?: string;
  pnl?: number;
  exitPrice?: number;
  exitDate?: Date;
  createdAt: string;
  updatedAt: string;
}