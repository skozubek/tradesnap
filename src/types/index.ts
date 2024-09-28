// File: src/types/index.ts
export interface Trade {
  id: string;
  userId: string;
  symbol: string;
  amount: number;
  price: number;
  type: 'BUY' | 'SELL';
  createdAt: string;
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}