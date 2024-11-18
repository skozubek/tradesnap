'use client'

import type { Trade } from '@prisma/client'
import { useTrades } from '@/hooks/useTrades'
import { TradeCard } from '@/components/trades/TradeCard'
import { AddTradeDialog } from './AddTradeDialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { TradeFormData } from '@/lib/validations/trade-schemas'

interface TradeListProps {
  initialTrades: Trade[]
}

export function TradeList({ initialTrades }: TradeListProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const { trades, handleCreate, handleUpdate, handleDelete } = useTrades(initialTrades)

  if (trades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-card text-card-foreground rounded-lg border">
        <p className="text-muted-foreground mb-4">No trades found</p>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Trade
        </Button>
        <AddTradeDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSubmit={async (data: TradeFormData) => {
            await handleCreate(data)
            setShowAddDialog(false)
          }}
        />
      </div>
    )
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Trade
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trades.map((trade) => (
          <TradeCard
            key={trade.id}
            trade={trade}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <AddTradeDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={async (data: TradeFormData) => {
          await handleCreate(data)
          setShowAddDialog(false)
        }}
      />
    </>
  )
}