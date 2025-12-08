"use client"

import { extractVariableName, isVariable } from "@/lib/variables"
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { EditableTextField } from "../editable-text-field"
import { VariableHint } from "../variable-hint"

interface ProgressConsistencyBlockProps {
  config?: Record<string, any>
  isPreview?: boolean
  isSelected?: boolean
  onConfigChange?: (config: Record<string, any>) => void
}

export function ProgressConsistencyBlock({ config, isPreview, isSelected, onConfigChange }: ProgressConsistencyBlockProps) {
  const weightData = [
    { week: "W1", actual: 85, target: 85 },
    { week: "W2", actual: 84.5, target: 84 },
    { week: "W3", actual: 84, target: 83 },
    { week: "W4", actual: 83, target: 82 },
  ]

  const sessionData = [
    { week: "W1", attended: 3, missed: 0 },
    { week: "W2", attended: 3, missed: 1 },
    { week: "W3", attended: 4, missed: 0 },
    { week: "W4", attended: 3, missed: 0 },
  ]

  const total_kg_lost = config?.totalKgLost ?? 1
  const consistency_score = config?.consistencyScore ?? 85
  const motivationalText = config?.motivationalText || "You're doing great!"

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
      <div className="bg-linear-to-r from-[#FF8CAB] to-[#FF6B9D] px-6 py-4">
        <h3 className="text-white font-bold text-lg">Weight Progress & Consistency</h3>
      </div>
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-foreground mb-4">Weight Progress</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="actual" stroke="#00B8B0" strokeWidth={2} />
                <Line type="monotone" dataKey="target" stroke="#FF0000" strokeDasharray="5 5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-foreground font-semibold text-center mt-4">
              −{renderText(String(total_kg_lost))} kg since start
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Sessions & Consistency</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sessionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attended" fill="#4CAF50" />
                <Bar dataKey="missed" fill="#FF6B6B" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-center mt-4">
              <span className="text-foreground font-semibold">Consistency Score:</span>
              <span className="text-2xl font-bold text-[#00B8B0] ml-2">
                {renderText(String(consistency_score))}/100
              </span>
            </p>
          </div>
        </div>

        {isSelected && !isPreview ? (
          <div className="text-center mt-6">
            <EditableTextField
              value={motivationalText}
              onChange={(value) => handleFieldChange("motivationalText", value)}
              placeholder="You're doing great!"
              inline={true}
              variablePrefix="progress_consistency"
              className="text-foreground italic block"
            />
          </div>
        ) : (
          <p className="text-center text-foreground italic mt-6">"{renderText(motivationalText)}"</p>
        )}
      </div>
    </div>
  )
}


