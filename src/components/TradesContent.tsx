// src/components/TradesContent.tsx
'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { useTrades } from '@/hooks/useTrades';
import TradeList from './TradeList';
import AddTradeButton from './AddTradeButton';
import AddTradeModal from './AddTradeModal';
import TradeDetails from './TradeDetails';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Trade } from '@/types';

export default function TradesContent() {
  const { user, isLoaded } = useUser();
  const [selectedTrade, setSelectedTrade] = React.useState<Trade | null>(null);
  const [tradeToEdit, setTradeToEdit] = React.useState<Trade | null>(null);
  const { trades, loading, error, fetchTrades } = useTrades();

  React.useEffect(() => {
    if (isLoaded && user) {
      fetchTrades();
    }
  }, [isLoaded, user, fetchTrades]);

  const handleTradeDelete = async (tradeId: string) => {
    try {
      const response = await fetch(`/api/trades?id=${tradeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete trade');
      }

      await fetchTrades();
      if (selectedTrade?.id === tradeId) {
        setSelectedTrade(null);
      }
    } catch (error) {
      console.error('Error deleting trade:', error);
    }
  };

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
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>
          Please sign in to view your trades.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Trades</h1>
        <AddTradeButton onTradeAdded={fetchTrades} />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
        </div>
      ) : (
        <div className="flex space-x-4">
          <div className="w-1/2">
            <TradeList
              trades={trades}
              onTradeSelect={setSelectedTrade}
              onTradeEdit={setTradeToEdit}
              onTradeDelete={handleTradeDelete}
            />
          </div>
          <div className="w-1/2">
            {selectedTrade && <TradeDetails trade={selectedTrade} />}
          </div>
        </div>
      )}

      {tradeToEdit && (
        <AddTradeModal
          trade={tradeToEdit}
          onClose={() => setTradeToEdit(null)}
          onTradeAdded={fetchTrades}
        />
      )}
    </div>
  );
}