// src/components/DynamicLayout.tsx
'use client';

import { useSession } from 'next-auth/react';
import AuthenticatedLayout from './AuthenticatedLayout';
import UnauthenticatedLayout from './UnauthenticatedLayout';

interface DynamicLayoutProps {
  children: React.ReactNode;
}

const DynamicLayout: React.FC<DynamicLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    // You might want to show a loading spinner here
    return <div>Loading...</div>;
  }

  if (session) {
    return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
  }

  return <UnauthenticatedLayout>{children}</UnauthenticatedLayout>;
};

export default DynamicLayout;