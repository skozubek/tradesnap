// File: src/components/TopNavBar.tsx
'use client'

import { FilterIcon, ImportIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function TopNavBarComponent() {
  return (
    <div className="bg-card text-card-foreground shadow-sm">
      <div className="h-16 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trades</SelectItem>
              <SelectItem value="winning">Winning Trades</SelectItem>
              <SelectItem value="losing">Losing Trades</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Data Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual Entry</SelectItem>
              <SelectItem value="broker1">Broker 1</SelectItem>
              <SelectItem value="broker2">Broker 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>
          <ImportIcon className="mr-2 h-4 w-4" />
          Import Trades
        </Button>
      </div>
    </div>
  )
}