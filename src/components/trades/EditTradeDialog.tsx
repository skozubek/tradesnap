// src/components/trades/EditTradeDialog.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { TradeForm } from '@/components/trades/TradeForm';
import { updateTrade } from '@/lib/actions/trades';
import type { TradeFormData } from '@/lib/validations/trade-schemas';
import type { Trade } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';

interface EditTradeDialogProps {
  trade: Trade;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTradeUpdated?: () => void;
}

export function EditTradeDialog({
  trade,
  open,
  onOpenChange,
  onTradeUpdated
}: EditTradeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
  };

  const handleSubmit = async (data: TradeFormData) => {
    try {
      setIsSubmitting(true);
      const result = await updateTrade(trade.id, data);
      
      if (result.error) {
        throw new Error(result.error.message);
      }

      toast({
        title: "Trade updated",
        description: "Your trade has been successfully updated.",
      });

      onOpenChange(false);
      onTradeUpdated?.();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update trade",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogTitle>Edit Trade</DialogTitle>
        <TradeForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          className="py-4"
        />
      </DialogContent>
    </Dialog>
  );
}

export default EditTradeDialog;