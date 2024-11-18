// src/components/Sidebar/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, ChartBarIcon, CogIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Trades', href: '/trades', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-white shadow-md">
      <div className="px-4 py-5 flex items-center justify-center border-b">
        <h1 className="text-xl font-bold">TradeSnap</h1>
      </div>
      <ul className="mt-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.name} className="px-2">
              <Link href={item.href} passHref>
                <Button
                  variant="ghost"
                  className={`flex items-center w-full px-4 py-2 mt-1 text-sm rounded-lg ${
                    pathname === item.href
                      ? 'text-gray-900 bg-gray-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Button>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}