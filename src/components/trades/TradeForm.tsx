// src/components/trades/TradeForm.tsx
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type TradeFormData,
  TRADE_TYPES,
  TRADE_STATUS,
  TIMEFRAMES,
  STRATEGIES,
  tradeFormSchema
} from '@/lib/validations/trade-schemas';
import { cn } from '@/lib/utils';

interface TradeFormProps {
  initialData?: Partial<TradeFormData>;
  isSubmitting?: boolean;
  onSubmit: (data: TradeFormData) => Promise<void>;
  onCancel: () => void;
  className?: string;
}

export function TradeForm({
  initialData,
  isSubmitting = false,
  onSubmit,
  onCancel,
  className
}: TradeFormProps) {
  const form = useForm<TradeFormData>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: {
      symbol: '',
      type: 'BUY',
      price: 0,
      amount: 0,
      stopLoss: null,
      takeProfit: null,
      status: 'OPEN',
      strategyName: null,
      timeframe: null,
      notes: '',
      exitPrice: null,
      exitDate: null,
      ...initialData,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = form;

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // Watch values for conditional rendering
  const tradeStatus = watch('status');
  const tradeType = watch('type');

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('space-y-6', className)}
    >
      {/* Basic Trade Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Symbol</label>
          <Input
            {...register('symbol')}
            placeholder="BTCUSDT"
            className="uppercase"
            error={errors.symbol?.message}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Direction</label>
          <Select
            value={tradeType}
            onValueChange={(value) => setValue('type', value as typeof TRADE_TYPES[number])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select direction" />
            </SelectTrigger>
            <SelectContent>
              {TRADE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-red-500">{errors.type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Price</label>
          <Input
            {...register('price', { valueAsNumber: true })}
            type="number"
            step="0.00000001"
            placeholder="0.00"
            error={errors.price?.message}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input
            {...register('amount', { valueAsNumber: true })}
            type="number"
            step="0.00000001"
            placeholder="0.00"
            error={errors.amount?.message}
          />
        </div>
      </div>

      {/* Risk Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Stop Loss</label>
          <Input
            {...register('stopLoss', { valueAsNumber: true })}
            type="number"
            step="0.00000001"
            placeholder={tradeType === 'BUY' ? 'Below entry' : 'Above entry'}
            error={errors.stopLoss?.message}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Take Profit</label>
          <Input
            {...register('takeProfit', { valueAsNumber: true })}
            type="number"
            step="0.00000001"
            placeholder={tradeType === 'BUY' ? 'Above entry' : 'Below entry'}
            error={errors.takeProfit?.message}
          />
        </div>
      </div>

      {/* Trade Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={tradeStatus}
            onValueChange={(value) => setValue('status', value as typeof TRADE_STATUS[number])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {TRADE_STATUS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Timeframe</label>
          <Select
            value={watch('timeframe') || ''}
            onValueChange={(value) => setValue('timeframe', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              {TIMEFRAMES.map((tf) => (
                <SelectItem key={tf} value={tf}>
                  {tf}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Strategy</label>
          <Select
            value={watch('strategyName') || ''}
            onValueChange={(value) => setValue('strategyName', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select strategy" />
            </SelectTrigger>
            <SelectContent>
              {STRATEGIES.map((strategy) => (
                <SelectItem key={strategy} value={strategy}>
                  {strategy}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <textarea
            {...register('notes')}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            rows={3}
            placeholder="Add trade notes..."
          />
          {errors.notes && (
            <p className="text-sm text-red-500">{errors.notes.message}</p>
          )}
        </div>
      </div>

      {/* Exit Information - Only shown for closed trades */}
      {tradeStatus === 'CLOSED' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Exit Price</label>
            <Input
              {...register('exitPrice', { valueAsNumber: true })}
              type="number"
              step="0.00000001"
              placeholder="0.00"
              error={errors.exitPrice?.message}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Exit Date</label>
            <Input
              {...register('exitDate')}
              type="datetime-local"
              error={errors.exitDate?.message}
            />
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-4">
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
          className={cn(
            "min-w-[120px]",
            initialData ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
          )}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">●</span>
              {initialData ? "Updating..." : "Creating..."}
            </>
          ) : (
            initialData ? "Update Trade" : "Create Trade"
          )}
        </Button>
      </div>
    </form>
  );
}

export default TradeForm;