// src/components/AuthenticatedLayout.tsx
import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto dark:bg-gray-700">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;