// src/components/trades/AddTradeDialog.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { TradeForm } from '@/components/trades/TradeForm';
import { createTrade } from '@/lib/actions/trades';
import type { TradeFormData } from '@/lib/validations/trade-schemas';
import { useToast } from '@/hooks/use-toast';

interface AddTradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTradeCreated?: () => void;
}

export function AddTradeDialog({
  open,
  onOpenChange,
  onTradeCreated
}: AddTradeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: TradeFormData) => {
    console.log('Submitting form data:', data);
    try {
      setIsSubmitting(true);
      const result = await createTrade(data);
      
      if (result.error) {
        throw new Error(result.error.message);
      }

      toast({
        title: "Trade created",
        description: "Your trade has been successfully created.",
      });

      onOpenChange(false);
      onTradeCreated?.();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create trade",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogTitle>Add New Trade</DialogTitle>
        <TradeForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          className="py-4"
        />
      </DialogContent>
    </Dialog>
  );
}