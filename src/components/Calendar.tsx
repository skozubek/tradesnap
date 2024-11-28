// src/components/Calendar.tsx
'use client'

import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek
} from 'date-fns'
import { Button } from '@/components/ui/button'

interface TradeDay {
  pnl: number
  trades: number
}

interface CalendarProps {
  tradesByDate: Record<string, TradeDay>
}

export default function Calendar({ tradesByDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Get start and end of the month
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)

  // Get start and end of the calendar (including partial weeks)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  // Get all days to display on the calendar
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const previousMonth = () => {
    setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1))
  }

  return (
    <div className="bg-card rounded-lg p-6">
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

        {calendarDays.map(day => {
          const dateString = format(day, 'yyyy-MM-dd')
          const dayData = tradesByDate[dateString]
          const hasTrades = dayData && dayData.trades > 0
          const isProfitable = dayData && dayData.pnl > 0
          const isCurrentMonth = isSameMonth(day, currentMonth)

          let bgColorClass = ''
          if (hasTrades && isCurrentMonth) {
            bgColorClass = isProfitable
              ? 'bg-green-100 dark:bg-green-900/30'
              : 'bg-red-100 dark:bg-red-900/30'
          }

          return (
            <div
              key={day.toString()}
              className={`p-2 text-center rounded-lg ${
                !isCurrentMonth
                  ? 'text-muted-foreground bg-muted/30'
                  : isToday(day)
                  ? 'bg-primary text-primary-foreground'
                  : bgColorClass
              }`}
            >
              <div>{format(day, 'd')}</div>
              {dayData && isCurrentMonth && (
                <div className={`text-xs ${
                  dayData.pnl > 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {dayData.pnl > 0 ? '+' : ''}{dayData.pnl.toFixed(2)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}