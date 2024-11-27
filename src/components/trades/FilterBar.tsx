// src/components/trades/FilterBar.tsx
'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { StrategyCombobox } from '@/components/ui/strategy-combobox'
import { TRADE_CONSTANTS } from '@/types'
import { useTradeFilters } from '@/hooks/use-trade-filters'

export function FilterBar() {
  const { filters, setFilter, removeFilter, clearFilters } = useTradeFilters()

  const activeFilters = Object.entries(filters).filter(([_, value]) => value !== undefined)

  const handleTypeChange = (value: string) => {
    console.log('Type filter change:', value)
    setFilter('type', value === "all" ? undefined : value)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Select
          value={filters.status ?? "all"}
          onValueChange={(value) => setFilter('status', value === "all" ? undefined : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {TRADE_CONSTANTS.STATUS.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.type ?? "all"}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Directions</SelectItem>
            {TRADE_CONSTANTS.TYPE.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.timeframe ?? "all"}
          onValueChange={(value) => setFilter('timeframe', value === "all" ? undefined : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Timeframes</SelectItem>
            {TRADE_CONSTANTS.TIMEFRAME.map((tf) => (
              <SelectItem key={tf} value={tf}>
                {tf}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <StrategyCombobox
          value={filters.strategy ?? ""}
          onChange={(value) => setFilter('strategy', value || undefined)}
          strategies={TRADE_CONSTANTS.STRATEGY}
          placeholder="Select strategy..."
        />

        <Select
          value={filters.profitability ?? "all"}
          onValueChange={(value) => setFilter('profitability', value === "all" ? undefined : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Profitability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Trades</SelectItem>
            <SelectItem value="win">Win</SelectItem>
            <SelectItem value="loss">Loss</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Symbol"
          value={filters.symbol ?? ""}
          onChange={(e) => setFilter('symbol', e.target.value || undefined)}
          className="w-[180px]"
        />

        <Input
          type="date"
          value={filters.dateFrom ?? ""}
          onChange={(e) => setFilter('dateFrom', e.target.value || undefined)}
          className="w-[180px]"
        />

        <Input
          type="date"
          value={filters.dateTo ?? ""}
          onChange={(e) => setFilter('dateTo', e.target.value || undefined)}
          className="w-[180px]"
        />
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map(([key, value]) => (
            <Button
              key={key}
              variant="secondary"
              size="sm"
              onClick={() => removeFilter(key as keyof typeof filters)}
              className="h-7 text-xs"
            >
              {key}: {value}
              <X className="ml-2 h-3 w-3" />
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}