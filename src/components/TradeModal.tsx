// src/components/TradeModal.tsx
'use client';

import React, { useState } from 'react';
import { X, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { Trade, TradeInput } from '@/types';
import TradeForm from './TradeForm';
import { Button } from './ui/button';

interface TradeModalProps {
  trade: Trade;
  onClose: () => void;
  onTradeUpdated: (updatedTrade: Trade) => void;
}

export default function TradeModal({ trade, onClose, onTradeUpdated }: TradeModalProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (tradeData: Partial<TradeInput>) => {
    try {
      const response = await fetch(`/api/trades?id=${trade.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tradeData),
      });

      if (!response.ok) throw new Error('Failed to update trade');

      const updatedTrade = await response.json();
      onTradeUpdated(updatedTrade);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating trade:', error);
      throw error;
    }
  };

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto p-4 md:p-6">
      <div className="relative bg-card w-full max-w-2xl rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-card-foreground">
            {isEditing ? 'Edit Trade' : trade.symbol}
          </h2>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Edit2 className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {isEditing ? (
            <TradeForm
              mode="edit"
              initialData={{
                symbol: trade.symbol,
                direction: trade.type === 'BUY' ? 'LONG' : 'SHORT',
                entryPrice: trade.price,
                stopLoss: trade.stopLoss,
                takeProfit: trade.takeProfit,
                quantity: trade.amount,
                timeframe: trade.timeframe,
                strategy: trade.strategyName,
                notes: trade.notes,
                status: trade.status,
                exitPrice: trade.exitPrice,
                exitDate: trade.exitDate?.toISOString(),
              }}
              onSubmit={handleSubmit}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className={`inline-flex px-2 py-1 rounded text-sm ${
                      trade.type === 'BUY'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                    }`}>
                      {trade.type}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium">{trade.amount}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Entry Price</p>
                    <p className="font-medium">{formatMoney(trade.price)}</p>
                  </div>

                  {trade.stopLoss && (
                    <div>
                      <p className="text-sm text-muted-foreground">Stop Loss</p>
                      <p className="font-medium">{formatMoney(trade.stopLoss)}</p>
                    </div>
                  )}

                  {trade.takeProfit && (
                    <div>
                      <p className="text-sm text-muted-foreground">Take Profit</p>
                      <p className="font-medium">{formatMoney(trade.takeProfit)}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {trade.timeframe && (
                    <div>
                      <p className="text-sm text-muted-foreground">Timeframe</p>
                      <p className="font-medium">{trade.timeframe}</p>
                    </div>
                  )}

                  {trade.strategyName && (
                    <div>
                      <p className="text-sm text-muted-foreground">Strategy</p>
                      <p className="font-medium">{trade.strategyName}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground">Entry Date</p>
                    <p className="font-medium">
                      {format(new Date(trade.createdAt), 'PPP p')}
                    </p>
                  </div>

                  {trade.exitDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Exit Date</p>
                      <p className="font-medium">
                        {format(new Date(trade.exitDate), 'PPP p')}
                      </p>
                    </div>
                  )}

                  {trade.status && (
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className={`inline-flex px-2 py-1 rounded text-sm ${
                        trade.status === 'OPEN'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                      }`}>
                        {trade.status}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {trade.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Notes</p>
                  <p className="whitespace-pre-wrap">{trade.notes}</p>
                </div>
              )}

              {trade.pnl !== undefined && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">P&L</p>
                  <p className={`text-lg font-semibold ${
                    trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatMoney(trade.pnl)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}