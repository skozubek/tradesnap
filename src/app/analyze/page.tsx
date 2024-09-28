// src/app/analyze/page.tsx
import React from 'react';
import StrategyAnalysis from '../../components/StrategyAnalysis';
import SentimentAnalysis from '../../components/SentimentAnalysis';

const AnalyzePage = () => {
  return (
    <div>
      <h1>Trade Analysis</h1>
      <StrategyAnalysis />
      <SentimentAnalysis />
    </div>
  );
};

export default AnalyzePage;