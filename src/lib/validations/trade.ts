import { z } from "zod"
import { TRADE_CONSTANTS } from '@/types'

const createStopLossSchema = (tradeType: typeof TRADE_CONSTANTS.TYPE[number], price: number) => {
  if (tradeType === "BUY") {
    return z.number()
      .positive("Stop loss must be positive")
      .max(price, "Stop loss must be below entry price for long positions")
      .nullable()
      .optional()
  }
  return z.number()
    .positive("Stop loss must be positive")
    .min(price, "Stop loss must be above entry price for short positions")
    .nullable()
    .optional()
}

const createTakeProfitSchema = (tradeType: typeof TRADE_CONSTANTS.TYPE[number], price: number) => {
  if (tradeType === "BUY") {
    return z.number()
      .positive("Take profit must be positive")
      .min(price, "Take profit must be above entry price for long positions")
      .nullable()
      .optional()
  }
  return z.number()
    .positive("Take profit must be positive")
    .max(price, "Take profit must be below entry price for short positions")
    .nullable()
    .optional()
}

export const tradeFormSchema = z.object({
  symbol: z
    .string()
    .min(1, "Symbol is required")
    .max(20, "Symbol cannot exceed 20 characters")
    .transform(val => val.toUpperCase()),
  type: z.enum(TRADE_CONSTANTS.TYPE),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be positive"),
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be positive"),
  timeframe: z
    .enum(TRADE_CONSTANTS.TIMEFRAME)
    .nullable()
    .optional(),
  strategyName: z
    .string()
    .min(1, "Strategy name is required")
    .max(50, "Strategy name cannot exceed 50 characters")
    .nullable()
    .optional(),
  notes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .nullable()
    .optional(),
  status: z.enum(TRADE_CONSTANTS.STATUS),
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
  pnl: z.number().nullable().optional(),
}).refine((data) => {
  if (data.stopLoss !== null) {
    const stopLossSchema = createStopLossSchema(data.type, data.price)
    return stopLossSchema.safeParse(data.stopLoss).success
  }
  return true
}, {
  message: "Invalid stop loss value for trade direction",
  path: ["stopLoss"],
}).refine((data) => {
  if (data.takeProfit !== null) {
    const takeProfitSchema = createTakeProfitSchema(data.type, data.price)
    return takeProfitSchema.safeParse(data.takeProfit).success
  }
  return true
}, {
  message: "Invalid take profit value for trade direction",
  path: ["takeProfit"],
}).refine((data) => {
  if (data.status === 'CLOSED') {
    return data.exitPrice !== null && data.exitDate !== null
  }
  return true
}, {
  message: "Exit price and date are required for closed trades",
  path: ["status"],
})

export type TradeFormData = z.infer<typeof tradeFormSchema>

export function calculatePnL(data: { type: string, price: number, amount: number, exitPrice: number }): number {
  const multiplier = data.type === 'BUY' ? 1 : -1
  return Number((multiplier * (data.exitPrice - data.price) * data.amount).toFixed(2))
}

export function validateTradeForm(data: unknown): TradeFormData {
  return tradeFormSchema.parse(data)
}

export function formatValidationErrors(error: z.ZodError) {
  return error.errors.map(err => ({
    path: err.path.map(p => String(p)),
    message: err.message,
  }))
}