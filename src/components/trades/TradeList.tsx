// src/components/trades/TradeList.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TradeCard } from '@/components/trades/TradeCard'
import { AddTradeDialog } from './AddTradeDialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { createTrade, updateTrade, deleteTrade } from '@/lib/actions/trades'
import { useToast } from '@/hooks/use-toast'
import type { Trade, TradeFormData } from '@/types'

interface TradeListProps {
  initialTrades: Trade[]
}

export function TradeList({ initialTrades }: TradeListProps) {
  const [trades, setTrades] = useState<Trade[]>(initialTrades)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleCreate = async (data: TradeFormData) => {
    try {
      const newTrade = await createTrade(data)
      setTrades(current => [newTrade, ...current])
      setShowAddDialog(false)
      toast({
        title: "Success",
        description: "Trade created successfully",
      })
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create trade',
      })
      throw error
    }
  }

  const handleUpdate = async (id: string, data: TradeFormData) => {
    try {
      const updatedTrade = await updateTrade(id, data)
      setTrades(current =>
        current.map(trade => trade.id === id ? updatedTrade : trade)
      )
      toast({
        title: "Success",
        description: "Trade updated successfully",
      })
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update trade',
      })
      throw error
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTrade(id)
      setTrades(current => current.filter(trade => trade.id !== id))
      toast({
        title: "Success",
        description: "Trade deleted successfully",
      })
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete trade',
      })
      throw error
    }
  }

  if (!trades?.length) {
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
          onSubmit={handleCreate}
        />
      </div>
    )
  }

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {trades.length} trades
        </p>
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
        onSubmit={handleCreate}
      />
    </>
  )
}