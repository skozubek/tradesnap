// src/app/page.tsx
'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Welcome to TradeSnap</h1>

      {isSignedIn ? (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Welcome back, {user?.firstName || user?.username || user?.emailAddresses[0]?.emailAddress || 'Trader'}!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Ready to track your trading journey? Head to your dashboard to get started.
            </p>
            <Link href="/dashboard">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Take control of your trading journey with our comprehensive trading journal platform.
          </p>
          <div className="flex gap-4">
            <Link href="/sign-in">
              <Button variant="default">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="outline">Create Account</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}