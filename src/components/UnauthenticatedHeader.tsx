// src/components/UnauthenticatedHeader.tsx
'use client';

import Link from 'next/link';
import { ThemeSwitcher } from './ThemeSwitcher';
import { SignInButton, SignUpButton } from "@clerk/nextjs";

const UnauthenticatedHeader = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">
            TradeSnap
          </Link>
          <div className="flex items-center space-x-4">
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
            <ThemeSwitcher />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default UnauthenticatedHeader;