// src/components/TradesContent.tsx
'use client';

import React from 'react';
import TradeList from './TradeList';
import TradeDetails from './TradeDetails';
import AddTradeButton from './AddTradeButton';
import { useSession } from 'next-auth/react';
import { useTrades } from '@/hooks/useTrades'; // Import the custom hook
import { Loader } from 'lucide-react'; // Import the Loader icon

export default function TradesContent() {
  const { data: session, status } = useSession();
  const [selectedTrade, setSelectedTrade] = React.useState<Trade | null>(null);

  // Use the useTrades hook
  const { trades, loading, error, fetchTrades } = useTrades();

  // Simulated loading delay for testing
  React.useEffect(() => {
    if (status === 'authenticated') {
      fetchTrades();
    }
  }, [status, fetchTrades]);

  const handleTradeAdded = async () => {
    await fetchTrades();
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>Please sign in to view your trades.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Your Trades</h1>
      {session?.user?.id && (
        <AddTradeButton userId={session.user.id} onTradeAdded={handleTradeAdded} />
      )}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loader className="animate-spin h-8 w-8 text-gray-500" /> {/* Spinner loader */}
        </div>
      ) : (
        <div className="flex space-x-4">
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
