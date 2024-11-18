// src/hooks/useTrades.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Trade } from '@prisma/client';
import { withErrorHandling, type AppError } from '@/lib/error-utils';

export function useTrades() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const fetchTrades = useCallback(async () => {
    return withErrorHandling(
      async () => {
        setLoading(true);
        setError(null);

        const token = await getToken();
        const response = await fetch('/api/trades', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch trades');
        }

        const data = await response.json();
        setTrades(data);
      },
      {
        onError: (error: AppError) => {
          setError(error.message);
          console.error('Error fetching trades:', error);
        },
      }
    ).finally(() => {
      setLoading(false);
    });
  }, [getToken]);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  return { trades, loading, error, fetchTrades };
}