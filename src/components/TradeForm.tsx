// src/components/TradeForm.tsx
'use client';

import { useState } from 'react';
import { TradeInput } from '@/types';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
  X,
  Save
} from 'lucide-react';

interface ValidationError {
  field: string;
  message: string;
}

const TIMEFRAMES = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'];
const STRATEGIES = ['Breakout', 'Trend Following', 'Mean Reversion', 'Support/Resistance', 'Other'];

interface TradeFormProps {
  initialData?: Partial<TradeInput>;
  onSubmit: (trade: Partial<TradeInput>) => Promise<void>;
  onCancel: () => void;
  mode?: 'create' | 'edit';
}

export default function TradeForm({
  initialData,
  onSubmit,
  onCancel,
  mode = 'create'
}: TradeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [formData, setFormData] = useState<Partial<TradeInput>>({
    symbol: '',
    direction: 'LONG',
    entryPrice: 0,
    stopLoss: 0,
    takeProfit: 0,
    quantity: 0,
    timeframe: '1h',
    strategyName: '',
    notes: '',
    status: 'OPEN',
    ...initialData,
  });

  const validateForm = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!formData.symbol?.trim()) {
      errors.push({ field: 'symbol', message: 'Symbol is required' });
    }

    if (!formData.entryPrice || formData.entryPrice <= 0) {
      errors.push({ field: 'entryPrice', message: 'Entry price must be greater than 0' });
    }

    if (!formData.quantity || formData.quantity <= 0) {
      errors.push({ field: 'quantity', message: 'Quantity must be greater than 0' });
    }

    if (formData.stopLoss) {
      if (formData.direction === 'LONG' && formData.stopLoss >= formData.entryPrice!) {
        errors.push({ field: 'stopLoss', message: 'Stop loss must be below entry price for long positions' });
      }
      if (formData.direction === 'SHORT' && formData.stopLoss <= formData.entryPrice!) {
        errors.push({ field: 'stopLoss', message: 'Stop loss must be above entry price for short positions' });
      }
    }

    if (formData.takeProfit) {
      if (formData.direction === 'LONG' && formData.takeProfit <= formData.entryPrice!) {
        errors.push({ field: 'takeProfit', message: 'Take profit must be above entry price for long positions' });
      }
      if (formData.direction === 'SHORT' && formData.takeProfit >= formData.entryPrice!) {
        errors.push({ field: 'takeProfit', message: 'Take profit must be below entry price for short positions' });
      }
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors([{ field: 'general', message: error instanceof Error ? error.message : 'An error occurred' }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof TradeInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear related field errors when value changes
    setErrors(prev => prev.filter(error => error.field !== field));
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.some(error => error.field === 'general') && (
        <Alert variant="destructive">
          <AlertDescription>
            {getFieldError('general')}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Symbol *</label>
          <input
            type="text"
            value={formData.symbol || ''}
            onChange={(e) => handleChange('symbol', e.target.value.toUpperCase())}
            className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              getFieldError('symbol')
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-input'
            }`}
            placeholder="e.g., BTCUSDT"
          />
          {getFieldError('symbol') && (
            <p className="text-sm text-red-500">{getFieldError('symbol')}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Direction *</label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={formData.direction === 'LONG' ? 'default' : 'outline'}
              className={`flex-1 ${formData.direction === 'LONG' ? 'bg-green-600 hover:bg-green-700' : ''}`}
              onClick={() => handleChange('direction', 'LONG')}
            >
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Long
            </Button>
            <Button
              type="button"
              variant={formData.direction === 'SHORT' ? 'default' : 'outline'}
              className={`flex-1 ${formData.direction === 'SHORT' ? 'bg-red-600 hover:bg-red-700' : ''}`}
              onClick={() => handleChange('direction', 'SHORT')}
            >
              <ArrowDownLeft className="mr-2 h-4 w-4" />
              Short
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Entry Price *</label>
          <input
            type="number"
            value={formData.entryPrice || 0}
            onChange={(e) => handleChange('entryPrice', parseFloat(e.target.value))}
            className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              getFieldError('entryPrice')
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-input'
            }`}
            step="0.1"
          />
          {getFieldError('entryPrice') && (
            <p className="text-sm text-red-500">{getFieldError('entryPrice')}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Quantity *</label>
          <input
            type="number"
            value={formData.quantity || 0}
            onChange={(e) => handleChange('quantity', parseFloat(e.target.value))}
            className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              getFieldError('quantity')
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-input'
            }`}
            step="0.1"
          />
          {getFieldError('quantity') && (
            <p className="text-sm text-red-500">{getFieldError('quantity')}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Stop Loss</label>
          <input
            type="number"
            value={formData.stopLoss || ''}
            onChange={(e) => handleChange('stopLoss', e.target.value ? parseFloat(e.target.value) : '')}
            className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              getFieldError('stopLoss')
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-input'
            }`}
            step="0.1"
          />
          {getFieldError('stopLoss') && (
            <p className="text-sm text-red-500">{getFieldError('stopLoss')}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Take Profit</label>
          <input
            type="number"
            value={formData.takeProfit || ''}
            onChange={(e) => handleChange('takeProfit', e.target.value ? parseFloat(e.target.value) : '')}
            className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              getFieldError('takeProfit')
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-input'
            }`}
            step="0.1"
          />
          {getFieldError('takeProfit') && (
            <p className="text-sm text-red-500">{getFieldError('takeProfit')}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Timeframe</label>
          <Select
            value={formData.timeframe}
            onValueChange={(value) => handleChange('timeframe', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              {TIMEFRAMES.map((tf) => (
                <SelectItem key={tf} value={tf}>{tf}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Strategy</label>
          <Select
            value={formData.strategy}
            onValueChange={(value) => handleChange('strategy', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select strategy" />
            </SelectTrigger>
            <SelectContent>
              {STRATEGIES.map((strategy) => (
                <SelectItem key={strategy} value={strategy}>{strategy}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 col-span-2">
          <label className="text-sm font-medium">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Add any trade notes here..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className={mode === 'create' ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              {mode === 'create' ? 'Creating...' : 'Updating...'}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {mode === 'create' ? 'Create Trade' : 'Update Trade'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}