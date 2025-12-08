"use client"

import { extractVariableName, isVariable } from "@/lib/variables"
import { EditableTextField } from "../editable-text-field"
import { VariableHint } from "../variable-hint"

interface PackagePromotionBlockProps {
  config?: Record<string, any>
  isPreview?: boolean
  isSelected?: boolean
  onConfigChange?: (config: Record<string, any>) => void
}

export function PackagePromotionBlock({ config, isPreview, isSelected, onConfigChange }: PackagePromotionBlockProps) {
  const title = config?.title || "Cryo360: Freeze Away Fat"
  const description = config?.description || "Shape your body and elevate your life journey"
  const bullets =
    config?.bullets ||
    [
      "Non-invasive fat reduction",
      "No surgery or downtime",
      "Precise temperature control",
      "Safe & FDA-approved technology",
    ]
  const buttonText = config?.buttonText || "Talk to an advisor"
  const advisorUrl = config?.advisorUrl || "#"
  const promoImageUrl = config?.promoImageUrl || ""

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

  const handleBulletChange = (index: number, value: string) => {
    if (!onConfigChange) return
    const nextBullets = [...bullets]
    nextBullets[index] = value
    onConfigChange({
      ...config,
      bullets: nextBullets,
    })
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden border-2 border-[#00B8B0] shadow-sm">
      <div className="bg-linear-to-r from-[#00B8B0] to-[#009B93] px-6 py-6">
        {isSelected && !isPreview ? (
          <>
            <EditableTextField
              value={title}
              onChange={(value) => handleFieldChange("title", value)}
              placeholder="Cryo360: Freeze Away Fat"
              inline={true}
              variablePrefix="package_promotion"
              className="text-white font-bold text-2xl block"
            />
            <div className="mt-2">
              <EditableTextField
                value={description}
                onChange={(value) => handleFieldChange("description", value)}
                placeholder="Shape your body and elevate your life journey"
                multiline={true}
                inline={true}
                variablePrefix="package_promotion"
                className="text-white/90 block"
              />
            </div>
          </>
        ) : (
          <>
            <h3 className="text-white font-bold text-2xl">{renderText(title) || "Cryo360: Freeze Away Fat"}</h3>
            <p className="text-white/90 mt-2">{renderText(description) || "Shape your body and elevate your life journey"}</p>
          </>
        )}
      </div>
      <div className="p-6 space-y-4">
        {promoImageUrl ? (
          <div className="rounded-xl overflow-hidden border border-[#E5E7EB]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={promoImageUrl} alt="Promotion" className="w-full h-48 object-cover" />
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden border border-dashed border-[#E5E7EB] bg-[#F7F9FC] h-48 flex items-center justify-center text-muted-foreground">
            Promo image (optional)
          </div>
        )}

        <ul className="space-y-2">
          {bullets.map((bullet: string, idx: number) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="text-[#00B8B0] font-bold">✓</span>
              {isSelected && !isPreview ? (
                <EditableTextField
                  value={bullet}
                  onChange={(value) => handleBulletChange(idx, value)}
                  placeholder="Bullet"
                  inline={true}
                  variablePrefix="package_promotion"
                  className="text-foreground flex-1 block"
                />
              ) : (
                <span className="text-foreground">{renderText(bullet)}</span>
              )}
            </li>
          ))}
        </ul>

        {isSelected && !isPreview ? (
          <div className="space-y-2">
            <EditableTextField
              value={buttonText}
              onChange={(value) => handleFieldChange("buttonText", value)}
              placeholder="Talk to an advisor"
              inline={true}
              variablePrefix="package_promotion"
              className="block text-center px-6 py-3 rounded-lg bg-[#00B8B0] text-white font-bold"
            />
            <EditableTextField
              value={advisorUrl}
              onChange={(value) => handleFieldChange("advisorUrl", value)}
              placeholder="https://example.com/advisor"
              inline={true}
              variablePrefix="package_promotion"
              className="block text-center text-xs text-muted-foreground"
            />
            <EditableTextField
              value={promoImageUrl}
              onChange={(value) => handleFieldChange("promoImageUrl", value)}
              placeholder="https://example.com/promo.jpg"
              inline={true}
              variablePrefix="package_promotion"
              className="block text-center text-xs text-muted-foreground"
            />
          </div>
        ) : (
          <a
            href={advisorUrl}
            className="block text-center px-6 py-3 rounded-lg bg-[#00B8B0] text-white font-bold hover:bg-[#009B93] transition-colors mt-6"
          >
            {renderText(buttonText) || "Talk to an advisor"}
          </a>
        )}
      </div>
    </div>
  )
}


