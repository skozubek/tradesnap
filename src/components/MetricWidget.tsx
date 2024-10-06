// File: src/components/MetricWidget.tsx
'use client'

import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'

interface MetricWidgetProps {
  title: string
  value: string
  trend: 'up' | 'down'
  percentage: string
}

export default function MetricWidgetComponent({ title, value, trend, percentage }: MetricWidgetProps) {
  return (
    <div className="bg-card text-card-foreground rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <span className="text-2xl font-semibold">{value}</span>
        <span className={`ml-2 flex items-baseline text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
          {percentage}
        </span>
      </div>
    </div>
  )
}