// File: src/components/Calendar.tsx
'use client'

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { Button } from '@/components/ui/button';

// Mock data for winning and losing days
const tradeResults = {
  '2023-05-01': { result: 'win', amount: 100 },
  '2023-05-03': { result: 'loss', amount: -50 },
  '2023-05-07': { result: 'win', amount: 200 },
  '2023-05-10': { result: 'loss', amount: -75 },
  '2023-05-15': { result: 'win', amount: 150 },
  '2023-05-20': { result: 'loss', amount: -100 },
}

export default function CalendarComponent() {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  const previousMonth = () => {
    setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {days.map(day => {
          const dateString = format(day, 'yyyy-MM-dd')
          const tradeResult = tradeResults[dateString]
          const bgColor = tradeResult
            ? tradeResult.result === 'win'
              ? 'bg-green-100 dark:bg-green-900'
              : 'bg-red-100 dark:bg-red-900'
            : ''
          return (
            <div
              key={day.toString()}
              className={`p-2 text-center rounded-full ${
                !isSameMonth(day, currentMonth)
                  ? 'text-muted-foreground'
                  : isToday(day)
                  ? 'bg-primary text-primary-foreground'
                  : bgColor
              }`}
            >
              <div>{format(day, 'd')}</div>
              {tradeResult && (
                <div className={`text-xs ${tradeResult.result === 'win' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {tradeResult.amount > 0 ? '+' : ''}{tradeResult.amount}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}