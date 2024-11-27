// src/components/SentimentAnalysis.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SentimentAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Sentiment</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Sentiment analysis features coming soon...
        </p>
      </CardContent>
    </Card>
  )
}