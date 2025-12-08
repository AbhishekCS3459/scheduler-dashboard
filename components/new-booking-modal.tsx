"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Session, SessionType, Staff } from "@/lib/types"
import { X } from "lucide-react"
import React from "react"

interface NewBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: any) => void
  staff: Staff[]
  sessionTypes: SessionType[]
  existingSession?: Session
  isRescheduling?: boolean
}

export function NewBookingModal({
  isOpen,
  onClose,
  onConfirm,
  staff,
  sessionTypes,
  existingSession,
  isRescheduling = false,
}: NewBookingModalProps) {
  const [formData, setFormData] = React.useState({
    patientName: existingSession?.patientName || "",
    patientId: existingSession?.patientId || "",
    therapyType: existingSession?.therapyType || "",
    staffId: existingSession?.staffId || "",
    date: existingSession?.date || "",
    time: existingSession?.startTime || "",
    notes: existingSession?.notes || "",
  })

  React.useEffect(() => {
    if (isOpen) {
      if (existingSession) {
        setFormData({
          patientName: existingSession.patientName,
          patientId: existingSession.patientId,
          therapyType: existingSession.therapyType,
          staffId: existingSession.staffId,
          date: existingSession.date,
          time: existingSession.startTime,
          notes: existingSession.notes || "",
        })
      } else {
        setFormData({
          patientName: "",
          patientId: "",
          therapyType: "",
          staffId: "",
          date: "",
          time: "",
          notes: "",
        })
      }
    }
  }, [isOpen, existingSession])

  if (!isOpen) return null

  const handleSubmit = () => {
    if (!formData.patientName.trim()) {
      alert("Please enter patient name")
      return
    }
    if (!formData.therapyType) {
      alert("Please select a session type")
      return
    }
    if (!formData.staffId) {
      alert("Please select a staff member")
      return
    }
    if (!formData.date) {
      alert("Please select a date")
      return
    }
    if (!formData.time) {
      alert("Please select a time")
      return
    }
    onConfirm(formData)
    // Reset form after submission
    setFormData({
      patientName: "",
      patientId: "",
      therapyType: "",
      staffId: "",
      date: "",
      time: "",
      notes: "",
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200/50 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/80 bg-gradient-to-r from-slate-50/50 to-white">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {isRescheduling ? "Reschedule Booking" : "New Booking"}
            </h2>
            {isRescheduling && <p className="text-xs text-blue-600 font-medium mt-1.5">Rescheduling existing session</p>}
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1.5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-5 max-h-[calc(100vh-300px)] overflow-y-auto">
          {/* Patient */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Patient *</label>
            <input
              type="text"
              placeholder="Search by name or phone"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Session Type */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Session Type *</label>
            <Select
              value={formData.therapyType}
              onValueChange={(value) => setFormData({ ...formData, therapyType: value })}
            >
              <SelectTrigger className="w-full bg-white border border-slate-200 mt-1 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                <SelectValue placeholder="Select session type" />
              </SelectTrigger>
              <SelectContent>
                {sessionTypes.map((type) => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Staff */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Staff *</label>
            <Select value={formData.staffId} onValueChange={(value) => setFormData({ ...formData, staffId: value })}>
              <SelectTrigger className="w-full bg-white border border-slate-200 mt-1 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                <SelectValue placeholder="Select staff" />
              </SelectTrigger>
              <SelectContent>
                {staff.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Time */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Time *</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Notes</label>
            <textarea
              placeholder="Any special requests or notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm mt-1 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 px-6 py-5 border-t border-slate-200/80 bg-slate-50/50 justify-end">
          <Button variant="outline" onClick={onClose} className="hover:bg-slate-100">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all duration-200"
          >
            {isRescheduling ? "Confirm Reschedule" : "Confirm Booking"}
          </Button>
        </div>
      </div>
    </div>
  )
}
