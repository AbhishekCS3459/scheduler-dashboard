"use client"

import { Button } from "@/components/ui/button"
import type { Branch, OpeningHours } from "@/lib/types"
import React from "react"

interface BranchSettingsViewProps {
  branch: Branch
  onSave?: (hours: OpeningHours) => void
}

export function BranchSettingsView({ branch, onSave }: BranchSettingsViewProps) {
  const [hours, setHours] = React.useState<OpeningHours>(branch.openingHours)
  const [originalHours] = React.useState<OpeningHours>(branch.openingHours)

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const toggleDay = (day: string) => {
    setHours({
      ...hours,
      [day]: {
        ...hours[day],
        isOpen: !hours[day].isOpen,
      },
    })
  }

  const updateTime = (day: string, field: "startTime" | "endTime", value: string) => {
    setHours({
      ...hours,
      [day]: {
        ...hours[day],
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200">
                <th className="px-5 py-4 text-left font-semibold text-slate-700">Day</th>
                <th className="px-5 py-4 text-left font-semibold text-slate-700">Status</th>
                <th className="px-5 py-4 text-left font-semibold text-slate-700">Opening Time</th>
                <th className="px-5 py-4 text-left font-semibold text-slate-700">Closing Time</th>
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day} className="border-b border-slate-200/80 hover:bg-blue-50/30 transition-colors">
                  <td className="px-5 py-4 font-medium text-slate-900">{day}</td>
                  <td className="px-5 py-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hours[day].isOpen}
                        onChange={() => toggleDay(day)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`text-sm font-medium ${hours[day].isOpen ? "text-blue-700" : "text-slate-500"}`}>
                        {hours[day].isOpen ? "Open" : "Closed"}
                      </span>
                    </label>
                  </td>
                  <td className="px-5 py-4">
                    <input
                      type="time"
                      value={hours[day].startTime}
                      onChange={(e) => updateTime(day, "startTime", e.target.value)}
                      disabled={!hours[day].isOpen}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 disabled:bg-slate-50 disabled:text-slate-400 transition-all"
                    />
                  </td>
                  <td className="px-5 py-4">
                    <input
                      type="time"
                      value={hours[day].endTime}
                      onChange={(e) => updateTime(day, "endTime", e.target.value)}
                      disabled={!hours[day].isOpen}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 disabled:bg-slate-50 disabled:text-slate-400 transition-all"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          className="hover:bg-slate-100"
          onClick={() => {
            setHours(originalHours)
            alert("Changes discarded")
          }}
        >
          Discard
        </Button>
        <Button 
          onClick={() => onSave?.(hours)} 
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all duration-200"
        >
          Save Changes
        </Button>
      </div>
    </div>
  )
}
