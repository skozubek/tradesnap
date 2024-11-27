// src/app/dashboard/page.tsx
import DashboardContent from '@/components/DashboardContent';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-foreground p-4">
      <DashboardContent />
    </div>
  );
}