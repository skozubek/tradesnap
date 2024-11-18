// src/types/trade-form.ts

export type TradeDirection = 'LONG' | 'SHORT';
export type TradeStatus = 'OPEN' | 'CLOSED';

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

// New error types
export interface ValidationError {
  field: string;
  message: string;
  type?: 'required' | 'format' | 'logic' | 'constraint';
}

export interface SubmissionError {
  type: 'validation' | 'api' | 'general';
  message: string;
  errors?: ValidationError[];
}

export interface FormState {
  formData: TradeFormData;
  errors: ValidationError[];
  isSubmitting: boolean;
  submitError: SubmissionError | null;
}

export interface TradeFormValidation {
  validateForm: (data: TradeFormData) => ValidationError[];
  validateField: (field: keyof TradeFormData, value: any) => ValidationError | null;
  getFieldError: (field: string) => string | undefined;
  clearError: (field: string) => void;
}

export interface TradeFormContextType {
  state: FormState;
  validation: TradeFormValidation;
  handleChange: (field: keyof TradeFormData, value: any) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  setSubmitError: (error: SubmissionError | null) => void;
}

export interface TradeFormProps {
  initialData?: Partial<TradeFormData>;
  onSubmit: (data: TradeFormData) => Promise<void>;
  onCancel: () => void;
  mode?: 'create' | 'edit';
}

// Component-specific props
export interface TradeFormBasicInfoProps {
  className?: string;
}

export interface TradeFormPriceInfoProps {
  className?: string;
}

export interface TradeFormStatusProps {
  className?: string;
}

export interface TradeFormMetadataProps {
  className?: string;
}

export interface TradeFormActionsProps {
  mode: 'create' | 'edit';
  onCancel: () => void;
  onSubmit: (data: TradeFormData) => Promise<void>;
  className?: string;
}

export const TIMEFRAMES = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'] as const;
export type TimeFrame = typeof TIMEFRAMES[number];

export const STRATEGIES = [
  'Breakout',
  'Trend Following',
  'Mean Reversion',
  'Support/Resistance',
  'Other'
] as const;
export type Strategy = typeof STRATEGIES[number];