"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { SessionType, Staff } from "@/lib/types"
import { format } from "date-fns"
import { UserPlus } from "lucide-react"
import React from "react"
import { AddStaffModal } from "./add-staff-modal"
import { CalendarView } from "./calendar-view"

interface StaffManagementViewProps {
  staff: Staff[]
  sessionTypes: SessionType[]
  onAddStaff?: (data: { name: string; gender: "M" | "F"; sessionTypes: string[] }) => void
  onAvailabilityToggle?: (staffId: string, date: Date, available: boolean) => void
  onUpdateWorkingHours?: (staffId: string, date: Date, startTime: string, endTime: string) => void
  onUpdateSessionTypes?: (staffId: string, sessionTypes: string[]) => void
}

export function StaffManagementView({ staff, sessionTypes, onAddStaff, onAvailabilityToggle, onUpdateWorkingHours, onUpdateSessionTypes }: StaffManagementViewProps) {
  const [selectedStaffId, setSelectedStaffId] = React.useState(staff[0]?.id || "")
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = React.useState(false)
  const [workingHours, setWorkingHours] = React.useState({ startTime: "09:00", endTime: "17:00" })
  const [selectedSessionTypes, setSelectedSessionTypes] = React.useState<string[]>([])

  const selectedStaff = staff.find((s) => s.id === selectedStaffId)

  React.useEffect(() => {
    // Update selected staff if current selection is invalid
    if (staff.length > 0 && !staff.find((s) => s.id === selectedStaffId)) {
      setSelectedStaffId(staff[0].id)
    }
  }, [staff, selectedStaffId])

  React.useEffect(() => {
    if (selectedStaff) {
      setSelectedSessionTypes(selectedStaff.sessionTypes)
      if (selectedDate) {
        const dateStr = selectedDate.toISOString().split("T")[0]
        const availability = selectedStaff.availability[dateStr]
        if (availability) {
          setWorkingHours({
            startTime: availability.startTime || "09:00",
            endTime: availability.endTime || "17:00",
          })
        } else {
          setWorkingHours({ startTime: "09:00", endTime: "17:00" })
        }
      }
    }
  }, [selectedStaff, selectedDate])

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const handleAvailabilityToggle = (date: Date, available: boolean) => {
    if (selectedStaff && onAvailabilityToggle) {
      onAvailabilityToggle(selectedStaff.id, date, available)
    }
  }

  const handleAddStaff = (data: { name: string; gender: "M" | "F"; sessionTypes: string[] }) => {
    if (onAddStaff) {
      onAddStaff(data)
    }
    setIsAddStaffModalOpen(false)
  }

  const handleUpdateTimings = () => {
    if (selectedStaff && selectedDate && onUpdateWorkingHours) {
      onUpdateWorkingHours(selectedStaff.id, selectedDate, workingHours.startTime, workingHours.endTime)
      alert(`Working hours updated for ${format(selectedDate, "PPP")}`)
    }
  }

  const handleSessionTypeToggle = (sessionType: string) => {
    const newSessionTypes = selectedSessionTypes.includes(sessionType)
      ? selectedSessionTypes.filter((t) => t !== sessionType)
      : [...selectedSessionTypes, sessionType]
    setSelectedSessionTypes(newSessionTypes)
    if (selectedStaff && onUpdateSessionTypes) {
      onUpdateSessionTypes(selectedStaff.id, newSessionTypes)
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-3 flex-col sm:flex-row w-full md:w-auto">
          <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
            <SelectTrigger className="bg-white border border-slate-200 w-full sm:w-48 hover:border-blue-300 focus:ring-2 focus:ring-blue-500/20">
              <SelectValue placeholder="Choose staff..." />
            </SelectTrigger>
            <SelectContent>
              {staff.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={() => setIsAddStaffModalOpen(true)} 
            variant="outline" 
            className="gap-2 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add Staff
          </Button>
        </div>
      </div>

      {selectedStaff && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <CalendarView
              availability={selectedStaff.availability}
              selectedDate={selectedDate}
              onDateSelect={handleDateClick}
              onAvailabilityToggle={handleAvailabilityToggle}
            />
          </div>

          {/* Session Types & Timings */}
          <div className="space-y-4">
            {/* Session Types */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h4 className="font-semibold text-slate-900 mb-4 text-base">Session Types</h4>
              <div className="space-y-2.5">
                {sessionTypes.map((type) => (
                  <label key={type.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedSessionTypes.includes(type.name)}
                      onChange={() => handleSessionTypeToggle(type.name)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700 font-medium">{type.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h4 className="font-semibold text-slate-900 mb-4 text-base">Working Hours</h4>
              {selectedDate ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 font-medium">{format(selectedDate, "PPP")}</p>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">Start time</label>
                    <input
                      type="time"
                      value={workingHours.startTime}
                      onChange={(e) => setWorkingHours({ ...workingHours, startTime: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">End time</label>
                    <input
                      type="time"
                      value={workingHours.endTime}
                      onChange={(e) => setWorkingHours({ ...workingHours, endTime: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    />
                  </div>
                  <Button
                    onClick={handleUpdateTimings}
                    className="w-full text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md shadow-blue-500/30 mt-2"
                  >
                    Update Timings
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Select a day to edit timings</p>
              )}
            </div>
          </div>
        </div>
      )}

      {!selectedStaff && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <p className="text-slate-500 text-base">Please select a staff member or add a new one to get started.</p>
        </div>
      )}

      {/* Add Staff Modal */}
      <AddStaffModal
        isOpen={isAddStaffModalOpen}
        onClose={() => setIsAddStaffModalOpen(false)}
        onConfirm={handleAddStaff}
        sessionTypes={sessionTypes}
      />
    </div>
  )
}
