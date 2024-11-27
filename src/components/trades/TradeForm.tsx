// src/components/trades/TradeForm.tsx
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
import { TRADE_CONSTANTS, type TradeFormData } from '@/types'
import { tradeFormSchema, calculatePnL } from '@/lib/validations/trade'

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
      pnl: null,
      ...initialData,
    },
  })

  const tradeType = watch('type')
  const price = watch('price')
  const amount = watch('amount')
  const status = watch('status')
  const exitPrice = watch('exitPrice')

  const getStopLossHint = () => {
    if (tradeType === 'BUY') {
      return 'Stop loss must be below entry price'
    }
    return 'Stop loss must be above entry price'
  }

  const getTakeProfitHint = () => {
    if (tradeType === 'BUY') {
      return 'Take profit must be above entry price'
    }
    return 'Take profit must be below entry price'
  }

  const handleStatusChange = (value: typeof TRADE_CONSTANTS.STATUS[number]) => {
    setValue('status', value)
    if (value === 'CLOSED') {
      setValue('exitPrice', price)
      setValue('exitDate', new Date().toISOString().slice(0, 16))
      if (price && amount) {
        const pnl = calculatePnL({
          type: tradeType,
          price,
          amount,
          exitPrice: price
        })
        setValue('pnl', pnl)
      }
    } else {
      setValue('exitPrice', null)
      setValue('exitDate', null)
      setValue('pnl', null)
    }
    trigger(['exitPrice', 'exitDate'])
  }

  const handleExitPriceChange = (value: number) => {
    setValue('exitPrice', value)
    if (status === 'CLOSED' && price && amount) {
      const pnl = calculatePnL({
        type: tradeType,
        price,
        amount,
        exitPrice: value
      })
      setValue('pnl', pnl)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={className}
      noValidate
    >
      {/* Entry Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Entry Details</h3>
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

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center justify-between">
              <span>Stop Loss</span>
              <span className="text-xs text-muted-foreground">{getStopLossHint()}</span>
            </label>
            <Input
              {...register('stopLoss', { valueAsNumber: true })}
              type="number"
              step="any"
              placeholder={tradeType === 'BUY' ? 'Below entry' : 'Above entry'}
              error={errors.stopLoss?.message}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center justify-between">
              <span>Take Profit</span>
              <span className="text-xs text-muted-foreground">{getTakeProfitHint()}</span>
            </label>
            <Input
              {...register('takeProfit', { valueAsNumber: true })}
              type="number"
              step="any"
              placeholder={tradeType === 'BUY' ? 'Above entry' : 'Below entry'}
              error={errors.takeProfit?.message}
            />
          </div>
        </div>
      </div>

      {/* Trade Info */}
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-medium">Trade Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="space-y-2 col-span-2">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              {...register('notes')}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              rows={3}
              placeholder="Add trade notes..."
            />
          </div>
        </div>
      </div>

      {/* Exit Information */}
      <div className="space-y-4 mt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Trade Status</h3>
          <Select
            value={status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[150px]">
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

        {status === 'CLOSED' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Exit Price</label>
              <Input
                value={exitPrice || ''}
                onChange={(e) => handleExitPriceChange(parseFloat(e.target.value))}
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

              {watch('pnl') !== null && (
                <div className="col-span-2 mt-2">
                  <p className={`text-lg font-semibold ${Number(watch('pnl')) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    PNL: {Number(watch('pnl')).toFixed(2)}
                  </p>
                </div>
              )}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4 mt-8">
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