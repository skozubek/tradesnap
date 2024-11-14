// src/components/AddTradeModal.tsx
'use client';

import React from 'react';
import { X } from 'lucide-react';
import TradeForm from './TradeForm';
import { TradeInput, Trade } from '@/types';

interface AddTradeModalProps {
  onClose: () => void;
  onTradeAdded: () => Promise<void>;
  trade?: Trade;
}

const AddTradeModal: React.FC<AddTradeModalProps> = ({ onClose, onTradeAdded, trade }) => {
  const isEditMode = !!trade;

  const handleSubmit = async (tradeData: Partial<TradeInput>) => {
    try {
      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tradeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add trade');
      }

      await onTradeAdded();
      onClose();
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto">
      <div className="relative bg-card w-full max-w-2xl mx-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-card-foreground">
            Add New Trade
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <TradeForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            mode="create"
          />
        </div>
      </div>
    </div>
  );
};

export default AddTradeModal;