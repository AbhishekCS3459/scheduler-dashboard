"use client"

import type { Block, Template } from "@/lib/report-builder-types"
import { motion } from "framer-motion"
import { Copy, Eye, GripVertical, Save, Send, Settings2, Trash2 } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { BlockRenderer } from "./block-renderer"

interface CanvasProps {
  template: Template
  selectedBlockId: string | null
  onBlockSelect: (blockId: string | null) => void
  onBlockDelete: (blockId: string) => void
  onBlockDuplicate: (blockId: string) => void
  onBlocksReorder: (blocks: Block[]) => void
  onTemplateNameChange: (name: string) => void
  onTemplateDescriptionChange: (description: string) => void
  onBlockConfigChange: (blockId: string, config: Record<string, any>) => void
  onPreview: () => void
  onSave: () => void
  onPublish: () => void
}

export function Canvas({
  template,
  selectedBlockId,
  onBlockSelect,
  onBlockDelete,
  onBlockDuplicate,
  onBlocksReorder,
  onTemplateNameChange,
  onTemplateDescriptionChange,
  onBlockConfigChange,
  onPreview,
  onSave,
  onPublish,
}: CanvasProps) {
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null)
  const [dragOverBlockId, setDragOverBlockId] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedBlockId(blockId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDragEnter = (blockId: string) => {
    setDragOverBlockId(blockId)
  }

  const handleDragLeave = () => {
    setDragOverBlockId(null)
  }

  const handleDrop = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault()
    if (!draggedBlockId || draggedBlockId === targetBlockId) return

    const draggedIndex = template.blocks.findIndex((b) => b.id === draggedBlockId)
    const targetIndex = template.blocks.findIndex((b) => b.id === targetBlockId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newBlocks = [...template.blocks]
    const [draggedBlock] = newBlocks.splice(draggedIndex, 1)
    newBlocks.splice(targetIndex, 0, draggedBlock)

    onBlocksReorder(newBlocks)
    setDraggedBlockId(null)
    setDragOverBlockId(null)
  }

  const sortedBlocks = [...template.blocks].sort((a, b) => a.order - b.order)

  return (
    <div className="flex flex-1 gap-6 bg-linear-to-br from-blue-50/30 via-white to-slate-50/30">
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Section */}
        <div className="bg-white border-b border-slate-200/80 shrink-0">
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                Template Name
              </label>
              <input
                type="text"
                value={template.name}
                onChange={(e) => onTemplateNameChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm font-semibold text-slate-900 bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                Description
              </label>
              <input
                type="text"
                value={template.description}
                onChange={(e) => onTemplateDescriptionChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm text-slate-700 bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto space-y-4">
            {sortedBlocks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-slate-200">
                <p className="text-slate-500 text-sm">No blocks yet. Add blocks from the left panel.</p>
              </div>
            ) : (
              sortedBlocks.map((block, index) => (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className={`group transition-all ${
                    dragOverBlockId === block.id ? "scale-102 opacity-60" : ""
                  } ${draggedBlockId === block.id ? "opacity-40" : ""}`}
                >
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, block.id)}
                    onDragOver={handleDragOver}
                    onDragEnter={() => handleDragEnter(block.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, block.id)}
                  >
                  <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-2 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing transition-colors"
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-5 h-5" />
                    </button>
                    <div className="flex-1" />
                    <button
                      onClick={() => onBlockSelect(block.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        selectedBlockId === block.id
                          ? "bg-blue-500 text-white"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                      title="Edit block"
                    >
                      <Settings2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onBlockDuplicate(block.id)}
                      className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onBlockDelete(block.id)}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div
                    className={`relative transition-all rounded-xl ${
                      selectedBlockId === block.id ? "ring-2 ring-blue-500 ring-offset-2" : "hover:shadow-md"
                    }`}
                  >
                    <BlockRenderer
                        block={block}
                      isPreview={false}
                      isSelected={selectedBlockId === block.id}
                      onSelect={() => onBlockSelect(block.id)}
                        onConfigChange={(config: Record<string, any>) => onBlockConfigChange(block.id, config)}
                      />
                  </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-linear-to-r from-white to-blue-50/30 border-t border-slate-200/80 p-6 flex items-center justify-end gap-3 shrink-0 backdrop-blur-sm"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPreview}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm hover:shadow-md"
          >
            <Eye className="w-4 h-4" />
            Preview
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSave}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-linear-to-r from-blue-500 to-blue-600 text-white text-sm font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
          >
            <Save className="w-4 h-4" />
            Save
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPublish}
            className="flex items-center gap-2 px-6 py-2 rounded-lg border-2 border-blue-500 text-blue-600 text-sm font-medium hover:bg-linear-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white transition-all shadow-sm hover:shadow-lg"
          >
            <Send className="w-4 h-4" />
            Publish
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

