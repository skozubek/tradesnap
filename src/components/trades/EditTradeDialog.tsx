// src/components/trades/EditTradeDialog.tsx
'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { TradeForm } from '@/components/trades/TradeForm'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import type { Trade, TradeFormData } from '@/types'

interface EditTradeDialogProps {
  trade: Trade
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: TradeFormData) => Promise<void>
}

export function EditTradeDialog({
  trade,
  open,
  onOpenChange,
  onSubmit
}: EditTradeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initialData: TradeFormData = {
    symbol: trade.symbol,
    type: trade.type,
    price: trade.price,
    amount: trade.amount,
    stopLoss: trade.stopLoss,
    takeProfit: trade.takeProfit,
    status: trade.status,
    strategyName: trade.strategyName,
    timeframe: trade.timeframe,
    notes: trade.notes || '',
    exitPrice: trade.exitPrice,
    exitDate: trade.exitDate ? new Date(trade.exitDate).toISOString().slice(0, 16) : null,
  }

  const handleSubmit = async (data: TradeFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit(data)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update trade')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogTitle>Edit Trade</DialogTitle>
        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <TradeForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          className="py-4"
        />
      </DialogContent>
    </Dialog>
  )
}