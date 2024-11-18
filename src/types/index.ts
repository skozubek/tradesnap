// src/types/index.ts

// Core trade types
export type TradeStatus = 'OPEN' | 'CLOSED';
export type TradeDirection = 'LONG' | 'SHORT';
export type TradeType = 'BUY' | 'SELL';

// Main trade interface used by API and DB
export interface Trade {
  id: string;
  userId: string;
  symbol: string;
  type: TradeType;
  price: number;
  amount: number;
  stopLoss?: number | null;
  takeProfit?: number | null;
  status: TradeStatus;
  notes?: string;
  strategyName?: string;
  timeframe?: string;
  pnl?: number;
  exitPrice?: number;
  exitDate?: Date;
  createdAt: string;
  updatedAt: string;
}

// Form-specific interface
export interface TradeFormData {
  symbol: string;
  direction: TradeDirection;
  entryPrice: number;
  quantity: number;
  stopLoss: number | null;
  takeProfit: number | null;
  timeframe: string | null;
  strategyName: string | null;
  notes: string;
  status: TradeStatus;
  exitPrice: number | null;
  exitDate: string | null;
}

// Simple validation types
export interface ValidationError {
  field: string;
  message: string;
}