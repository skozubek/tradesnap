// src/app/page.tsx
'use client';

import { useUser, SignInButton, SignUpButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome to TradeSnap</h1>
      {isSignedIn ? (
        <div>
          <p className="mb-4">Welcome back, {user?.firstName}!</p>
          <Link href="/dashboard" className="text-blue-500 hover:underline">
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div>
          <p className="mb-4">Please sign in to access your trades and start journaling.</p>
          <div className="space-x-4">
            <SignInButton mode="modal">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </div>
      )}
    </div>
  );
}