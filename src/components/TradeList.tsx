// src/components/TradeList.tsx
import React from 'react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trade } from '@/types';

interface TradeListProps {
  trades: Trade[];
  onTradeSelect: (trade: Trade) => void;
  onTradeDelete?: (tradeId: string) => Promise<void>;
}

const TradeList: React.FC<TradeListProps> = ({
  trades = [],
  onTradeSelect,
  onTradeDelete
}) => {
  const [tradeToDelete, setTradeToDelete] = React.useState<string | null>(null);

  const handleDelete = async () => {
    if (tradeToDelete && onTradeDelete) {
      await onTradeDelete(tradeToDelete);
      setTradeToDelete(null);
    }
  };

  if (trades.length === 0) {
    return (
      <div className="text-center py-8 bg-card rounded-lg">
        <p className="text-muted-foreground">No trades found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trades.map((trade) => (
          <div
            key={trade.id}
            onClick={() => onTradeSelect(trade)}
            className="bg-card border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors relative group"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{trade.symbol}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(trade.createdAt), 'MMM d, yyyy HH:mm')}
                </p>
              </div>
              <div className={`px-2 py-1 rounded text-sm ${
                trade.type === 'BUY'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
              }`}>
                {trade.type}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-muted-foreground">Amount:</span> {trade.amount}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Price:</span> ${trade.price.toLocaleString()}
              </p>
              {trade.strategyName && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Strategy:</span> {trade.strategyName}
                </p>
              )}
            </div>

            {onTradeDelete && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTradeToDelete(trade.id);
                  }}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <AlertDialog open={!!tradeToDelete} onOpenChange={() => setTradeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the trade.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TradeList;