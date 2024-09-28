// File: src/components/TradeManagement.tsx
'use client';

import React, { useState } from 'react';
import TradeList from './TradeList';
import TradeDetails from './TradeDetails';
import { Trade } from '@/types';

interface TradeManagementProps {
  initialTrades: Trade[];
  userId: string;
}

const TradeManagement: React.FC<TradeManagementProps> = ({ initialTrades, userId }) => {
  const [trades, setTrades] = useState<Trade[]>(initialTrades);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  const handleTradeSelect = (trade: Trade) => {
    setSelectedTrade(trade);
  };

  return (
    <div className="flex space-x-4">
      <div className="w-1/2">
        <TradeList trades={trades} onTradeSelect={handleTradeSelect} />
      </div>
      <div className="w-1/2">
        {selectedTrade && <TradeDetails trade={selectedTrade} />}
      </div>
    </div>
  );
};

export default TradeManagement;