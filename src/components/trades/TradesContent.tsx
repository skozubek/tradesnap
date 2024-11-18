// src/components/TradesContent.tsx
'use client';

import { useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { useTrades } from '@/hooks/useTrades';
import { tradeService } from '@/lib/services/trade-service';
import { TradeList } from './TradeList';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { withErrorBoundary } from '../ErrorBoundary';

function TradesContent() {
  const { user, isLoaded } = useUser();
  const { trades, loading, error, fetchTrades } = useTrades();

  const handleTradeDelete = useCallback(async (tradeId: string) => {
    await tradeService.delete(tradeId);
    await fetchTrades();
  }, [fetchTrades]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please sign in to view your trades.
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Trades</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
        </div>
      ) : (
        <TradeList
          trades={trades}
          onTradeDelete={handleTradeDelete}
          onTradeAdd={fetchTrades}
          onTradeUpdate={fetchTrades}
        />
      )}
    </div>
  );
}

export default withErrorBoundary(TradesContent);