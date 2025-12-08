"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Availability } from "@/lib/types"
import { cn } from "@/lib/utils"
import {
    addMonths,
    addWeeks,
    addYears,
    eachDayOfInterval,
    eachMonthOfInterval,
    endOfMonth,
    endOfWeek,
    endOfYear,
    format,
    getDate,
    isSameDay,
    isSameMonth,
    startOfMonth,
    startOfWeek,
    startOfYear,
    subMonths,
    subWeeks,
    subYears,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import React from "react"

interface CalendarViewProps {
  availability: Availability
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  onAvailabilityToggle?: (date: Date, available: boolean) => void
}

type ViewMode = "day" | "week" | "month" | "year"

export function CalendarView({ availability, selectedDate, onDateSelect, onAvailabilityToggle }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [viewMode, setViewMode] = React.useState<ViewMode>("month")

  const isAvailable = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return availability[dateStr]?.available ?? false
  }

  const handlePrevious = () => {
    switch (viewMode) {
      case "day":
        setCurrentDate((prev) => new Date(prev.getTime() - 86400000))
        break
      case "week":
        setCurrentDate((prev) => subWeeks(prev, 1))
        break
      case "month":
        setCurrentDate((prev) => subMonths(prev, 1))
        break
      case "year":
        setCurrentDate((prev) => subYears(prev, 1))
        break
    }
  }

  const handleNext = () => {
    switch (viewMode) {
      case "day":
        setCurrentDate((prev) => new Date(prev.getTime() + 86400000))
        break
      case "week":
        setCurrentDate((prev) => addWeeks(prev, 1))
        break
      case "month":
        setCurrentDate((prev) => addMonths(prev, 1))
        break
      case "year":
        setCurrentDate((prev) => addYears(prev, 1))
        break
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleDateClick = (date: Date) => {
    onDateSelect(date)
    if (onAvailabilityToggle) {
      onAvailabilityToggle(date, !isAvailable(date))
    }
  }

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i)
    return (
      <div className="space-y-2">
        <div className="text-center py-4 border-b">
          <h3 className="text-lg font-semibold">{format(currentDate, "EEEE, MMMM d, yyyy")}</h3>
        </div>
        <div className="grid grid-cols-1 gap-1">
          {hours.map((hour) => {
            const hourDate = new Date(currentDate)
            hourDate.setHours(hour, 0, 0, 0)
            return (
              <div key={hour} className="flex items-center border-b border-slate-100 py-2">
                <div className="w-16 text-xs text-slate-500 text-right pr-2">{format(hourDate, "h:mm a")}</div>
                <div className="flex-1 h-12 border-l border-slate-200 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors" onClick={() => handleDateClick(currentDate)}></div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 })
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd })
    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
      <div className="space-y-2">
        <div className="text-center py-4 border-b">
          <h3 className="text-lg font-semibold">
            {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
          </h3>
        </div>
        <div className="grid grid-cols-8 gap-1">
          <div className="border-r border-slate-200"></div>
          {days.map((day) => (
            <div key={day.toISOString()} className="text-center border-b border-slate-200 pb-2">
              <div className="text-xs text-slate-500">{format(day, "EEE")}</div>
              <div
                className={cn(
                  "mt-1 text-sm font-medium rounded-full w-8 h-8 flex items-center justify-center mx-auto transition-all duration-200",
                  isSameDay(day, new Date()) && "bg-blue-500 text-white shadow-md shadow-blue-500/30",
                  selectedDate && isSameDay(day, selectedDate) && !isSameDay(day, new Date()) && "bg-blue-100 text-blue-700 border-2 border-blue-300",
                )}
              >
                {getDate(day)}
              </div>
            </div>
          ))}
              {hours.map((hour) => {
                const hourDate = new Date()
                hourDate.setHours(hour, 0, 0, 0)
                return (
                  <React.Fragment key={hour}>
                    <div className="text-xs text-slate-500 text-right pr-2 border-r border-slate-200 py-1">
                      {format(hourDate, "h:mm a")}
                    </div>
                    {days.map((day) => (
                      <div
                        key={`${day.toISOString()}-${hour}`}
                        className="h-12 border-b border-r border-slate-100 hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-colors"
                        onClick={() => handleDateClick(day)}
                      ></div>
                    ))}
                  </React.Fragment>
                )
              })}
        </div>
      </div>
    )
  }

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    // Group days by week
    const weeks: Date[][] = []
    let currentWeek: Date[] = []
    days.forEach((day) => {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
      currentWeek.push(day)
    })
    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }

    return (
      <div className="space-y-2">
        <div className="text-center py-4 border-b">
          <h3 className="text-lg font-semibold">{format(currentDate, "MMMM yyyy")}</h3>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-slate-600 py-2">
              {day}
            </div>
          ))}
          {weeks.map((week, weekIdx) =>
            week.map((day) => {
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isToday = isSameDay(day, new Date())
              const isSelected = selectedDate && isSameDay(day, selectedDate)
              const available = isAvailable(day)

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => handleDateClick(day)}
                  className={cn(
                    "aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-medium transition-all duration-200 border relative hover:scale-105",
                    !isCurrentMonth && "text-slate-300 border-slate-100",
                    isCurrentMonth && !isToday && !isSelected && "text-slate-700 hover:bg-blue-50 hover:border-blue-300 border-slate-200",
                    isToday && "bg-blue-500 text-white border-blue-600 shadow-md shadow-blue-500/30",
                    isSelected && !isToday && "bg-blue-100 text-blue-700 border-blue-400 shadow-sm",
                    available && isCurrentMonth && !isToday && !isSelected && "bg-blue-50 text-blue-700 border-blue-300",
                  )}
                >
                  {available && isCurrentMonth && (
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full shadow-sm"></div>
                  )}
                  <span>{getDate(day)}</span>
                </button>
              )
            }),
          )}
        </div>
      </div>
    )
  }

  const renderYearView = () => {
    const yearStart = startOfYear(currentDate)
    const months = eachMonthOfInterval({ start: yearStart, end: endOfYear(currentDate) })

    return (
      <div className="space-y-2">
        <div className="text-center py-4 border-b">
          <h3 className="text-lg font-semibold">{format(currentDate, "yyyy")}</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {months.map((month) => {
            const monthDays = eachDayOfInterval({
              start: startOfWeek(startOfMonth(month), { weekStartsOn: 0 }),
              end: endOfWeek(endOfMonth(month), { weekStartsOn: 0 }),
            })
            const availableDays = monthDays.filter((day) => isAvailable(day) && isSameMonth(day, month)).length

            return (
              <button
                key={month.toISOString()}
                onClick={() => {
                  setCurrentDate(month)
                  setViewMode("month")
                }}
                className={cn(
                  "p-4 rounded-lg border text-left hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 hover:scale-[1.02]",
                  isSameMonth(month, new Date()) && "border-blue-300 bg-blue-50",
                )}
              >
                <div className="font-semibold text-slate-900">{format(month, "MMMM")}</div>
                <div className="text-xs text-slate-500 mt-1">{availableDays} available days</div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevious} className="hover:bg-blue-50 hover:border-blue-300">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday} className="hover:bg-blue-50 hover:border-blue-300">
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={handleNext} className="hover:bg-blue-50 hover:border-blue-300">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Select value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
          <SelectTrigger className="w-32 border-slate-200 hover:border-blue-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Calendar Content */}
      <div className="min-h-[500px]">
        {viewMode === "day" && renderDayView()}
        {viewMode === "week" && renderWeekView()}
        {viewMode === "month" && renderMonthView()}
        {viewMode === "year" && renderYearView()}
      </div>
    </div>
  )
}

