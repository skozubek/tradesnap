// src/types/trade-form.ts
import type { Trade, TradeFormData, TradeStatus, TradeType, ValidationError } from './index'

export interface FormState {
  formData: TradeFormData
  errors: ValidationError[]
  isSubmitting: boolean
  submitError: SubmissionError | null
}

export interface TradeFormValidation {
  validateForm: (data: TradeFormData) => ValidationError[]
  validateField: (field: keyof TradeFormData, value: unknown) => ValidationError | null
  getFieldError: (field: string) => string | undefined
  clearError: (field: string) => void
}

export interface SubmissionError {
  type: 'validation' | 'api' | 'general'
  message: string
  errors?: ValidationError[]
}

export interface TradeFormContextType {
  state: FormState
  validation: TradeFormValidation
  handleChange: (field: keyof TradeFormData, value: unknown) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  resetForm: () => void
  setSubmitError: (error: SubmissionError | null) => void
}

export interface TradeFormProps {
  initialData?: Partial<TradeFormData>
  onSubmit: (data: TradeFormData) => Promise<void>
  onCancel: () => void
  mode?: 'create' | 'edit'
}

// Constants that match the Prisma schema
export const TIMEFRAMES = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'] as const
export type TimeFrame = typeof TIMEFRAMES[number]

export const STRATEGIES = [
  'Breakout',
  'Trend Following',
  'Mean Reversion',
  'Support/Resistance',
  'Other'
] as const
export type Strategy = typeof STRATEGIES[number]

// Re-export trade-related types for convenience
export type { Trade, TradeFormData, TradeStatus, TradeType }