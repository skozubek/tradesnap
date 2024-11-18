// src/app/trades/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import TradesContent from '@/components/TradesContent';

export default async function TradesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in?redirect=/trades');
  }

  return <TradesContent />;
}