"use client"

import { formatDistanceToNow } from "@/lib/date-utils"
import type { Template } from "@/lib/report-builder-types"
import { Copy, Pencil, Send } from "lucide-react"

interface TemplateCardProps {
  template: Template
  onEdit: () => void
  onPublish: () => void
}

export function TemplateCard({ template, onEdit, onPublish }: TemplateCardProps) {
  const variables = template.blocks.flatMap((block) => {
    // Extract variables from config
    return Object.values(block.config)
      .filter((v) => typeof v === "string" && v.includes("{{"))
      .flatMap((v) => v.match(/\{\{(.*?)\}\}/g) || [])
  })

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Header */}
        <h3 className="text-lg font-semibold text-foreground mb-2">{template.name}</h3>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 text-xs bg-[#F7F9FC] text-foreground rounded-full border border-[#E5E7EB]">
            {template.layoutType === "predefined" ? "Predefined layout" : "Custom layout"}
          </span>
          <span className="px-3 py-1 text-xs bg-[#F7F9FC] text-foreground rounded-full border border-[#E5E7EB]">
            Last edited: {formatDistanceToNow(template.lastEditedAt)}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4">{template.description}</p>

        {/* Info */}
        <div className="mb-4 space-y-2 pb-4 border-b border-[#E5E7EB]">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Blocks:</span> {template.blocks.length}
          </p>
          {variables.length > 0 && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Variables:</span> {variables.slice(0, 3).join(", ")}
              {variables.length > 3 ? `, +${variables.length - 3}` : ""}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors text-sm"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#E5E7EB] text-foreground font-medium hover:bg-[#F7F9FC] transition-colors text-sm"
            title="Duplicate template"
          >
            <Copy className="w-4 h-4" />
            Duplicate
          </button>
          <button
            onClick={onPublish}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-foreground font-medium hover:bg-[#F7F9FC] transition-colors text-sm border border-[#E5E7EB]"
          >
            <Send className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>
    </div>
  )
}

