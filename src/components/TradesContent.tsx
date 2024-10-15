// File: src/components/TradesContent.tsx
'use client';

import React from 'react';
import TradeList from './TradeList';
import TradeDetails from './TradeDetails';
import AddTradeButton from './AddTradeButton';
import { useUser } from '@clerk/nextjs';
import { useTrades } from '@/hooks/useTrades';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Trade } from '@/types';

export default function TradesContent() {
  const { user, isLoaded } = useUser();
  const [selectedTrade, setSelectedTrade] = React.useState<Trade | null>(null);

  const { trades, loading, error, fetchTrades } = useTrades();

  React.useEffect(() => {
    if (isLoaded && user) {
      fetchTrades();
    }
  }, [isLoaded, user, fetchTrades]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>
          Please sign in to view your trades.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Your Trades</h1>
      <AddTradeButton userId={user.id} onTradeAdded={fetchTrades} />
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
        </div>
      ) : (
        <div className="flex space-x-4 mt-4">
          <div className="w-1/2">
            <TradeList trades={trades} onTradeSelect={setSelectedTrade} />
          </div>
          <div className="w-1/2">
            {selectedTrade && <TradeDetails trade={selectedTrade} />}
          </div>
        </div>
      )}
    </div>
  );
}