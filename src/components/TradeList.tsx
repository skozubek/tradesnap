// src/components/TradeList.tsx
import React from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
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
  onTradeSelect?: (trade: Trade) => void;
  onTradeEdit?: (trade: Trade) => void;
  onTradeDelete?: (tradeId: string) => Promise<void>;
}

const TradeList: React.FC<TradeListProps> = ({
  trades = [],
  onTradeSelect,
  onTradeEdit,
  onTradeDelete
}) => {
  const [tradeToDelete, setTradeToDelete] = React.useState<string | null>(null);

  if (trades.length === 0) {
    return (
      <p>No trades found.</p>
    );
  }

  const handleDelete = async () => {
    if (tradeToDelete && onTradeDelete) {
      await onTradeDelete(tradeToDelete);
      setTradeToDelete(null);
    }
  };

  return (
    <>
      <ul className="space-y-2">
        {trades.map((trade) => (
          <li
            key={trade.id}
            className="border p-4 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 relative group"
            onClick={() => onTradeSelect?.(trade)}
          >
            <div>
              <p className="font-semibold">{trade.symbol}</p>
              <p>{trade.type} - Amount: {trade.amount}, Price: ${trade.price}</p>
              <p className="text-sm text-gray-500">
                {format(new Date(trade.createdAt), 'MMM d, yyyy HH:mm')}
              </p>
            </div>

            {/* Action buttons */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
              {onTradeEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTradeEdit(trade);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {onTradeDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTradeToDelete(trade.id);
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>

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