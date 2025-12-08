"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Branch, Session, Staff } from "@/lib/types"
import { format } from "date-fns"
import { AlertTriangle, CheckCircle2, Clock, RefreshCcw } from "lucide-react"
import React from "react"
import { DateStrip } from "./date-strip"
import { SessionsTable } from "./sessions-table"
import { SummaryCard } from "./summary-card"

interface ScheduleViewProps {
  sessions: Session[]
  staff: Staff[]
  branch: Branch
  onCallFollowup: (session: Session) => void
  onReschedule: (session: Session) => void
  onSave?: (session: Session) => void
  onStatusChange?: (sessionId: string, status: Session["status"]) => void
  onFollowUpStatusChange?: (sessionId: string, followUpStatus: Session["whatsappStatus"]) => void
}

export function ScheduleView({ sessions, staff, branch, onCallFollowup, onReschedule, onSave, onStatusChange, onFollowUpStatusChange }: ScheduleViewProps) {
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [staffFilter, setStaffFilter] = React.useState<string>("all")

  const formattedDate = format(selectedDate, "yyyy-MM-dd")
  const filteredSessions = sessions
    .filter((s) => s.date === formattedDate)
    .filter((s) => {
      if (staffFilter === "all") return true
      if (staffFilter === "male") {
        const staffMember = staff.find((st) => st.id === s.staffId)
        return staffMember?.gender === "M"
      }
      if (staffFilter === "female") {
        const staffMember = staff.find((st) => st.id === s.staffId)
        return staffMember?.gender === "F"
      }
      return s.staffId === staffFilter
    })

  const plannedCount =
    filteredSessions.filter((s) => s.status === "Planned").length +
    filteredSessions.filter((s) => s.status === "Completed").length
  const completedCount = filteredSessions.filter((s) => s.status === "Completed").length
  const noShowCount = filteredSessions.filter((s) => s.status === "No-show").length
  const pendingCount = filteredSessions.filter((s) => s.status === "Planned").length

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard icon={Clock} label="Planned Sessions Today" value={plannedCount} />
        <SummaryCard icon={CheckCircle2} label="Completed Sessions" value={completedCount} variant="success" />
        <SummaryCard icon={AlertTriangle} label="No-Shows" value={noShowCount} variant="warning" />
        <SummaryCard icon={RefreshCcw} label="Reschedule Pending" value={0} variant="default" />
      </div>

      {/* Filter and Date Strip */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
        <DateStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        <div className="w-full md:w-48">
          <Select value={staffFilter} onValueChange={setStaffFilter}>
            <SelectTrigger className="bg-white border border-slate-200 hover:border-blue-300 focus:ring-2 focus:ring-blue-500/20">
              <SelectValue placeholder="Filter by staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All staff</SelectItem>
              <SelectItem value="male">Male staff</SelectItem>
              <SelectItem value="female">Female staff</SelectItem>
              {staff.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sessions Table */}
      <SessionsTable
        sessions={filteredSessions}
        staff={staff}
        onCallFollowup={onCallFollowup}
        onReschedule={onReschedule}
        onSave={onSave}
        onStatusChange={onStatusChange}
        onFollowUpStatusChange={onFollowUpStatusChange}
      />
    </div>
  )
}
