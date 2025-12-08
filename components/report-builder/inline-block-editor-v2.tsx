"use client"

import { BLOCK_DEFINITIONS } from "@/lib/block-definitions"
import type { Block } from "@/lib/report-builder-types"
import { X } from "lucide-react"
import { EditableTextField } from "./editable-text-field"

interface InlineBlockEditorV2Props {
  block: Block
  onConfigChange: (config: Record<string, any>) => void
  onClose: () => void
}

export function InlineBlockEditorV2({ block, onConfigChange, onClose }: InlineBlockEditorV2Props) {
  const blockDef = BLOCK_DEFINITIONS[block.type]

  const handleFieldChange = (fieldName: string, value: string | number) => {
    onConfigChange({
      ...block.config,
      [fieldName]: value,
    })
  }

  const renderEditor = () => {
    switch (block.type) {
      case "custom-text":
        return (
          <>
            <EditableTextField
              value={block.config.heading || ""}
              onChange={(value) => handleFieldChange("heading", value)}
              placeholder="Heading"
              multiline={false}
            />
            <EditableTextField
              value={block.config.subheading || ""}
              onChange={(value) => handleFieldChange("subheading", value)}
              placeholder="Subheading"
              multiline={false}
            />
            <EditableTextField
              value={block.config.bodyText || ""}
              onChange={(value) => handleFieldChange("bodyText", value)}
              placeholder="Body text"
              multiline={true}
            />
          </>
        )

      case "inspiration-zone":
        return (
          <>
            <EditableTextField
              value={block.config.playlistDescription || ""}
              onChange={(value) => handleFieldChange("playlistDescription", value)}
              placeholder="Playlist description"
              multiline={true}
            />
            <EditableTextField
              value={block.config.motivationalLine || ""}
              onChange={(value) => handleFieldChange("motivationalLine", value)}
              placeholder="Motivational line"
              multiline={false}
            />
          </>
        )

      case "monthly-summary":
        return (
          <EditableTextField
            value={block.config.commentary || ""}
            onChange={(value) => handleFieldChange("commentary", value)}
            placeholder="Commentary"
            multiline={true}
          />
        )

      case "basic-info":
        return (
          <>
            <EditableTextField
              value={block.config.header_title || ""}
              onChange={(value) => handleFieldChange("header_title", value)}
              placeholder="Header title"
              multiline={false}
            />
            <EditableTextField
              value={block.config.header_gradient_from || ""}
              onChange={(value) => handleFieldChange("header_gradient_from", value)}
              placeholder="Gradient start color (e.g. #00B8B0)"
              multiline={false}
            />
            <EditableTextField
              value={block.config.header_gradient_to || ""}
              onChange={(value) => handleFieldChange("header_gradient_to", value)}
              placeholder="Gradient end color (e.g. #009B93)"
              multiline={false}
            />
            <EditableTextField
              value={block.config.name || ""}
              onChange={(value) => handleFieldChange("name", value)}
              placeholder="Name"
              multiline={false}
            />
            <EditableTextField
              value={String(block.config.kg_from_goal ?? "")}
              onChange={(value) => handleFieldChange("kg_from_goal", Number.parseFloat(value) || 0)}
              placeholder="Kg from goal"
              multiline={false}
            />
            <EditableTextField
              value={String(block.config.height_cm ?? "")}
              onChange={(value) => handleFieldChange("height_cm", Number.parseFloat(value) || 0)}
              placeholder="Height (cm)"
              multiline={false}
            />
            <EditableTextField
              value={String(block.config.bmi ?? "")}
              onChange={(value) => handleFieldChange("bmi", Number.parseFloat(value) || 0)}
              placeholder="BMI"
              multiline={false}
            />
            <EditableTextField
              value={String(block.config.goal_weight_kg ?? "")}
              onChange={(value) => handleFieldChange("goal_weight_kg", Number.parseFloat(value) || 0)}
              placeholder="Goal weight (kg)"
              multiline={false}
            />
          </>
        )

      case "progress-consistency":
        return (
          <EditableTextField
            value={block.config.motivationalText || ""}
            onChange={(value) => handleFieldChange("motivationalText", value)}
            placeholder="Motivational text"
            multiline={true}
          />
        )

      case "package-promotion":
        return (
          <>
            <EditableTextField
              value={block.config.title || ""}
              onChange={(value) => handleFieldChange("title", value)}
              placeholder="Title"
              multiline={false}
            />
            <EditableTextField
              value={block.config.description || ""}
              onChange={(value) => handleFieldChange("description", value)}
              placeholder="Description"
              multiline={true}
            />
            <EditableTextField
              value={block.config.buttonText || ""}
              onChange={(value) => handleFieldChange("buttonText", value)}
              placeholder="Button text"
              multiline={false}
            />
            <EditableTextField
              value={block.config.advisorUrl || ""}
              onChange={(value) => handleFieldChange("advisorUrl", value)}
              placeholder="Advisor URL"
              multiline={false}
            />
          </>
        )

      case "text-image":
        return (
          <>
            <EditableTextField
              value={block.config.heading || ""}
              onChange={(value) => handleFieldChange("heading", value)}
              placeholder="Heading"
              multiline={false}
            />
            <EditableTextField
              value={block.config.subheading || ""}
              onChange={(value) => handleFieldChange("subheading", value)}
              placeholder="Subheading"
              multiline={false}
            />
            <EditableTextField
              value={block.config.bodyText || ""}
              onChange={(value) => handleFieldChange("bodyText", value)}
              placeholder="Body text"
              multiline={true}
            />
          </>
        )

      case "before-after":
        return (
          <>
            <EditableTextField
              value={block.config.beforeCaption || ""}
              onChange={(value) => handleFieldChange("beforeCaption", value)}
              placeholder="Before caption"
              multiline={false}
            />
            <EditableTextField
              value={block.config.afterCaption || ""}
              onChange={(value) => handleFieldChange("afterCaption", value)}
              placeholder="After caption"
              multiline={false}
            />
          </>
        )

      case "next-session":
        return (
          <EditableTextField
            value={block.config.rescheduleUrl || ""}
            onChange={(value) => handleFieldChange("rescheduleUrl", value)}
            placeholder="Reschedule URL"
            multiline={false}
          />
        )

      case "referral-offer":
        return (
          <>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Discount Percentage
              </label>
              <input
                type="number"
                value={block.config.discountPercentage || 20}
                onChange={(e) => handleFieldChange("discountPercentage", Number.parseInt(e.target.value) || 20)}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B8B0] text-sm text-foreground bg-white"
              />
            </div>
            <EditableTextField
              value={block.config.referralUrl || ""}
              onChange={(value) => handleFieldChange("referralUrl", value)}
              placeholder="Referral URL"
              multiline={false}
            />
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl p-6 flex flex-col z-10 border-2 border-[#00B8B0]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-foreground text-sm">{blockDef?.name}</h4>
          <p className="text-xs text-muted-foreground mt-1">Edit fields below. Click (+) to insert variables.</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-500 hover:text-slate-900 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto space-y-3">{renderEditor()}</div>

      <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-[#E5E7EB]">
        Changes save automatically as you type
      </p>
    </div>
  )
}

