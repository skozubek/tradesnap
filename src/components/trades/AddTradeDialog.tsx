'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { TradeForm } from '@/components/trades/TradeForm';
import type { TradeFormData } from '@/lib/validations/trade-schemas';

interface AddTradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TradeFormData) => Promise<void>;
}

export function AddTradeDialog({
  open,
  onOpenChange,
  onSubmit
}: AddTradeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: TradeFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogTitle>Add New Trade</DialogTitle>
        <TradeForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          className="py-4"
        />
      </DialogContent>
    </Dialog>
  );
}