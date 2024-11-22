// src/components/trades/TradesLoading.tsx
import { Button } from '@/components/ui/button';

export function TradesLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Trades</h1>
        <Button disabled className="bg-green-600">
          Add Trade
        </Button>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-card border rounded-lg p-4 animate-pulse"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="space-y-3">
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}