'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import type { Trade } from '@prisma/client';
import type { TradeFormData } from '@/lib/validations/trade-schemas';
import { createTrade, updateTrade, deleteTrade } from '@/lib/actions/trades';
import { useToast } from '@/hooks/use-toast';
import type { ActionError } from '@/lib/actions/trades';

export function useTrades(initialTrades: Trade[] = []) {
  const [trades, setTrades] = useState<Trade[]>(initialTrades);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Helper for handling action errors
  const handleActionError = useCallback((error: ActionError) => {
    let message = error.message;

    if (error.type === 'validation' && error.errors) {
      message = error.errors.map(e => e.message).join(', ');
    }

    toast({
      variant: "destructive",
      title: `Error: ${error.type}`,
      description: message,
    });

    setError(message);
  }, [toast]);

  // Create trade
  const handleCreate = useCallback(async (data: TradeFormData) => {
    if (!isSignedIn) {
      router.push('/sign-in?redirect=/trades');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await createTrade(data);

      if (result.error) {
        handleActionError(result.error);
        return;
      }

      if (result.data) {
        // Optimistic update
        const optimisticTrade = {
          id: result.data.id,
          ...data,
          userId: 'temp',
          createdAt: new Date(),
          updatedAt: new Date()
        } as Trade;

        setTrades(current => [optimisticTrade, ...current]);

        toast({
          title: "Trade created",
          description: "Your trade has been successfully created.",
        });

        router.refresh();
      }
    } catch (error) {
      console.error('Error creating trade:', error);
      setError('Failed to create trade');
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, router, toast, handleActionError]);

  // Update trade
  const handleUpdate = useCallback(async (id: string, data: TradeFormData) => {
    if (!isSignedIn) {
      router.push('/sign-in?redirect=/trades');
      return;
    }

    setLoading(true);
    setError(null);
    const previousTrades = [...trades];

    try {
      // Type-safe optimistic update
      setTrades(currentTrades =>
        currentTrades.map(trade => {
          if (trade.id === id) {
            return {
              ...trade,
              ...data,
              updatedAt: new Date()
            } as Trade;
          }
          return trade;
        })
      );

      const result = await updateTrade(id, data);

      if (result.error) {
        setTrades(previousTrades); // Rollback on error
        handleActionError(result.error);
        return;
      }

      toast({
        title: "Trade updated",
        description: "Your trade has been successfully updated.",
      });

      router.refresh();
    } catch (error) {
      setTrades(previousTrades); // Rollback on error
      console.error('Error updating trade:', error);
      setError('Failed to update trade');
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, router, trades, toast, handleActionError]);

  // Delete trade
  const handleDelete = useCallback(async (id: string) => {
    if (!isSignedIn) {
      router.push('/sign-in?redirect=/trades');
      return;
    }

    setLoading(true);
    setError(null);
    const previousTrades = [...trades];

    try {
      setTrades(current => current.filter(trade => trade.id !== id));

      const result = await deleteTrade(id);

      if (result.error) {
        setTrades(previousTrades); // Rollback on error
        handleActionError(result.error);
        return;
      }

      toast({
        title: "Trade deleted",
        description: "Your trade has been successfully deleted.",
      });

      router.refresh();
    } catch (error) {
      setTrades(previousTrades); // Rollback on error
      console.error('Error deleting trade:', error);
      setError('Failed to delete trade');
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, router, trades, toast, handleActionError]);

  return {
    trades,
    loading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete
  };
}