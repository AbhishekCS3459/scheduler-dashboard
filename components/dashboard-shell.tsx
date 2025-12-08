"use client"

import { BranchAnalyticsView } from "@/components/branch-analytics-view"
import { BranchSettingsView } from "@/components/branch-settings-view"
import { NewBookingModal } from "@/components/new-booking-modal"
import { PageHeader } from "@/components/page-header"
import { HistoryView } from "@/components/report-builder/views/history-view"
import { TemplateBuilderView } from "@/components/report-builder/views/template-builder-view"
import { TemplateListView } from "@/components/report-builder/views/template-list-view"
import { ScheduleView } from "@/components/schedule-view"
import { Sidebar } from "@/components/sidebar"
import { StaffManagementView } from "@/components/staff-management-view"
import { sampleTemplate } from "@/lib/report-builder-sample-data"
import type { Template, View } from "@/lib/report-builder-types"
import {
    sampleBranches,
    sampleSessions,
    sampleStaff,
    sampleUsers,
    sessionTypes,
} from "@/lib/sample-data"
import type { Session, User } from "@/lib/types"
import React from "react"

type ActiveView = "schedule" | "staff_management" | "settings" | "report_builder" | "report_history" | "branch_analytics"

interface DashboardShellProps {
  activeView: ActiveView
}

