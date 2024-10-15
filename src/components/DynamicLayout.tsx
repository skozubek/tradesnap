// File: src/components/DynamicLayout.tsx
'use client';

import { useUser } from '@clerk/nextjs';
import AuthenticatedLayout from './AuthenticatedLayout';
import UnauthenticatedLayout from './UnauthenticatedLayout';
import { Loader2 } from 'lucide-react';

interface DynamicLayoutProps {
  children: React.ReactNode;
}

const DynamicLayout: React.FC<DynamicLayoutProps> = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  if (isSignedIn) {
    return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
  }

  return <UnauthenticatedLayout>{children}</UnauthenticatedLayout>;
};

export default DynamicLayout;