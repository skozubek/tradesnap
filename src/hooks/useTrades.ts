// src/hooks/useTrades.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Trade } from '@prisma/client';
import { withErrorHandling, type AppError } from '@/lib/error-utils';
import { useRouter } from 'next/navigation';

export function useTrades() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken, isSignedIn } = useAuth();
  const router = useRouter();

  const fetchTrades = useCallback(async () => {
    if (!isSignedIn) {
      router.push('/sign-in?redirect=/trades');
      return;
    }

    return withErrorHandling(
      async () => {
        setLoading(true);
        setError(null);

        try {
          const token = await getToken();
          const response = await fetch('/api/trades', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 401) {
            router.push('/sign-in?redirect=/trades');
            return;
          }

          if (!response.ok) {
            throw new Error(`Failed to fetch trades: ${response.statusText}`);
          }

          const data = await response.json();
          setTrades(data);
        } catch (error) {
          throw new Error('Failed to fetch trades');
        }
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
  }, [getToken, isSignedIn, router]);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  return { trades, loading, error, fetchTrades };
}