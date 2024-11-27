//src/components/trades/TradeForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StrategyCombobox } from "@/components/ui/strategy-combobox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  type TradeFormData,
  TRADE_CONSTANTS,
  tradeSchema
} from '@/types'

interface TradeFormProps {
  initialData?: Partial<TradeFormData>
  isSubmitting?: boolean
  onSubmit: (data: TradeFormData) => Promise<void>
  onCancel: () => void
  className?: string
}

export function TradeForm({
  initialData,
  isSubmitting = false,
  onSubmit,
  onCancel,
  className = ''
}: TradeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm<TradeFormData>({
    resolver: zodResolver(tradeSchema),
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
  })

  const tradeStatus = watch('status')
  const tradeType = watch('type')
  const price = watch('price')

  const handleStatusChange = (value: typeof TRADE_CONSTANTS.STATUS[number]) => {
    setValue('status', value)
    if (value === 'CLOSED') {
      setValue('exitPrice', price)
      setValue('exitDate', new Date().toISOString().slice(0, 16))
    } else {
      setValue('exitPrice', null)
      setValue('exitDate', null)
    }
    trigger(['exitPrice', 'exitDate'])
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={className}
      noValidate
    >
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
            onValueChange={(value) => setValue('type', value as typeof TRADE_CONSTANTS.TYPE[number])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select direction" />
            </SelectTrigger>
            <SelectContent>
              {TRADE_CONSTANTS.TYPE.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Price</label>
          <Input
            {...register('price', { valueAsNumber: true })}
            type="number"
            step="any"
            min="0"
            placeholder="0.00"
            error={errors.price?.message}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input
            {...register('amount', { valueAsNumber: true })}
            type="number"
            step="any"
            min="0"
            placeholder="0.00"
            error={errors.amount?.message}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Stop Loss</label>
          <Input
            {...register('stopLoss', { valueAsNumber: true })}
            type="number"
            step="any"
            placeholder={tradeType === 'BUY' ? 'Below entry' : 'Above entry'}
            error={errors.stopLoss?.message}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Take Profit</label>
          <Input
            {...register('takeProfit', { valueAsNumber: true })}
            type="number"
            step="any"
            placeholder={tradeType === 'BUY' ? 'Above entry' : 'Below entry'}
            error={errors.takeProfit?.message}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={tradeStatus}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {TRADE_CONSTANTS.STATUS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Strategy</label>
          <StrategyCombobox
            value={watch('strategyName') || ''}
            onChange={(value) => setValue('strategyName', value)}
            strategies={TRADE_CONSTANTS.STRATEGY}
            placeholder="Select strategy..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Timeframe</label>
          <Select
            value={watch('timeframe') || ''}
            onValueChange={(value) => setValue('timeframe', value as typeof TRADE_CONSTANTS.TIMEFRAME[number])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              {TRADE_CONSTANTS.TIMEFRAME.map((tf) => (
                <SelectItem key={tf} value={tf}>
                  {tf}
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
        </div>
      </div>

      {tradeStatus === 'CLOSED' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Exit Price</label>
            <Input
              {...register('exitPrice', { valueAsNumber: true })}
              type="number"
              step="any"
              min="0"
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
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Trade' : 'Create Trade'}
        </Button>
      </div>
    </form>
  )
}