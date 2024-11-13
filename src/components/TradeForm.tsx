// src/components/TradeForm.tsx
'use client';

import { useState } from 'react';
import { TradeInput } from '@/types';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
  X,
  Save
} from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<TradeInput>>({
    symbol: '',
    direction: 'LONG',
    entryPrice: 0,
    stopLoss: undefined,
    takeProfit: undefined,
    quantity: 0,
    timeframe: '1h',
    strategy: undefined,
    notes: '',
    status: 'OPEN',
    ...initialData,
  });

  const handleChange = (name: keyof TradeInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.symbol?.trim()) {
      throw new Error('Symbol is required');
    }
    if (!formData.entryPrice || formData.entryPrice <= 0) {
      throw new Error('Entry price must be greater than 0');
    }
    if (!formData.quantity || formData.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    if (formData.stopLoss && formData.direction === 'LONG' && formData.stopLoss >= formData.entryPrice) {
      throw new Error('Stop loss must be below entry price for long positions');
    }
    if (formData.stopLoss && formData.direction === 'SHORT' && formData.stopLoss <= formData.entryPrice) {
      throw new Error('Stop loss must be above entry price for short positions');
    }
    if (formData.takeProfit && formData.direction === 'LONG' && formData.takeProfit <= formData.entryPrice) {
      throw new Error('Take profit must be above entry price for long positions');
    }
    if (formData.takeProfit && formData.direction === 'SHORT' && formData.takeProfit >= formData.entryPrice) {
      throw new Error('Take profit must be below entry price for short positions');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      validateForm();
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while submitting the trade');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="animate-in fade-in-0">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Symbol</label>
          <input
            type="text"
            value={formData.symbol}
            onChange={(e) => handleChange('symbol', e.target.value.toUpperCase())}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="e.g., BTCUSDT"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Direction</label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={formData.direction === 'LONG' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => handleChange('direction', 'LONG')}
            >
              <ArrowUpRight className="mr-2 h-4 w-4 text-green-500" />
              Long
            </Button>
            <Button
              type="button"
              variant={formData.direction === 'SHORT' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => handleChange('direction', 'SHORT')}
            >
              <ArrowDownLeft className="mr-2 h-4 w-4 text-red-500" />
              Short
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Entry Price</label>
          <input
            type="number"
            value={formData.entryPrice}
            onChange={(e) => handleChange('entryPrice', parseFloat(e.target.value))}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            step="0.00000001"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Quantity</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', parseFloat(e.target.value))}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            step="0.00000001"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Stop Loss</label>
          <input
            type="number"
            value={formData.stopLoss}
            onChange={(e) => handleChange('stopLoss', parseFloat(e.target.value))}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            step="0.00000001"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Take Profit</label>
          <input
            type="number"
            value={formData.takeProfit}
            onChange={(e) => handleChange('takeProfit', parseFloat(e.target.value))}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            step="0.00000001"
          />
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
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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