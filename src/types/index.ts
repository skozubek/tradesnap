// src/types/index.ts
import type { Trade as PrismaTrade } from '@prisma/client'

// Export Prisma Trade type as our base Trade type
export type Trade = PrismaTrade

// Core trade types derived from Prisma schema
export type TradeStatus = Trade['status']
export type TradeType = Trade['type']

// Form-specific interface that extends Prisma Trade
export interface TradeFormData extends Omit<Trade, 'id' | 'userId' | 'createdAt' | 'updatedAt'> {
  exitDate: Date | null // Change type to match the original Trade type
}

// Simple validation types
export interface ValidationError {
  field: string
  message: string
}