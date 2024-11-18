// src/components/trades/TradesError.tsx
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface TradesErrorProps {
  error?: string
}

export function TradesError({ error = 'Failed to load trades' }: TradesErrorProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {error}
      </AlertDescription>
    </Alert>
  )
}