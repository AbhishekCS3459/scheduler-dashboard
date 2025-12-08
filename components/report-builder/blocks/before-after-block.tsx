"use client"

import { extractVariableName, isVariable } from "@/lib/variables"
import { EditableTextField } from "../editable-text-field"
import { VariableHint } from "../variable-hint"

interface BeforeAfterBlockProps {
  config?: Record<string, any>
  isPreview?: boolean
  isSelected?: boolean
  onConfigChange?: (config: Record<string, any>) => void
}

export function BeforeAfterBlock({ config, isPreview, isSelected, onConfigChange }: BeforeAfterBlockProps) {
  const beforeCaption = config?.beforeCaption || "Before"
  const afterCaption = config?.afterCaption || "After"
  const beforeImageUrl = config?.beforeImageUrl || ""
  const afterImageUrl = config?.afterImageUrl || ""

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
      <div className="bg-linear-to-r from-[#4F81FF] to-[#4CAF50] px-6 py-4">
        <h3 className="text-white font-bold text-lg">Your Transformation</h3>
      </div>
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="bg-[#F7F9FC] rounded-lg h-64 flex items-center justify-center mb-4 border-2 border-dashed border-[#E5E7EB] overflow-hidden">
              {beforeImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={beforeImageUrl} alt="Before" className="w-full h-full object-cover" />
              ) : (
                <p className="text-muted-foreground">Before Image</p>
              )}
            </div>
            {isSelected && !isPreview ? (
              <EditableTextField
                value={beforeCaption}
                onChange={(value) => handleFieldChange("beforeCaption", value)}
                placeholder="Before"
                inline={true}
                variablePrefix="before_after"
                className="font-semibold text-foreground block"
              />
            ) : (
              <p className="font-semibold text-foreground">{renderText(beforeCaption)}</p>
            )}
            {isSelected && !isPreview ? (
              <EditableTextField
                value={beforeImageUrl}
                onChange={(value) => handleFieldChange("beforeImageUrl", value)}
                placeholder="https://example.com/before.jpg"
                inline={true}
                variablePrefix="before_after"
                className="text-xs text-muted-foreground block mt-2"
              />
            ) : null}
          </div>
          <div className="text-center">
            <div className="bg-[#F7F9FC] rounded-lg h-64 flex items-center justify-center mb-4 border-2 border-dashed border-[#E5E7EB] overflow-hidden">
              {afterImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={afterImageUrl} alt="After" className="w-full h-full object-cover" />
              ) : (
                <p className="text-muted-foreground">After Image</p>
              )}
            </div>
            {isSelected && !isPreview ? (
              <EditableTextField
                value={afterCaption}
                onChange={(value) => handleFieldChange("afterCaption", value)}
                placeholder="After"
                inline={true}
                variablePrefix="before_after"
                className="font-semibold text-foreground block"
              />
            ) : (
              <p className="font-semibold text-foreground">{renderText(afterCaption)}</p>
            )}
            {isSelected && !isPreview ? (
              <EditableTextField
                value={afterImageUrl}
                onChange={(value) => handleFieldChange("afterImageUrl", value)}
                placeholder="https://example.com/after.jpg"
                inline={true}
                variablePrefix="before_after"
                className="text-xs text-muted-foreground block mt-2"
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}


