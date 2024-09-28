// File: src/components/Header.tsx
'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ThemeSwitcher } from './ThemeSwitcher';

const Header = () => {
  const { data: session, status } = useSession();

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
            {status === 'authenticated' ? (
              <>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  Sign Out
                </button>
                <span className="text-gray-600 dark:text-gray-300">
                  {session.user?.name || session.user?.email}
                </span>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                  Sign Up
                </Link>
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