// src/components/TradesContent.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useTrades } from '@/hooks/useTrades';
import TradeList from './TradeList';
import AddTradeModal from './AddTradeModal';
import TradeModal from './TradeModal';
import { Loader2, AlertCircle, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Trade } from '@/types';

export default function TradesContent() {
  const { user, isLoaded } = useUser();
  const [selectedTrade, setSelectedTrade] = React.useState<Trade | null>(null);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const { trades, loading, error, fetchTrades } = useTrades();
  const [currentDate, setCurrentDate] = useState(Date.now());

  useEffect(() => {
    setCurrentDate(Date.now());
  }, []);

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

  const handleTradeUpdated = (updatedTrade: Trade) => {
    fetchTrades();
    setSelectedTrade(updatedTrade);
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Trades</h1>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Trade
        </Button>
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
        <TradeList
          trades={trades}
          onTradeSelect={setSelectedTrade}
          onTradeDelete={handleTradeDelete}
        />
      )}

      {showAddModal && (
        <AddTradeModal
          onClose={() => setShowAddModal(false)}
          onTradeAdded={async () => {
            await fetchTrades();
            setShowAddModal(false);
          }}
        />
      )}

      {selectedTrade && (
        <TradeModal
          trade={selectedTrade}
          onClose={() => setSelectedTrade(null)}
          onTradeUpdated={handleTradeUpdated}
        />
      )}
    </div>
  );
}