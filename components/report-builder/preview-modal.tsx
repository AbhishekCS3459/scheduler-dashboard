"use client"

import type { Template } from "@/lib/report-builder-types"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { BlockRenderer } from "./block-renderer"

interface PreviewModalProps {
  template: Template
  onClose: () => void
}

export function PreviewModal({ template, onClose }: PreviewModalProps) {
  const sortedBlocks = [...template.blocks].sort((a, b) => a.order - b.order)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-white to-slate-50/50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col backdrop-blur-sm border border-slate-200/50"
        >
          {/* Header */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between p-6 border-b border-[#E5E7EB] sticky top-0 bg-white/80 backdrop-blur-sm z-10"
          >
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                {template.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-[#F7F9FC] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="space-y-4">
              {sortedBlocks.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-muted-foreground text-center py-8"
                >
                  No blocks in this template yet.
                </motion.p>
              ) : (
                sortedBlocks.map((block, index) => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <BlockRenderer block={block} isPreview={true} />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

