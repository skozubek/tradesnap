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
import type { TradeFilters } from '@/types'
import { useTradeFilters } from '@/hooks/use-trade-filters'

interface FilterOption {
  key: keyof TradeFilters
  label: string
}

export function FilterBar() {
  const { filters, setFilter, removeFilter, clearFilters } = useTradeFilters()

  const activeFilters: FilterOption[] = Object.entries(filters)
    .filter(([_, filterValue]) => filterValue !== undefined)
    .map(([filterKey, filterValue]) => {
      if (filterKey === 'id') {
        return {
          key: filterKey as keyof TradeFilters,
          label: `Selected Trade: ${filterValue?.substring(0, 8)}...`
        }
      }
      return {
        key: filterKey as keyof TradeFilters,
        label: `${filterKey}: ${filterValue}`
      }
    })

  const handleFilterChange = (key: keyof TradeFilters, value: string | undefined) => {
    setFilter(key, value === "all" ? undefined : value)
  }

  return (
    <div className="space-y-4" role="search" aria-label="Trade filters">
      <div className="flex flex-wrap gap-4">
        <Select
          value={filters.status ?? "all"}
          onValueChange={(value) => handleFilterChange('status', value)}
        >
          <SelectTrigger className="w-[180px]" aria-label="Filter by status">
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
          onValueChange={(value) => handleFilterChange('type', value)}
        >
          <SelectTrigger className="w-[180px]" aria-label="Filter by trade type">
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
          onValueChange={(value) => handleFilterChange('timeframe', value)}
        >
          <SelectTrigger className="w-[180px]" aria-label="Filter by timeframe">
            <SelectValue placeholder="Timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Timeframes</SelectItem>
            {TRADE_CONSTANTS.TIMEFRAME.map((timeframe) => (
              <SelectItem key={timeframe} value={timeframe}>
                {timeframe}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <StrategyCombobox
          value={filters.strategy ?? ""}
          onChange={(value) => handleFilterChange('strategy', value)}
          strategies={TRADE_CONSTANTS.STRATEGY}
          placeholder="Select strategy..."
        />

        <Select
          value={filters.profitability ?? "all"}
          onValueChange={(value) => handleFilterChange('profitability', value)}
        >
          <SelectTrigger className="w-[180px]" aria-label="Filter by profitability">
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
          onChange={(e) => handleFilterChange('symbol', e.target.value)}
          className="w-[180px]"
          aria-label="Filter by symbol"
        />

        <Input
          type="date"
          value={filters.dateFrom ?? ""}
          onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
          className="w-[180px]"
          aria-label="Filter by start date"
        />

        <Input
          type="date"
          value={filters.dateTo ?? ""}
          onChange={(e) => handleFilterChange('dateTo', e.target.value)}
          className="w-[180px]"
          aria-label="Filter by end date"
        />
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center" role="region" aria-label="Active filters">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map(({ key, label }) => (
            <Button
              key={key}
              variant="secondary"
              size="sm"
              onClick={() => removeFilter(key)}
              className="h-7 text-xs"
              aria-label={`Remove filter: ${label}`}
            >
              {label}
              <X className="ml-2 h-3 w-3" />
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 text-xs"
            aria-label="Clear all filters"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}