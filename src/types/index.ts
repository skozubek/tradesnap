// src/types/index.ts
import { z } from 'zod'
import type { Trade as PrismaTrade } from '@prisma/client'

export const TRADE_CONSTANTS = {
  TYPE: ['BUY', 'SELL'] as const,
  STATUS: ['OPEN', 'CLOSED'] as const,
  TIMEFRAME: ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'] as const,
  STRATEGY: [
    'Breakout',
    'Trend Following',
    'Mean Reversion',
    'Support/Resistance',
    'Scalping',
    'Momentum'
  ] as const
} as const

export type TradeType = typeof TRADE_CONSTANTS.TYPE[number]
export type TradeStatus = typeof TRADE_CONSTANTS.STATUS[number]
export type TimeFrame = typeof TRADE_CONSTANTS.TIMEFRAME[number]
export type Strategy = typeof TRADE_CONSTANTS.STRATEGY[number]

export const tradeSchema = z.object({
  symbol: z.string().min(1).max(20),
  type: z.enum(TRADE_CONSTANTS.TYPE),
  price: z.number().positive(),
  amount: z.number().positive(),
  stopLoss: z.number().nullable().optional(),
  takeProfit: z.number().nullable().optional(),
  status: z.enum(TRADE_CONSTANTS.STATUS),
  notes: z.string().max(500).nullable().optional(),
  strategyName: z.enum(TRADE_CONSTANTS.STRATEGY).nullable().optional(),
  timeframe: z.enum(TRADE_CONSTANTS.TIMEFRAME).nullable().optional(),
  exitPrice: z.number().positive().nullable().optional(),
  exitDate: z.string().nullable().optional()
})

export type TradeFormData = z.infer<typeof tradeSchema>
export type Trade = PrismaTrade