export function DashboardShell({ activeView }: DashboardShellProps) {
  const [currentUser] = React.useState<User>(sampleUsers[0])
  const [selectedBranchId, setSelectedBranchId] = React.useState<string | null>("branch-1")

  const [reportBuilderView, setReportBuilderView] = React.useState<View>("templates")
  const [templates, setTemplates] = React.useState<Template[]>([sampleTemplate])
  const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = React.useState(false)
  const [selectedSession, setSelectedSession] = React.useState<Session | null>(null)
  const [allSessions, setAllSessions] = React.useState(sampleSessions)
  const [allStaff, setAllStaff] = React.useState(sampleStaff)

  const effectiveBranchId =
    currentUser.role === "branch_admin" ? currentUser.branchId || null : selectedBranchId

  const currentBranch = React.useMemo(() => {
    if (!effectiveBranchId) return null
    return sampleBranches.find((b) => b.id === effectiveBranchId) || null
  }, [effectiveBranchId])

  const filteredSessions = React.useMemo(() => {
    if (!effectiveBranchId) return allSessions
    return allSessions.filter((s) => s.branchId === effectiveBranchId)
  }, [allSessions, effectiveBranchId])

  const filteredStaff = React.useMemo(() => {
    if (!effectiveBranchId) return allStaff
    return allStaff.filter((s) => s.branchId === effectiveBranchId)
  }, [allStaff, effectiveBranchId])

  const handleStatusChange = (sessionId: string, status: Session["status"]) => {
    setAllSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, status } : s)))
  }

  const handleFollowupStatusChange = (sessionId: string, followupStatus: Session["whatsappStatus"]) => {
    setAllSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, whatsappStatus: followupStatus } : s)))
  }

  const handleAddStaff = (data: { name: string; gender: "M" | "F"; sessionTypes: string[] }) => {
    if (!currentBranch) return
    const newStaff: typeof sampleStaff[0] = {
      id: `staff-${Date.now()}`,
      name: data.name,
      gender: data.gender,
      role: "Coach",
      phone: "",
      sessionTypes: data.sessionTypes.map((id) => {
        const type = sessionTypes.find((t) => t.id === id)
        return type ? type.name : id
      }),
      branchId: currentBranch.id,
      availability: {},
    }
    setAllStaff((prev) => [...prev, newStaff])
    alert(`Staff ${data.name} added successfully`)
  }

  const handleAvailabilityToggle = (staffId: string, date: Date, available: boolean) => {
    setAllStaff((prev) =>
      prev.map((s) => {
        if (s.id === staffId) {
          const dateStr = date.toISOString().split("T")[0]
          const newAvailability = { ...s.availability }
          if (available) {
            newAvailability[dateStr] = {
              available: true,
              startTime: "09:00",
              endTime: "17:00",
            }
          } else {
            delete newAvailability[dateStr]
          }
          return { ...s, availability: newAvailability }
        }
        return s
      }),
    )
  }

  const handleUpdateWorkingHours = (staffId: string, date: Date, startTime: string, endTime: string) => {
    setAllStaff((prev) =>
      prev.map((s) => {
        if (s.id === staffId) {
          const dateStr = date.toISOString().split("T")[0]
          const newAvailability = { ...s.availability }
          newAvailability[dateStr] = {
            available: true,
            startTime,
            endTime,
          }
          return { ...s, availability: newAvailability }
        }
        return s
      }),
    )
  }

  const handleUpdateSessionTypes = (staffId: string, nextSessionTypes: string[]) => {
    setAllStaff((prev) =>
      prev.map((s) => {
        if (s.id === staffId) {
          return { ...s, sessionTypes: nextSessionTypes }
        }
        return s
      }),
    )
  }

  const handleCallFollowup = (session: Session) => {
    alert(`Follow-up initiated for ${session.patientName}`)
  }

  const handleReschedule = (session: Session) => {
    setSelectedSession(session)
    setIsBookingModalOpen(true)
  }

  const handleSave = (session: Session) => {
    setAllSessions((prev) => prev.map((s) => (s.id === session.id ? session : s)))
    alert(`Session saved for ${session.patientName}`)
  }

  const handleNewBooking = () => {
    setSelectedSession(null)
    setIsBookingModalOpen(true)
  }

  const handleBookingConfirm = (data: any) => {
    if (!currentBranch) {
      alert("Please select a branch first")
      return
    }

    if (!data.patientName || !data.therapyType || !data.staffId || !data.date || !data.time) {
      alert("Please fill in all required fields")
      return
    }

    const sessionType = sessionTypes.find((st) => st.name === data.therapyType)
    const durationMinutes = sessionType?.durationMinutes || 30
    const [hours, minutes] = data.time.split(":").map(Number)
    const startDate = new Date()
    startDate.setHours(hours, minutes, 0, 0)
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000)
    const endTime = `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`

    if (selectedSession) {
      setAllSessions((prev) =>
        prev.map((s) =>
          s.id === selectedSession.id
            ? {
                ...s,
                patientName: data.patientName,
                patientId: data.patientId || s.patientId,
                therapyType: data.therapyType,
                staffId: data.staffId,
                date: data.date,
                startTime: data.time,
                endTime: endTime,
                notes: data.notes || s.notes,
              }
            : s,
        ),
      )
      alert(`Session rescheduled for ${data.patientName}`)
    } else {
      const newSession: Session = {
        id: `session-${Date.now()}`,
        patientName: data.patientName,
        patientId: data.patientId || `P${Date.now().toString().slice(-3)}`,
        phone: data.phone || "",
        therapyType: data.therapyType,
        staffId: data.staffId,
        branchId: currentBranch.id,
        date: data.date,
        startTime: data.time,
        endTime: endTime,
        status: "Planned",
        whatsappStatus: "No response",
        notes: data.notes || "",
      }
      setAllSessions((prev) => [...prev, newSession])
      alert(`New booking created for ${data.patientName}`)
    }
    setIsBookingModalOpen(false)
    setSelectedSession(null)
  }

  const handleNewTemplate = () => {
    const newTemplate: Template = {
      id: Date.now().toString(),
      name: "New Template",
      description: "",
      tags: [],
      blocks: [],
      createdAt: new Date(),
      lastEditedAt: new Date(),
    }
    setSelectedTemplate(newTemplate)
    setReportBuilderView("builder")
  }

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setReportBuilderView("builder")
  }

  const handleDuplicateTemplate = (template: Template) => {
    const timestamp = Date.now()
    const clonedBlocks = template.blocks.map((block, idx) => ({
      ...block,
      id: `${block.id}-copy-${timestamp}-${idx}`,
      order: idx,
      config: { ...block.config },
    }))

    const duplicatedTemplate: Template = {
      ...template,
      id: `${template.id}-copy-${timestamp}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date(),
      lastEditedAt: new Date(),
      blocks: clonedBlocks,
    }

    setTemplates((prev) => [...prev, duplicatedTemplate])
  }

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId))
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null)
      setReportBuilderView("templates")
    }
  }

  const handleSaveTemplate = (template: Template) => {
    const index = templates.findIndex((t) => t.id === template.id)
    if (index >= 0) {
      const updated = [...templates]
      updated[index] = template
      setTemplates(updated)
    } else {
      setTemplates([...templates, template])
    }
    setReportBuilderView("templates")
  }

  const getPageInfo = () => {
    switch (activeView) {
      case "schedule":
        return {
          name: "Schedule",
          subtext: currentBranch ? "View and manage all scheduled sessions" : "Select a branch to view sessions",
        }
      case "staff_management":
        return {
          name: "Staff Management",
          subtext: currentBranch ? "Configure who's available when, and for which sessions" : "Select a branch to manage staff",
        }
      case "settings":
        return {
          name: "Branch Settings",
          subtext: currentBranch ? "Manage branch opening hours and settings" : "Select a branch to manage settings",
        }
      case "branch_analytics":
        return {
          name: "Branch Analytics",
          subtext: "Daily appointment & communication performance for each branch",
        }
      default:
        return { name: "", subtext: "" }
    }
  }

  const pageInfo = getPageInfo()

  return (
    <div className="flex min-h-screen bg-linear-to-br from-white via-blue-50/40 to-slate-50/50">
      <Sidebar
        onNewBooking={handleNewBooking}
        branchName={currentBranch?.name || "Select Branch"}
        currentUser={currentUser}
        branches={sampleBranches}
        selectedBranchId={selectedBranchId}
        onBranchChange={setSelectedBranchId}
      />

      <main className="flex-1 overflow-auto ml-60 lg:ml-64">
        {activeView === "report_history" ? (
          <div className="h-full overflow-hidden">
            <HistoryView />
          </div>
        ) : activeView === "report_builder" ? (
          <div className="h-full overflow-hidden">
            {reportBuilderView === "templates" && (
              <TemplateListView
                templates={templates}
                onNewTemplate={handleNewTemplate}
                onEditTemplate={handleEditTemplate}
                onDuplicateTemplate={handleDuplicateTemplate}
                onDeleteTemplate={handleDeleteTemplate}
              />
            )}
            {reportBuilderView === "builder" && selectedTemplate && (
              <TemplateBuilderView
                template={selectedTemplate}
                onSave={handleSaveTemplate}
                onBack={() => setReportBuilderView("templates")}
              />
            )}
            {reportBuilderView === "history" && <HistoryView />}
          </div>
        ) : (
          <div className="p-6 lg:p-8 space-y-6">
            {pageInfo.name && (
              <PageHeader pageName={pageInfo.name} pageSubtext={pageInfo.subtext} />
            )}

            <div className={pageInfo.name ? "mt-6" : "mt-8"}>
              {activeView === "branch_analytics" ? (
                <BranchAnalyticsView branch={currentBranch} branches={sampleBranches} />
              ) : currentBranch ? (
                <>
                  {activeView === "schedule" && (
                    <ScheduleView
                      sessions={filteredSessions}
                      staff={filteredStaff}
                      branch={currentBranch}
                      onCallFollowup={handleCallFollowup}
                      onReschedule={handleReschedule}
                      onStatusChange={handleStatusChange}
                      onFollowUpStatusChange={handleFollowupStatusChange}
                    />
                  )}

                  {activeView === "staff_management" && (
                    <StaffManagementView
                      staff={filteredStaff}
                      sessionTypes={sessionTypes}
                      onAddStaff={handleAddStaff}
                      onAvailabilityToggle={handleAvailabilityToggle}
                      onUpdateWorkingHours={handleUpdateWorkingHours}
                      onUpdateSessionTypes={handleUpdateSessionTypes}
                    />
                  )}

                  {activeView === "settings" && (
                    <BranchSettingsView branch={currentBranch} onSave={(hours) => alert("Branch settings saved")} />
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-64 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500">
                    <p className="text-lg font-semibold mb-2 text-slate-700">
                      {currentUser.role === "super_admin" ? "Select a branch to view data" : "No branch assigned"}
                    </p>
                    <p className="text-sm text-slate-600">
                      {currentUser.role === "super_admin"
                        ? "Use the branch dropdown in the page header to select a branch."
                        : "Please contact your administrator to assign a branch."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <NewBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirm={handleBookingConfirm}
        staff={filteredStaff}
        sessionTypes={sessionTypes}
        existingSession={selectedSession || undefined}
        isRescheduling={!!selectedSession}
      />
    </div>
  )
}

