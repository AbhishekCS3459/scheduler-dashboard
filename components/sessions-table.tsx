"use client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Session, Staff } from "@/lib/types"
import { cn } from "@/lib/utils"
import { AlertCircle, AlertTriangle, Clock, Phone, RefreshCw, Save } from "lucide-react"

interface SessionsTableProps {
  sessions: Session[]
  staff: Staff[]
  onCallFollowup: (session: Session) => void
  onReschedule: (session: Session) => void
  onSave?: (session: Session) => void
  onStatusChange?: (sessionId: string, status: Session["status"]) => void
  onFollowUpStatusChange?: (sessionId: string, followUpStatus: Session["whatsappStatus"]) => void
}

export function SessionsTable({ sessions, staff, onCallFollowup, onReschedule, onSave, onStatusChange, onFollowUpStatusChange }: SessionsTableProps) {
  const getStaffName = (staffId: string) => {
    return staff.find((s) => s.id === staffId)?.name || "Unknown"
  }

  const getStatusBadge = (status: Session["status"]) => {
    const styles = {
      Planned: "bg-blue-50 text-blue-700",
      Completed: "bg-blue-50 text-blue-700",
      "No-show": "bg-amber-50 text-amber-700",
      Conflict: "bg-red-50 text-red-700",
    }
    return styles[status]
  }

  const getWhatsappBadge = (status: Session["whatsappStatus"]) => {
    const styles = {
      Confirmed: "bg-blue-50 text-blue-700",
      "No response": "bg-slate-50 text-slate-600",
      Cancelled: "bg-red-50 text-red-700",
    }
    return styles[status]
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-medium">No sessions scheduled for this day</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200">
            <th className="px-5 py-4 text-left font-semibold text-slate-700">Time</th>
            <th className="px-5 py-4 text-left font-semibold text-slate-700">Patient</th>
            <th className="px-5 py-4 text-left font-semibold text-slate-700">Therapy</th>
            <th className="px-5 py-4 text-left font-semibold text-slate-700">Staff</th>
            <th className="px-5 py-4 text-left font-semibold text-slate-700">Follow-up</th>
            <th className="px-5 py-4 text-left font-semibold text-slate-700">Status</th>
            <th className="px-5 py-4 text-left font-semibold text-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr
              key={session.id}
              className={cn(
                "border-b border-slate-200/80 hover:bg-blue-50/30 transition-all duration-200",
                session.status === "Conflict" && "bg-red-50/50 border-l-4 border-l-red-400",
              )}
            >
              <td className="px-5 py-4 text-slate-900 font-medium">
                {session.startTime} – {session.endTime}
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  {session.status === "Conflict" && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
                  <div>
                    <p className="text-slate-900 font-medium">{session.patientName}</p>
                    <p className="text-xs text-slate-500">#{session.patientId}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 text-slate-600">{session.therapyType}</td>
              <td className="px-5 py-4">
                <div className="text-slate-600 font-medium">{getStaffName(session.staffId)}</div>
              </td>
              <td className="px-5 py-4">
                <Select
                  value={session.whatsappStatus}
                  onValueChange={(value) => onFollowUpStatusChange?.(session.id, value as Session["whatsappStatus"])}
                >
                  <SelectTrigger className={cn("h-8 text-xs border-0 bg-transparent hover:bg-slate-100 rounded-md transition-colors", getWhatsappBadge(session.whatsappStatus))}>
                    <SelectValue>
                      {session.whatsappStatus === "Confirmed"
                        ? "Confirmed"
                        : session.whatsappStatus === "No response"
                          ? "No response"
                          : "Cancelled"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="No response">No response</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="px-5 py-4">
                <Select
                  value={session.status}
                  onValueChange={(value) => onStatusChange?.(session.id, value as Session["status"])}
                >
                  <SelectTrigger className={cn("h-8 text-xs border-0 bg-transparent hover:bg-slate-100 rounded-md transition-colors", getStatusBadge(session.status))}>
                    <SelectValue>
                      {session.status === "No-show" && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                      {session.status}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planned">Planned</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="No-show">No-show</SelectItem>
                    <SelectItem value="Conflict">Conflict</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onCallFollowup(session)} 
                    className="text-xs hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Follow-up
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onReschedule(session)} 
                    className="text-xs hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Reschedule
                  </Button>
                  {onSave && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onSave(session)} 
                      className="text-xs hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
