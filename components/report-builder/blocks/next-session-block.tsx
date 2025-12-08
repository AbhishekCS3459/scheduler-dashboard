"use client"

import { extractVariableName, isVariable } from "@/lib/variables"
import { useEffect, useState } from "react"
import { EditableTextField } from "../editable-text-field"
import { VariableHint } from "../variable-hint"

interface NextSessionBlockProps {
  config?: Record<string, any>
  isPreview?: boolean
  isSelected?: boolean
  onConfigChange?: (config: Record<string, any>) => void
}

export function NextSessionBlock({ config, isPreview, isSelected, onConfigChange }: NextSessionBlockProps) {
  const [nextSessionDate, setNextSessionDate] = useState(config?.sessionDate || "")
  const [nextSessionTime, setNextSessionTime] = useState(config?.sessionTime || "")
  const [daysToNextSession, setDaysToNextSession] = useState(config?.daysUntil || "")

  useEffect(() => {
    setNextSessionDate(config?.sessionDate || "")
    setNextSessionTime(config?.sessionTime || "")
    setDaysToNextSession(config?.daysUntil || "")
  }, [config?.sessionDate, config?.sessionTime, config?.daysUntil])

  const renderText = (text: string | number) => {
    if (text === undefined || text === null) return null
    const safeText = String(text)
    return safeText
      .split(/(\{\{[^}]+\}\})/g)
      .map((part, idx) => (
        <span key={idx}>{isVariable(part) ? <VariableHint variableId={extractVariableName(part) || ""} /> : part}</span>
      ))
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm">
      <div className="bg-linear-to-r from-[#FFC857] to-[#FFB84D] px-6 py-4">
        <h3 className="text-white font-bold text-lg">📅 Your Next Session</h3>
      </div>
      <div className="p-6 space-y-4">
        <p className="text-foreground">Scheduled consultation with your coach</p>

        <div className="space-y-2 bg-[#F7F9FC] rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Date</p>
          {isSelected && !isPreview ? (
            <EditableTextField
              value={nextSessionDate}
              onChange={(value) => {
                setNextSessionDate(value)
                onConfigChange?.({ ...(config ?? {}), sessionDate: value })
              }}
              placeholder="2023-10-15"
              inline={true}
              variablePrefix="next_session"
              className="text-lg font-bold text-foreground block"
            />
          ) : (
            <p className="text-lg font-bold text-foreground">{renderText(nextSessionDate)}</p>
          )}

          <p className="text-sm text-muted-foreground mt-3">Time</p>
          {isSelected && !isPreview ? (
            <EditableTextField
              value={nextSessionTime}
              onChange={(value) => {
                setNextSessionTime(value)
                onConfigChange?.({ ...(config ?? {}), sessionTime: value })
              }}
              placeholder="10:00 AM"
              inline={true}
              variablePrefix="next_session"
              className="text-lg font-bold text-foreground block"
            />
          ) : (
            <p className="text-lg font-bold text-foreground">{renderText(nextSessionTime)}</p>
          )}

          <p className="text-sm text-muted-foreground mt-3">Session in</p>
          {isSelected && !isPreview ? (
            <EditableTextField
              value={String(daysToNextSession)}
              onChange={(value) => {
                setDaysToNextSession(value)
                onConfigChange?.({ ...(config ?? {}), daysUntil: value })
              }}
              placeholder="5"
              inline={true}
              variablePrefix="next_session"
              className="text-lg font-bold text-foreground block"
            />
          ) : (
            <p className="text-lg font-bold text-foreground">{renderText(daysToNextSession)} days</p>
          )}
        </div>

        {isSelected && !isPreview ? (
          <div className="space-y-2">
            <EditableTextField
              value={config?.ctaText || "Reschedule Session"}
              onChange={(value) =>
                onConfigChange?.({
                  ...(config ?? {}),
                  ctaText: value,
                })
              }
              placeholder="Reschedule Session"
              inline={true}
              variablePrefix="next_session"
              className="block text-center text-sm font-medium"
            />
            <EditableTextField
              value={config?.rescheduleUrl || ""}
              onChange={(value) =>
                onConfigChange?.({
                  ...config,
                  rescheduleUrl: value,
                })
              }
              placeholder="https://example.com/reschedule"
              inline={true}
              variablePrefix="next_session"
              className="block text-center px-4 py-3 rounded-lg bg-[#00B8B0] text-white font-medium text-sm"
            />
          </div>
        ) : (
          <a
            href={config?.rescheduleUrl || "#"}
            className="block text-center px-4 py-3 rounded-lg bg-[#00B8B0] text-white font-medium hover:bg-[#009B93] transition-colors"
          >
            {renderText(config?.ctaText || "Reschedule Session")}
          </a>
        )}
      </div>
    </div>
  )
}


