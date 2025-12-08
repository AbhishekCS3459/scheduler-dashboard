"use client"

import type { Variable } from "@/lib/variables"
import { extractVariableName, isVariable } from "@/lib/variables"
import { EditableTextField } from "../editable-text-field"
import { VariableHint } from "../variable-hint"

interface TextImageBlockProps {
  config?: Record<string, any>
  isPreview?: boolean
  isSelected?: boolean
  onConfigChange?: (config: Record<string, any>) => void
  moduleVariables?: Variable[]
}

export function TextImageBlock({ config, isPreview, isSelected, onConfigChange, moduleVariables }: TextImageBlockProps) {
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
      <div className="grid md:grid-cols-2 gap-6 p-6">
        <div className="bg-[#F7F9FC] rounded-lg h-64 flex items-center justify-center border-2 border-dashed border-[#E5E7EB] overflow-hidden">
          {config?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={config.imageUrl} alt={config?.heading || "Image"} className="w-full h-full object-cover" />
          ) : (
            <p className="text-muted-foreground">Image Placeholder</p>
          )}
        </div>
        <div className="flex flex-col justify-center">
          {isSelected && !isPreview ? (
            <EditableTextField
              value={config?.heading || ""}
              onChange={(value) => handleFieldChange("heading", value)}
              placeholder="Your Heading"
              inline={true}
              variablePrefix="text_image"
              moduleVariables={moduleVariables}
              className="text-xl font-bold mb-2 block"
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
              variablePrefix="text_image"
              moduleVariables={moduleVariables}
              className="text-lg text-[#00B8B0] font-semibold mb-4 block"
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
              variablePrefix="text_image"
              moduleVariables={moduleVariables}
              className="text-foreground whitespace-pre-wrap block"
            />
          ) : (
            <p className="text-foreground whitespace-pre-wrap">{renderText(config?.bodyText) || "Your content here"}</p>
          )}

          {isSelected && !isPreview ? (
            <div className="mt-3">
              <EditableTextField
                value={config?.imageUrl || ""}
                onChange={(value) => handleFieldChange("imageUrl", value)}
                placeholder="https://example.com/image.jpg"
                inline={true}
              variablePrefix="text_image"
                moduleVariables={moduleVariables}
                className="text-xs text-muted-foreground block"
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}


