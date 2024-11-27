// src/app/(app)/analyze/page.tsx
import React from 'react'
import { StrategyAnalysis } from '@/components/StrategyAnalysis'
import { SentimentAnalysis } from '@/components/SentimentAnalysis'

export default function AnalyzePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Trade Analysis</h1>
      <StrategyAnalysis />
      <SentimentAnalysis />
    </div>
  )
}