"use client"

import { extractVariableName, isVariable } from "@/lib/variables"
import { EditableTextField } from "../editable-text-field"
import { VariableHint } from "../variable-hint"

interface MonthlySummaryBlockProps {
  config?: Record<string, any>
  isPreview?: boolean
  isSelected?: boolean
  onConfigChange?: (config: Record<string, any>) => void
  sessions_attended_this_month?: number
  sessions_cancelled_this_month?: number
  attendance_percentage?: number
}

export function MonthlySummaryBlock({
  config,
  isPreview,
  isSelected,
  onConfigChange,
  sessions_attended_this_month = 12,
  sessions_cancelled_this_month = 2,
  attendance_percentage = 86,
}: MonthlySummaryBlockProps) {
  const commentary = config?.commentary || "Great work this month!"

  const renderMetric = (value: number | string) => {
    if (value === undefined || value === null) return null
    const safeValue = String(value)
    return renderText(safeValue)
  }

  const renderText = (text: string) => {
    if (!text) return null
    return text
      .split(/(\{\{[^}]+\}\})/g)
      .map((part, idx) => (
        <span key={idx}>{isVariable(part) ? <VariableHint variableId={extractVariableName(part) || ""} /> : part}</span>
      ))
  }

  const handleFieldChange = (fieldName: string, value: string) => {
    if (onConfigChange) {
      onConfigChange({
        ...config,
        [fieldName]: value,
      })
    }
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm">
      <div className="bg-linear-to-r from-[#4CAF50] to-[#45a049] px-6 py-4">
        <h3 className="text-white font-bold text-lg">Monthly Summary</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#E8F5E9] rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">Sessions Attended</p>
            <p className="text-3xl font-bold text-[#4CAF50]">{renderMetric(sessions_attended_this_month)}</p>
          </div>
          <div className="bg-[#FFF9E6] rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">Cancelled</p>
            <p className="text-3xl font-bold text-[#FFC857]">{renderMetric(sessions_cancelled_this_month)}</p>
          </div>
          <div className="bg-[#E3F2FD] rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">Attendance Rate</p>
            <p className="text-3xl font-bold text-[#4F81FF]">{renderMetric(attendance_percentage)}%</p>
          </div>
        </div>

        <div className="border-t border-[#E5E7EB] pt-4">
          {isSelected && !isPreview ? (
            <EditableTextField
              value={commentary}
              onChange={(value) => handleFieldChange("commentary", value)}
              placeholder="Great work this month!"
              inline={true}
              variablePrefix="monthly_summary"
              className="text-foreground italic block"
            />
          ) : (
            <p className="text-foreground italic">"{renderText(commentary)}"</p>
          )}
        </div>
      </div>
    </div>
  )
}


