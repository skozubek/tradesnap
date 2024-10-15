// File: src/hooks/useTrades.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Trade } from '@/types';

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

  useEffect(() => {
    if (isLoaded && userId) {
      fetchTrades();
    }
  }, [isLoaded, userId, fetchTrades]);

  return { trades, loading, error, fetchTrades };
};