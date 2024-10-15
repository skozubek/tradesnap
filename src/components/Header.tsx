// File: src/components/Header.tsx
'use client';

import Link from 'next/link';
import { UserButton, useUser, SignInButton, SignUpButton } from '@clerk/nextjs';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Loader2 } from 'lucide-react';

const Header = () => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <nav className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">
              TradeSnap
            </Link>
            <Loader2 className="animate-spin h-5 w-5" />
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">
            TradeSnap
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/trades" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
              Trades
            </Link>
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            )}
            <ThemeSwitcher />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;