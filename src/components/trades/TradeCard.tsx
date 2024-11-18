'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import type { Trade } from '@prisma/client';
import type { TradeFormData } from '@/lib/validations/trade-schemas';
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
import { EditTradeDialog } from './EditTradeDialog';

interface TradeCardProps {
  trade: Trade;
  onUpdate: (id: string, data: TradeFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TradeCard({ trade, onUpdate, onDelete }: TradeCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(price);
  };

  const handleDelete = async () => {
    try {
      await onDelete(trade.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting trade:', error);
    }
  };

  const handleUpdate = async (data: TradeFormData) => {
    try {
      await onUpdate(trade.id, data);
      setShowEditDialog(false);
    } catch (error) {
      console.error('Error updating trade:', error);
    }
  };

  return (
    <>
      <div
        onClick={() => setShowEditDialog(true)}
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
            setShowDeleteDialog(true);
          }}
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Edit Dialog */}
      <EditTradeDialog
        trade={trade}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSubmit={handleUpdate}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this trade. This action cannot be undone.
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