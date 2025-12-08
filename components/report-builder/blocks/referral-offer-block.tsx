"use client"

import { extractVariableName, isVariable } from "@/lib/variables"
import { EditableTextField } from "../editable-text-field"
import { VariableHint } from "../variable-hint"

interface ReferralOfferBlockProps {
  config?: Record<string, any>
  isPreview?: boolean
  isSelected?: boolean
  onConfigChange?: (config: Record<string, any>) => void
}

export function ReferralOfferBlock({ config, isPreview, isSelected, onConfigChange }: ReferralOfferBlockProps) {
  const discount = config?.discountPercentage || 20
  const referralUrl = config?.referralUrl || "#"

  const renderText = (text: string | number) => {
    if (text === undefined || text === null) return null
    const safeText = String(text)
    return safeText
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
      <div className="bg-linear-to-r from-[#FF8CAB] to-[#FFC857] px-6 py-6">
        <h3 className="text-white font-bold text-2xl flex items-center gap-2">🎉 Amazing Progress!</h3>
      </div>
      <div className="p-6 text-center space-y-6">
        <p className="text-foreground">
          Your consistent effort is paying off! Refer a friend and get{" "}
          {isSelected && !isPreview ? (
            <EditableTextField
              value={String(discount)}
              onChange={(value) => handleFieldChange("discountPercentage", value)}
              placeholder="20"
              inline={true}
              variablePrefix="referral_offer"
              className="font-bold text-[#FF8CAB] inline-block min-w-[40px]"
            />
          ) : (
            <span className="font-bold text-[#FF8CAB]">{renderText(discount)}</span>
          )}
          % off your next package.
        </p>

        {isSelected && !isPreview ? (
          <div className="space-y-2">
            <EditableTextField
              value={referralUrl}
              onChange={(value) => handleFieldChange("referralUrl", value)}
              placeholder="https://example.com/refer"
              inline={true}
              variablePrefix="referral_offer"
              className="inline-block px-8 py-3 rounded-lg bg-[#00B8B0] text-white font-bold text-sm"
            />
            <div className="text-xs text-muted-foreground">Click to edit URL</div>
          </div>
        ) : (
          <a
            href={referralUrl}
            className="inline-block px-8 py-3 rounded-lg bg-[#00B8B0] text-white font-bold hover:bg-[#009B93] transition-colors"
          >
            🎁 Refer a Friend
          </a>
        )}
      </div>
    </div>
  )
}


