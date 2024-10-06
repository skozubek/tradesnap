// src/hooks/useTrades.ts
import { useState, useEffect, useCallback } from 'react';
import { Trade } from '@/types';

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use useCallback to ensure fetchTrades is stable across renders
  const fetchTrades = useCallback(async () => {
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
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function won't change

  useEffect(() => {
    fetchTrades(); // Call fetchTrades only when the component mounts
  }, [fetchTrades]);

  return { trades, loading, error, fetchTrades };
};
