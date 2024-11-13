// src/components/TradeForm.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TradeFormProps {
  initialData?: Partial<Trade>;
  onSubmit: (trade: Partial<Trade>) => Promise<void>;
  onCancel: () => void;
}

interface Trade {
  id?: string;
  symbol: string;
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  quantity: number;
  timeframe: string;
  strategy?: string;
  notes?: string;
  status: 'OPEN' | 'CLOSED';
}

const TIMEFRAMES = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'];
const STRATEGIES = ['Breakout', 'Trend Following', 'Mean Reversion', 'Support/Resistance', 'Other'];

export default function TradeForm({ initialData, onSubmit, onCancel }: TradeFormProps) {
  const { userId } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Trade>>({
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

  const handleChange = (name: keyof Trade, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!userId) throw new Error('You must be logged in to submit trades');
      if (!formData.symbol) throw new Error('Symbol is required');
      if (!formData.entryPrice || formData.entryPrice <= 0) throw new Error('Entry price must be greater than 0');
      if (!formData.quantity || formData.quantity <= 0) throw new Error('Quantity must be greater than 0');

      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while submitting the trade');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
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
            className="w-full p-2 border rounded-md"
            placeholder="e.g., AAPL"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Direction</label>
          <Select
            value={formData.direction}
            onValueChange={(value) => handleChange('direction', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LONG">Long</SelectItem>
              <SelectItem value="SHORT">Short</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Entry Price</label>
          <input
            type="number"
            value={formData.entryPrice}
            onChange={(e) => handleChange('entryPrice', parseFloat(e.target.value))}
            className="w-full p-2 border rounded-md"
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
            className="w-full p-2 border rounded-md"
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
            className="w-full p-2 border rounded-md"
            step="0.00000001"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Take Profit</label>
          <input
            type="number"
            value={formData.takeProfit}
            onChange={(e) => handleChange('takeProfit', parseFloat(e.target.value))}
            className="w-full p-2 border rounded-md"
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
            className="w-full p-2 border rounded-md"
            rows={3}
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
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            'Save Trade'
          )}
        </Button>
      </div>
    </form>
  );
}