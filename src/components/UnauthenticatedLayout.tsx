// src/components/UnauthenticatedLayout.tsx
import React from 'react';
import UnauthenticatedHeader from '@/components/UnauthenticatedHeader';

interface UnauthenticatedLayoutProps {
  children: React.ReactNode;
}

const UnauthenticatedLayout: React.FC<UnauthenticatedLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-700">
      <UnauthenticatedHeader />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default UnauthenticatedLayout;