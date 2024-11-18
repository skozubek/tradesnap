// src/components/trades/TradeList.tsx
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Trash2, Plus } from 'lucide-react';
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
import { AddTradeDialog } from './AddTradeDialog';
import { EditTradeDialog } from './EditTradeDialog';
import type { Trade } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';

interface TradeListProps {
  trades: Trade[];
  onTradeDelete: (id: string) => Promise<void>;
  onTradeAdd: () => void;
  onTradeUpdate: () => void;
}

export function TradeList({
  trades,
  onTradeDelete,
  onTradeAdd,
  onTradeUpdate
}: TradeListProps) {
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [tradeToDelete, setTradeToDelete] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!tradeToDelete) return;

    try {
      await onTradeDelete(tradeToDelete);
      toast({
        title: "Trade deleted",
        description: "Trade has been successfully deleted.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete trade",
      });
    } finally {
      setTradeToDelete(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(price);
  };

  if (trades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-card text-card-foreground rounded-lg border">
        <p className="text-muted-foreground mb-4">No trades found</p>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Trade
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Trade
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trades.map((trade) => (
          <div
            key={trade.id}
            onClick={() => setSelectedTrade(trade)}
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
                <span className="text-muted-foreground">Amount:</span>{' '}
                {formatPrice(trade.amount)}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Price:</span>{' '}
                ${formatPrice(trade.price)}
              </p>
              {trade.strategyName && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Strategy:</span>{' '}
                  {trade.strategyName}
                </p>
              )}
              <p className="text-sm">
                <span className="text-muted-foreground">Status:</span>{' '}
                <span className={`font-medium ${
                  trade.status === 'OPEN'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {trade.status}
                </span>
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setTradeToDelete(trade.id);
              }}
              className="absolute bottom-2 right-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add Trade Dialog */}
      <AddTradeDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onTradeCreated={() => {
          onTradeAdd();
          setShowAddDialog(false);
        }}
      />

      {/* Edit Trade Dialog */}
      {selectedTrade && (
        <EditTradeDialog
          trade={selectedTrade}
          open={!!selectedTrade}
          onOpenChange={(open) => !open && setSelectedTrade(null)}
          onTradeUpdated={() => {
            onTradeUpdate();
            setSelectedTrade(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
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
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default TradeList;