// src/components/DashboardContent.tsx
'use client';

import React from 'react';
import MetricWidget from '@/components/MetricWidget';
import Calendar from '@/components/Calendar';
import TopNavBar from '@/components/TopNavBar';

export default function DashboardContent() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <TopNavBar />
      <br></br>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricWidget title="Total Trades" value={150} trend="up" percentage="5%" />
        <MetricWidget title="Win Rate" value="65%" trend="up" percentage="2.5%" />
        <MetricWidget title="Profit/Loss" value="$2,500" trend="up" percentage="10%" />
      </div>
      <Calendar />
    </>
  );
}