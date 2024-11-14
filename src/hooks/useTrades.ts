// src/hooks/useTrades.ts
import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Trade, TradeInput } from '@/types';

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, userId } = useAuth();

  const fetchTrades = useCallback(async () => {
    if (!isLoaded || !userId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/trades');
      if (!response.ok) {
        throw new Error('Failed to fetch trades');
      }
      const data = await response.json();
      setTrades(data);
    } catch (error) {
      setError('Failed to load trades. Please try again.');
      console.error('Error fetching trades:', error);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, userId]);

  const updateTrade = async (id: string, tradeData: Partial<TradeInput>): Promise<Trade> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/trades?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tradeData),
      });

      if (!response.ok) throw new Error('Failed to update trade');

      const updatedTrade = await response.json();
      setTrades(current =>
        current.map(trade => trade.id === id ? updatedTrade : trade)
      );
      return updatedTrade;
    } catch (error) {
      setError('Failed to update trade. Please try again.');
      console.error('Error updating trade:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTrade = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/trades?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete trade');

      setTrades(current => current.filter(trade => trade.id !== id));
    } catch (error) {
      setError('Failed to delete trade. Please try again.');
      console.error('Error deleting trade:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    trades,
    loading,
    error,
    fetchTrades,
    updateTrade,
    deleteTrade,
  };
};