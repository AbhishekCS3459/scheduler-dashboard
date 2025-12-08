"use client"

import { BLOCK_DEFINITIONS } from "@/lib/block-definitions"
import type { Block } from "@/lib/report-builder-types"
import { X } from "lucide-react"

interface InlineBlockEditorProps {
  block: Block
  onConfigChange: (config: Record<string, any>) => void
  onClose: () => void
}

export function InlineBlockEditor({ block, onConfigChange, onClose }: InlineBlockEditorProps) {
  const blockDef = BLOCK_DEFINITIONS[block.type]

  const handleFieldChange = (fieldName: string, value: string) => {
    onConfigChange({
      ...block.config,
      [fieldName]: value,
    })
  }

  return (
    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl p-6 flex flex-col z-10 border-2 border-blue-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-foreground text-sm">{blockDef?.name}</h4>
          <p className="text-xs text-muted-foreground mt-1">Click fields to edit directly</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-muted-foreground hover:text-foreground hover:bg-blue-50 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {block.type === "custom-text" && (
          <>
            <EditableField
              label="Heading"
              value={block.config.heading || ""}
              onChange={(value) => handleFieldChange("heading", value)}
              multiline={false}
            />
            <EditableField
              label="Subheading"
              value={block.config.subheading || ""}
              onChange={(value) => handleFieldChange("subheading", value)}
              multiline={false}
            />
            <EditableField
              label="Body Text"
              value={block.config.bodyText || ""}
              onChange={(value) => handleFieldChange("bodyText", value)}
              multiline={true}
            />
          </>
        )}

        {block.type === "inspiration-zone" && (
          <>
            <EditableField
              label="Playlist Description"
              value={block.config.playlistDescription || ""}
              onChange={(value) => handleFieldChange("playlistDescription", value)}
              multiline={true}
            />
            <EditableField
              label="Motivational Line"
              value={block.config.motivationalLine || ""}
              onChange={(value) => handleFieldChange("motivationalLine", value)}
              multiline={false}
            />
          </>
        )}

        {block.type === "monthly-summary" && (
          <EditableField
            label="Commentary"
            value={block.config.commentary || ""}
            onChange={(value) => handleFieldChange("commentary", value)}
            multiline={true}
          />
        )}

        {block.type === "package-promotion" && (
          <>
            <EditableField
              label="Title"
              value={block.config.title || ""}
              onChange={(value) => handleFieldChange("title", value)}
              multiline={false}
            />
            <EditableField
              label="Description"
              value={block.config.description || ""}
              onChange={(value) => handleFieldChange("description", value)}
              multiline={true}
            />
            <EditableField
              label="Button Text"
              value={block.config.buttonText || ""}
              onChange={(value) => handleFieldChange("buttonText", value)}
              multiline={false}
            />
            <EditableField
              label="Advisor URL"
              value={block.config.advisorUrl || ""}
              onChange={(value) => handleFieldChange("advisorUrl", value)}
              multiline={false}
            />
          </>
        )}

        {block.type === "text-image" && (
          <>
            <EditableField
              label="Heading"
              value={block.config.heading || ""}
              onChange={(value) => handleFieldChange("heading", value)}
              multiline={false}
            />
            <EditableField
              label="Subheading"
              value={block.config.subheading || ""}
              onChange={(value) => handleFieldChange("subheading", value)}
              multiline={false}
            />
            <EditableField
              label="Body Text"
              value={block.config.bodyText || ""}
              onChange={(value) => handleFieldChange("bodyText", value)}
              multiline={true}
            />
          </>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-[#E5E7EB]">
        Changes save automatically as you type
      </p>
    </div>
  )
}

interface EditableFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
}

function EditableField({ label, value, onChange, multiline }: EditableFieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-foreground bg-white resize-none"
          rows={3}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-foreground bg-white"
        />
      )}
    </div>
  )
}

