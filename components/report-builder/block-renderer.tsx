"use client"

import type { Block } from "@/lib/report-builder-types"
import type React from "react"
import { BasicInfoBlock } from "./blocks/basic-info-block"
import { BeforeAfterBlock } from "./blocks/before-after-block"
import { CustomTextBlock } from "./blocks/custom-text-block"
import { DividerBlock } from "./blocks/divider-block"
import { InspirationZoneBlock } from "./blocks/inspiration-zone-block"
import { MonthlySummaryBlock } from "./blocks/monthly-summary-block"
import { NextSessionBlock } from "./blocks/next-session-block"
import { PackagePromotionBlock } from "./blocks/package-promotion-block"
import { ProgressConsistencyBlock } from "./blocks/progress-consistency-block"
import { ReferralOfferBlock } from "./blocks/referral-offer-block"
import { TextImageBlock } from "./blocks/text-image-block"

interface BlockRendererProps {
  block: Block
  isPreview?: boolean
  isSelected?: boolean
  onSelect?: () => void
  onConfigChange?: (config: Record<string, any>) => void
}

export function BlockRenderer({ block, isPreview, isSelected, onSelect, onConfigChange }: BlockRendererProps) {
  const containerClass = isSelected ? "ring-2 ring-blue-500 rounded-2xl" : ""

  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger select if clicking on an editable field
    if ((e.target as HTMLElement).closest('input, textarea, [contenteditable="true"]')) {
      return
    }
    if (onSelect) onSelect()
  }

  return (
    <div className={containerClass} onClick={handleClick}>
      {block.type === "basic-info" && (
        <BasicInfoBlock
          config={block.config}
          isPreview={isPreview}
          isSelected={isSelected}
          onConfigChange={onConfigChange}
        />
      )}
      {block.type === "inspiration-zone" && (
        <InspirationZoneBlock config={block.config} isPreview={isPreview} isSelected={isSelected} onConfigChange={onConfigChange} />
      )}
      {block.type === "next-session" && (
        <NextSessionBlock config={block.config} isPreview={isPreview} isSelected={isSelected} onConfigChange={onConfigChange} />
      )}
      {block.type === "monthly-summary" && (
        <MonthlySummaryBlock config={block.config} isPreview={isPreview} isSelected={isSelected} onConfigChange={onConfigChange} />
      )}
      {block.type === "progress-consistency" && (
        <ProgressConsistencyBlock
          config={block.config}
          isPreview={isPreview}
          isSelected={isSelected}
          onConfigChange={onConfigChange}
        />
      )}
      {block.type === "package-promotion" && (
        <PackagePromotionBlock config={block.config} isPreview={isPreview} isSelected={isSelected} onConfigChange={onConfigChange} />
      )}
      {block.type === "before-after" && (
        <BeforeAfterBlock config={block.config} isPreview={isPreview} isSelected={isSelected} onConfigChange={onConfigChange} />
      )}
      {block.type === "referral-offer" && (
        <ReferralOfferBlock config={block.config} isPreview={isPreview} isSelected={isSelected} onConfigChange={onConfigChange} />
      )}
      {block.type === "custom-text" && (
        <CustomTextBlock config={block.config} isPreview={isPreview} isSelected={isSelected} onConfigChange={onConfigChange} />
      )}
      {block.type === "text-image" && (
        <TextImageBlock config={block.config} isPreview={isPreview} isSelected={isSelected} onConfigChange={onConfigChange} />
      )}
      {block.type === "divider" && <DividerBlock />}
    </div>
  )
}

