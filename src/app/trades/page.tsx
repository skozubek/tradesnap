// File: src/app/trades/page.tsx
import { Suspense } from 'react';
import TradesClient from '../../components/TradesClient';

export { metadata } from './metadata';

export default function TradesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TradesClient />
    </Suspense>
  );
}