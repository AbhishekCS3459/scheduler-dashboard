"use client"

import { BLOCK_DEFINITIONS } from "@/lib/block-definitions"
import type { BlockType } from "@/lib/report-builder-types"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"

interface BlockPaletteProps {
  onAddBlock: (blockType: BlockType) => void
}

export function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  const predefinedBlocks = Object.values(BLOCK_DEFINITIONS).filter((b) => b.category === "predefined")
  const customBlocks = Object.values(BLOCK_DEFINITIONS).filter((b) => b.category === "custom")

  return (
    <div className="w-72 bg-gradient-to-b from-white to-blue-50/30 border-r border-slate-200 overflow-y-auto flex flex-col shrink-0 backdrop-blur-sm">
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-6 border-b border-slate-200/80 sticky top-0 bg-white/80 backdrop-blur-sm z-10"
      >
        <h2 className="font-semibold text-slate-900 text-sm">Available Blocks</h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">Click to add blocks to your template</p>
      </motion.div>

      <div className="flex-1 overflow-y-auto">
        {/* Predefined Blocks */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-3">Predefined Layouts</h3>
          <div className="space-y-2">
            {predefinedBlocks.map((blockDef, index) => (
              <motion.button
                key={blockDef.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAddBlock(blockDef.id as BlockType)}
                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50/50 hover:border-blue-300 hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <p className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 uppercase tracking-wide transition-colors">
                    {blockDef.name}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{blockDef.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                      Predefined
                    </span>
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      whileHover={{ scale: 1.2, rotate: 0 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Plus className="w-3.5 h-3.5 text-blue-500" />
                    </motion.div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Custom Blocks */}
        <div className="p-4 border-t border-slate-200/80">
          <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-3">Custom Blocks</h3>
          <div className="space-y-2">
            {customBlocks.map((blockDef, index) => (
              <motion.button
                key={blockDef.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: (predefinedBlocks.length + index) * 0.05 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAddBlock(blockDef.id as BlockType)}
                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50/50 hover:border-blue-300 hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <p className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 uppercase tracking-wide transition-colors">
                    {blockDef.name}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{blockDef.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                      Custom
                    </span>
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      whileHover={{ scale: 1.2, rotate: 0 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Plus className="w-3.5 h-3.5 text-blue-500" />
                    </motion.div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

