// File: src/app/trades/page.tsx

import { Suspense } from 'react';
import TradesContent from '@/components/TradesContent';
import { metadata } from './metadata';

export { metadata };

export default function TradesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TradesContent />
    </Suspense>
  );
}