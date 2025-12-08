"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { addDays, format, startOfWeek } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import React from "react"

interface DateStripProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

export function DateStrip({ selectedDate, onDateSelect }: DateStripProps) {
  const [weekStart, setWeekStart] = React.useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))

  const dates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  return (
    <div className="flex items-center gap-4 pb-6">
      <Button variant="outline" size="sm" onClick={() => setWeekStart(addDays(weekStart, -7))} className="shrink-0">
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {dates.map((date) => (
          <button
            key={date.toISOString()}
            onClick={() => onDateSelect(date)}
            className={cn(
              "flex flex-col items-center justify-center px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-all duration-200 hover:scale-105",
              isSelected(date)
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
                : isToday(date)
                  ? "bg-blue-50 text-blue-600 border-2 border-blue-300"
                  : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:border-blue-200 border border-transparent",
            )}
          >
            <span className="text-xs uppercase text-opacity-70">{format(date, "EEE")}</span>
            <span className="text-lg font-semibold">{format(date, "d")}</span>
          </button>
        ))}
      </div>

      <Button variant="outline" size="sm" onClick={() => setWeekStart(addDays(weekStart, 7))} className="shrink-0">
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
