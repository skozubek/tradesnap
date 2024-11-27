// src/components/trades/AddTradeDialog.tsx
'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { TradeForm } from '@/components/trades/TradeForm'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import type { TradeFormData } from '@/types'

interface AddTradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: TradeFormData) => Promise<void>
}

export function AddTradeDialog({
  open,
  onOpenChange,
  onSubmit
}: AddTradeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: TradeFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit(data)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create trade')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogTitle>Add New Trade</DialogTitle>
        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <TradeForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          className="py-4"
        />
      </DialogContent>
    </Dialog>
  )
}