// src/lib/validations/trade-schemas.ts
import { z } from "zod";

export const TRADE_TYPES = ["BUY", "SELL"] as const;
export const TRADE_STATUS = ["OPEN", "CLOSED"] as const;
export const TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "4h", "1d", "1w"] as const;
export const STRATEGIES = [
  "Breakout",
  "Trend Following",
  "Mean Reversion",
  "Support/Resistance",
  "Scalping",
  "Momentum",
  "Other"
] as const;

// Schema for validating stop loss based on trade type
const createStopLossSchema = (tradeType: typeof TRADE_TYPES[number], price: number) => {
  if (tradeType === "BUY") {
    return z.number()
      .positive("Stop loss must be positive")
      .max(price, "Stop loss must be below entry price for long positions")
      .nullable()
      .optional();
  }
  return z.number()
    .positive("Stop loss must be positive")
    .min(price, "Stop loss must be above entry price for short positions")
    .nullable()
    .optional();
};

// Schema for validating take profit based on trade type
const createTakeProfitSchema = (tradeType: typeof TRADE_TYPES[number], price: number) => {
  if (tradeType === "BUY") {
    return z.number()
      .positive("Take profit must be positive")
      .min(price, "Take profit must be above entry price for long positions")
      .nullable()
      .optional();
  }
  return z.number()
    .positive("Take profit must be positive")
    .max(price, "Take profit must be below entry price for short positions")
    .nullable()
    .optional();
};

// Base schema for shared validations
export const tradeBaseSchema = z.object({
  symbol: z
    .string()
    .min(1, "Symbol is required")
    .max(20, "Symbol cannot exceed 20 characters")
    .transform(val => val.toUpperCase()),

  type: z.enum(TRADE_TYPES),

  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be positive")
    .finite("Price must be finite"),

  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be positive")
    .finite("Amount must be finite"),

  timeframe: z
    .enum(TIMEFRAMES)
    .nullable()
    .optional(),

  strategyName: z
    .enum(STRATEGIES)
    .nullable()
    .optional(),

  notes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .nullable()
    .optional(),

  status: z.enum(TRADE_STATUS),
});

// Form schema with dynamic validation for stop loss and take profit
export const tradeFormSchema = z.object({
  symbol: tradeBaseSchema.shape.symbol,
  type: tradeBaseSchema.shape.type,
  price: tradeBaseSchema.shape.price,
  amount: tradeBaseSchema.shape.amount,
  timeframe: tradeBaseSchema.shape.timeframe,
  strategyName: tradeBaseSchema.shape.strategyName,
  notes: tradeBaseSchema.shape.notes,
  status: tradeBaseSchema.shape.status,
  stopLoss: z.number().nullable().optional(),
  takeProfit: z.number().nullable().optional(),
  exitPrice: z
    .number()
    .positive("Exit price must be positive")
    .nullable()
    .optional(),
  exitDate: z
    .string()
    .nullable()
    .optional(),
}).refine((data) => {
  if (data.stopLoss !== null) {
    const stopLossSchema = createStopLossSchema(data.type, data.price);
    return stopLossSchema.safeParse(data.stopLoss).success;
  }
  return true;
}, {
  message: "Invalid stop loss value for trade direction",
  path: ["stopLoss"],
}).refine((data) => {
  if (data.takeProfit !== null) {
    const takeProfitSchema = createTakeProfitSchema(data.type, data.price);
    return takeProfitSchema.safeParse(data.takeProfit).success;
  }
  return true;
}, {
  message: "Invalid take profit value for trade direction",
  path: ["takeProfit"],
});

// Export type for form data from schema
export type TradeFormData = z.infer<typeof tradeFormSchema>;

// Export type for API data
export type TradeApiData = TradeFormData;

// Type for database trade
export type TradeResponse = {
  id: string;
  userId: string;
  symbol: string;
  type: string;
  price: number;
  amount: number;
  stopLoss?: number | null;
  takeProfit?: number | null;
  status: string;
  notes?: string | null;
  strategyName?: string | null;
  timeframe?: string | null;
  exitPrice?: number | null;
  exitDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TradeData = TradeFormData & {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

// Validation error types
export interface ValidationError {
  path: string[];
  message: string;
}

// Helper functions
export function validateTradeForm(data: unknown): TradeFormData {
  return tradeFormSchema.parse(data);
}

export function formatValidationErrors(error: z.ZodError): ValidationError[] {
  return error.errors.map(err => ({
    path: err.path.map(p => String(p)),
    message: err.message,
  }));
}