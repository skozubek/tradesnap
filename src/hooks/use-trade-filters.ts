// src/hooks/use-trade-filters.ts
'use client'

import { useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { TradeFilters } from '@/types'

export function useTradeFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentFilters: TradeFilters = {
    id: searchParams.get('selected') || undefined,
    status: searchParams.get('status') as TradeFilters['status'] || undefined,
    type: searchParams.get('type') as TradeFilters['type'] || undefined,
    strategy: searchParams.get('strategy') || undefined,
    timeframe: searchParams.get('timeframe') as TradeFilters['timeframe'] || undefined,
    symbol: searchParams.get('symbol') || undefined,
    dateFrom: searchParams.get('dateFrom') || undefined,
    dateTo: searchParams.get('dateTo') || undefined,
    profitability: searchParams.get('profitability') as TradeFilters['profitability'] || undefined,
  }

  const setFilter = useCallback(
    (key: keyof TradeFilters, value: string | undefined) => {
      const params = new URLSearchParams(searchParams)
      if (value) {
        params.set(key === 'id' ? 'selected' : key, value)
      } else {
        params.delete(key === 'id' ? 'selected' : key)
      }
      // Reset cursor when changing filters
      params.delete('cursor')
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  const removeFilter = useCallback(
    (key: keyof TradeFilters) => {
      const params = new URLSearchParams(searchParams)
      params.delete(key === 'id' ? 'selected' : key)
      params.delete('cursor')
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  const clearFilters = useCallback(() => {
    router.push(pathname)
  }, [pathname, router])

  return {
    filters: currentFilters,
    setFilter,
    removeFilter,
    clearFilters,
  }
}