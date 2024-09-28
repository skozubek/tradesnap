// File: src/components/TradeList.tsx
import React from 'react';

interface Trade {
  id: string;
  symbol: string;
  amount: number;
  price: number;
  type: 'BUY' | 'SELL';
  createdAt: string;
}

interface TradeListProps {
  trades?: Trade[];
  onTradeSelect: (trade: Trade) => void;
}

const TradeList: React.FC<TradeListProps> = ({ trades = [], onTradeSelect }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Your Trades</h3>
      {trades && trades.length === 0 ? (
        <p>No trades found.</p>
      ) : trades && trades.length > 0 ? (
        <ul className="space-y-2">
          {trades.map((trade) => (
            <li
              key={trade.id}
              className="border p-2 rounded cursor-pointer hover:bg-gray-100"
              onClick={() => onTradeSelect(trade)}
            >
              <p className="font-semibold">{trade.symbol}</p>
              <p>{trade.type} - Amount: {trade.amount}, Price: ${trade.price}</p>
              <p className="text-sm text-gray-500">{new Date(trade.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading trades...</p>
      )}
    </div>
  );
};

export default TradeList;