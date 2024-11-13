// src/types/index.ts

// Trade status type
export type TradeStatus = 'OPEN' | 'CLOSED';

// Trade direction type
export type TradeDirection = 'LONG' | 'SHORT';

// Base trade type without ID and timestamps
export interface TradeInput {
  symbol: string;
  direction: TradeDirection;
  entryPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  quantity: number;
  timeframe: string;
  strategy?: string;
  notes?: string;
  status: TradeStatus;
  exitPrice?: number;
  exitDate?: string;
}

// Complete trade type including all fields
export interface Trade extends TradeInput {
  id: string;
  userId: string;
  pnl?: number;
  createdAt: string;
  updatedAt: string;
}

// Type for trade filters
export interface TradeFilters {
  status?: TradeStatus;
  strategy?: string;
  symbol?: string;
  timeframe?: string;
}