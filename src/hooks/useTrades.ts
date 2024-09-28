// src/hooks/useTrades.ts
import { useState, useEffect } from 'react';
import { Trade } from '../types';

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    // TODO: Fetch trades from API
  }, []);

  return trades;
};