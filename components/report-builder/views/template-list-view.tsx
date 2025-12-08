"use client"

import { PublishModal } from "@/components/report-builder/modals/publish-modal"
import type { Template } from "@/lib/report-builder-types"
import { formatDistanceToNow } from "date-fns"
import { motion } from "framer-motion"
import { Copy, Edit2, HelpCircle, PlusCircle, Send, Trash2 } from "lucide-react"
import { useState } from "react"

interface TemplateListViewProps {
  templates: Template[]
  onNewTemplate: () => void
  onEditTemplate: (template: Template) => void
  onDuplicateTemplate: (template: Template) => void
  onDeleteTemplate: (templateId: string) => void
}

export function TemplateListView({
  templates,
  onNewTemplate,
  onEditTemplate,
  onDuplicateTemplate,
  onDeleteTemplate,
}: TemplateListViewProps) {
  const [publishTemplate, setPublishTemplate] = useState<Template | null>(null)

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-b border-slate-200/80 bg-linear-to-r from-white via-blue-50/30 to-white p-6 lg:p-8 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl lg:text-3xl font-semibold text-slate-900 tracking-tight"
              >
                Templates
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-slate-500 mt-1"
              >
                Create and manage patient wellness report templates.
              </motion.p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNewTemplate}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-blue-500 to-blue-600 text-white font-medium text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                New Template
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                title="How publishing works"
              >
                <HelpCircle className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="flex-1 overflow-auto p-6 lg:p-8">
          {templates.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-slate-500 mb-4 text-base"
              >
                No templates yet. Create your first one!
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNewTemplate}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-linear-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
              >
                <PlusCircle className="w-5 h-5" />
                Create Template
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
            >
              <table className="w-full">
                <thead className="bg-linear-to-r from-slate-50 to-slate-100/50 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                      Template Name
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                      Description
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                      Last Modified
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                      Blocks
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80">
                  {templates.map((template, index) => (
                    <motion.tr
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01, x: 4 }}
                      className="hover:bg-blue-50/30 transition-all cursor-pointer group"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                          {template.name}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-600 truncate">{template.description || "—"}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-600">
                          {formatDistanceToNow(new Date(template.lastEditedAt), { addSuffix: true })}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <motion.span
                          whileHover={{ scale: 1.1 }}
                          className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200"
                        >
                          {template.blocks.length} blocks
                        </motion.span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onEditTemplate(template)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onDuplicateTemplate(template)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setPublishTemplate(template)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Publish"
                          >
                            <Send className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.2, rotate: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onDeleteTemplate(template.id)}
                            className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </div>
      </div>

      {publishTemplate && <PublishModal template={publishTemplate} onClose={() => setPublishTemplate(null)} />}
    </>
  )
}

