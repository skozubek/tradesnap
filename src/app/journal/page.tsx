// src/app/journal/page.tsx
import React from 'react';
import TradeList from '../../components/TradeList';

const JournalPage = () => {
  return (
    <div>
      <h1>Trade Journal</h1>
      <TradeList />
    </div>
  );
};

export default JournalPage;