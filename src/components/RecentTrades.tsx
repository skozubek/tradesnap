// src/components/RecentTrades.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { ArrowRight, ExternalLink, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EditTradeDialog } from '@/components/trades/EditTradeDialog'
import { updateTrade } from '@/lib/actions/trades'
import type { Trade, TradeFormData } from '@/types'
import { useToast } from '@/hooks/use-toast'

interface RecentTradesProps {
  trades: Trade[]
}

export default function RecentTrades({ trades }: RecentTradesProps) {
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleUpdate = async (id: string, data: TradeFormData) => {
    try {
      await updateTrade(id, data)
      setSelectedTrade(null)
      router.refresh()
      toast({
        title: "Success",
        description: "Trade updated successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update trade',
      })
      throw error
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(price)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Trades</h2>
        <Button variant="ghost" asChild>
          <Link href="/trades" className="flex items-center">
            View all trades
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trades.map((trade) => (
          <Card
            key={trade.id}
            className="group bg-card border h-36 rounded-lg p-4 cursor-pointer hover:border-primary transition-colors relative"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{trade.symbol}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(trade.createdAt), 'MMM d, yyyy HH:mm')}
                </p>
              </div>
              <div className={`px-2 py-1 rounded text-sm ${
                trade.type === 'BUY'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
              }`}>
                {trade.type}
              </div>
            </div>

            {trade.pnl !== null && (
              <p className="text-sm">
                <span className="text-muted-foreground">PNL:</span>{' '}
                <span className={`font-medium ${
                  Number(trade.pnl) >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  ${formatPrice(trade.pnl)}
                </span>
              </p>
            )}

            {/* Action buttons - visible on hover */}
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setSelectedTrade(trade)}
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                asChild
              >
                <Link
                  href={`/trades?selected=${trade.id}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {selectedTrade && (
        <EditTradeDialog
          trade={selectedTrade}
          open={!!selectedTrade}
          onOpenChange={() => setSelectedTrade(null)}
          onSubmit={(data) => handleUpdate(selectedTrade.id, data)}
        />
      )}
    </div>
  )
}