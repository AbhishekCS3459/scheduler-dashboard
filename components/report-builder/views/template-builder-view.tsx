"use client"

import { BLOCK_DEFINITIONS } from "@/lib/block-definitions"
import type { Block, BlockType, Template } from "@/lib/report-builder-types"
import { useState } from "react"
import { BlockPalette } from "../block-palette"
import { Canvas } from "../canvas"
import { PublishModal } from "../modals/publish-modal"
import { PreviewModal } from "../preview-modal"

interface TemplateBuilderViewProps {
  template: Template
  onSave: (template: Template) => void
  onBack: () => void
}

export function TemplateBuilderView({ template: initialTemplate, onSave, onBack }: TemplateBuilderViewProps) {
  const [template, setTemplate] = useState(initialTemplate)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showPublish, setShowPublish] = useState(false)

  const handleAddBlock = (blockType: BlockType) => {
    const blockDef = BLOCK_DEFINITIONS[blockType]
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type: blockType,
      order: template.blocks.length,
      config: blockDef.defaultConfig || {},
    }

    setTemplate({
      ...template,
      blocks: [...template.blocks, newBlock],
    })
    setSelectedBlockId(newBlock.id)
  }

  const handleDeleteBlock = (blockId: string) => {
    setTemplate({
      ...template,
      blocks: template.blocks.filter((b) => b.id !== blockId),
    })
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null)
    }
  }

  const handleDuplicateBlock = (blockId: string) => {
    const blockToDuplicate = template.blocks.find((b) => b.id === blockId)
    if (!blockToDuplicate) return

    const duplicatedBlock: Block = {
      ...blockToDuplicate,
      id: `block-${Date.now()}`,
      order: template.blocks.length,
      config: { ...blockToDuplicate.config },
    }

    setTemplate({
      ...template,
      blocks: [...template.blocks, duplicatedBlock],
    })
  }

  const handleBlockConfigChange = (blockId: string, config: Record<string, any>) => {
    setTemplate({
      ...template,
      blocks: template.blocks.map((b) => (b.id === blockId ? { ...b, config } : b)),
    })
  }

  const handleBlocksReorder = (blocks: Block[]) => {
    setTemplate({
      ...template,
      blocks: blocks.map((b, idx) => ({ ...b, order: idx })),
    })
  }

  const handleSave = () => {
    onSave({
      ...template,
      lastEditedAt: new Date(),
    })
  }

  return (
    <>
      <div className="flex h-full">
        {/* Left: Block Palette */}
        <BlockPalette onAddBlock={handleAddBlock} />

        {/* Right: Canvas */}
        <Canvas
          template={template}
          selectedBlockId={selectedBlockId}
          onBlockSelect={setSelectedBlockId}
          onBlockDelete={handleDeleteBlock}
          onBlockDuplicate={handleDuplicateBlock}
          onBlocksReorder={handleBlocksReorder}
          onTemplateNameChange={(name: string) => setTemplate({ ...template, name })}
          onTemplateDescriptionChange={(description: string) => setTemplate({ ...template, description })}
          onBlockConfigChange={handleBlockConfigChange}
          onPreview={() => setShowPreview(true)}
          onSave={handleSave}
          onPublish={() => setShowPublish(true)}
        />
      </div>

      {/* Modals */}
      {showPreview && <PreviewModal template={template} onClose={() => setShowPreview(false)} />}
      {showPublish && <PublishModal template={template} onClose={() => setShowPublish(false)} />}
    </>
  )
}

