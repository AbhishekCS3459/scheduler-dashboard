"use client"

import { extractVariableName, isVariable } from "@/lib/variables"
import { EditableTextField } from "../editable-text-field"
import { VariableHint } from "../variable-hint"

interface CustomTextBlockProps {
  config?: Record<string, any>
  isPreview?: boolean
  isSelected?: boolean
  onConfigChange?: (config: Record<string, any>) => void
}

export function CustomTextBlock({ config, isPreview, isSelected = false, onConfigChange }: CustomTextBlockProps) {
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
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm p-6">
      {isSelected && !isPreview ? (
        <EditableTextField
          value={config?.heading || ""}
          onChange={(value) => handleFieldChange("heading", value)}
          placeholder="Your Heading"
          inline={true}
          allowInlineVariableMenu={true}
          className="text-xl font-bold mb-2 block"
          variablePrefix="custom_text"
        />
      ) : (
        <h3 className="text-xl font-bold text-foreground mb-2">{renderText(config?.heading) || "Your Heading"}</h3>
      )}
      {isSelected && !isPreview ? (
        <EditableTextField
          value={config?.subheading || ""}
          onChange={(value) => handleFieldChange("subheading", value)}
          placeholder="Your Subheading"
          inline={true}
          allowInlineVariableMenu={true}
          className="text-lg text-[#00B8B0] font-semibold mb-4 block"
          variablePrefix="custom_text"
        />
      ) : (
        <h4 className="text-lg text-[#00B8B0] font-semibold mb-4">
          {renderText(config?.subheading) || "Your Subheading"}
        </h4>
      )}
      {isSelected && !isPreview ? (
        <EditableTextField
          value={config?.bodyText || ""}
          onChange={(value) => handleFieldChange("bodyText", value)}
          placeholder="Your content here"
          multiline={true}
          inline={true}
          allowInlineVariableMenu={true}
          className="text-foreground whitespace-pre-wrap block"
          variablePrefix="custom_text"
        />
      ) : (
        <p className="text-foreground whitespace-pre-wrap">{renderText(config?.bodyText) || "Your content here"}</p>
      )}
    </div>
  )
}


