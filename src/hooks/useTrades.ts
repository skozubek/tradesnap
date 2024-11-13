// src/hooks/useTrades.ts
import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Trade, TradeInput, TradeFilters } from '@/types';

/**
 * Hook for managing trades with proper error handling and loading states.
 * Maintains compatibility with existing components while adding new functionality.
 */
export const useTrades = () => {
  // Maintain existing state structure for backward compatibility
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, userId } = useAuth();

  // Keep existing fetchTrades implementation but enhance it with filters
  const fetchTrades = useCallback(async (filters?: TradeFilters) => {
    if (!isLoaded || !userId) return;

    setLoading(true);
    setError(null);
    try {
      // Build query params while maintaining existing functionality
      const queryString = filters
        ? '?' + new URLSearchParams(
            Object.entries(filters)
              .filter(([_, value]) => value != null)
              .map(([key, value]) => [key, String(value)])
          ).toString()
        : '';

      const response = await fetch(`/api/trades${queryString}`);
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

  // Add new methods while maintaining existing patterns
  const updateTrade = async (id: string, tradeData: Partial<TradeInput>): Promise<boolean> => {
    if (!isLoaded || !userId) return false;

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
        current.map(trade =>
          trade.id === id ? updatedTrade : trade
        )
      );
      return true;
    } catch (error) {
      setError('Failed to update trade. Please try again.');
      console.error('Error updating trade:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Return existing properties plus new ones
  return {
    trades,
    loading,
    error,
    fetchTrades,
    updateTrade,
    // Maintain this structure for existing component compatibility
  };
};