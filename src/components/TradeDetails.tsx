// src/components/TradeDetails.tsx
import React from 'react';
import { format } from 'date-fns';
import { Trade } from '@/types';

interface TradeDetailsProps {
  trade: Trade;
}

const TradeDetails: React.FC<TradeDetailsProps> = ({ trade }) => {
  // Helper function to format monetary values
  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="bg-card rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-6">Trade Details</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Symbol</p>
            <p className="font-medium">{trade.symbol}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Type</p>
            <p className="font-medium">{trade.type}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="font-medium">{trade.amount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="font-medium">{formatMoney(trade.price)}</p>
          </div>
        </div>

        {trade.stopLoss && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Stop Loss</p>
              <p className="font-medium">{formatMoney(trade.stopLoss)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Take Profit</p>
              <p className="font-medium">{trade.takeProfit ? formatMoney(trade.takeProfit) : '-'}</p>
            </div>
          </div>
        )}

        {trade.status && (
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium">{trade.status}</p>
          </div>
        )}

        {trade.strategyName && (
          <div>
            <p className="text-sm text-muted-foreground">Strategy</p>
            <p className="font-medium">{trade.strategyName}</p>
          </div>
        )}

        {trade.timeframe && (
          <div>
            <p className="text-sm text-muted-foreground">Timeframe</p>
            <p className="font-medium">{trade.timeframe}</p>
          </div>
        )}

        {trade.notes && (
          <div>
            <p className="text-sm text-muted-foreground">Notes</p>
            <p className="font-medium whitespace-pre-wrap">{trade.notes}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Entry Date</p>
            <p className="font-medium">
              {format(new Date(trade.createdAt), 'dd/MM/yyyy, HH:mm:ss')}
            </p>
          </div>
          {trade.exitDate && (
            <div>
              <p className="text-sm text-muted-foreground">Exit Date</p>
              <p className="font-medium">
                {format(new Date(trade.exitDate), 'dd/MM/yyyy, HH:mm:ss')}
              </p>
            </div>
          )}
        </div>

        {trade.pnl !== undefined && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">P&L</p>
            <p className={`font-medium ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatMoney(trade.pnl)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeDetails;