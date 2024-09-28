// File: src/components/TradesClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import TradeManagement from './TradeManagement';
import AddTradeButton from './AddTradeButton';
import { Trade } from '@/types';

export default function TradesClient() {
  const { data: session, status } = useSession();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrades = async () => {
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
      console.error('Error fetching trades:', error);
      setError('Failed to load trades. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTrades();
    }
  }, [status]);

  const handleTradeAdded = async () => {
    await fetchTrades();
  };

  if (status === 'loading') {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div className="container mx-auto px-4 py-8">Please sign in to view your trades.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Trades</h1>
        {session?.user?.id && (
          <AddTradeButton userId={session.user.id} onTradeAdded={handleTradeAdded} />
        )}
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div>Loading trades...</div>
      ) : (
        session?.user?.id && <TradeManagement initialTrades={trades} userId={session.user.id} />
      )}
    </div>
  );
}