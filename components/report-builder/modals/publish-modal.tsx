"use client"

import type React from "react"

import type { Template } from "@/lib/report-builder-types"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { useState } from "react"
import { Toast } from "../toast"

interface PublishModalProps {
  template: Template
  onClose: () => void
}

export function PublishModal({ template, onClose }: PublishModalProps) {
  const [step, setStep] = useState<"upload" | "mapping" | "preview" | "success">("upload")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<string[][] | null>(null)
  const [variableMapping, setVariableMapping] = useState<Record<string, string>>({})
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // Extract variables from all blocks
  const getTemplateVariables = (): string[] => {
    const variables = new Set<string>()
    template.blocks.forEach((block) => {
      const configStr = JSON.stringify(block.config)
      const matches = configStr.match(/\{\{(\w+)\}\}/g) || []
      matches.forEach((match) => {
        variables.add(match)
      })
    })
    return Array.from(variables)
  }

  const templateVariables = getTemplateVariables()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCsvFile(file)
    const text = await file.text()
    const lines = text.split("\n").filter((line) => line.trim())
    const data = lines.map((line) => line.split(",").map((cell) => cell.trim()))

    if (data.length > 0) {
      setCsvData(data)
      // Auto-map variables to CSV columns if they exist
      const headers = data[0].map((h) => h.toLowerCase())
      const newMapping: Record<string, string> = {}

      templateVariables.forEach((variable) => {
        const cleanVar = variable.replace(/[{}]/g, "").toLowerCase()
        const matchingHeader = headers.find((h) => h === cleanVar || h.includes(cleanVar))
        if (matchingHeader) {
          newMapping[variable] = matchingHeader
        }
      })

      setVariableMapping(newMapping)
    }
  }

  const handleMappingChange = (variable: string, column: string) => {
    setVariableMapping({
      ...variableMapping,
      [variable]: column,
    })
  }

  const handlePublish = () => {
    const unmappedVariables = templateVariables.filter((v) => !variableMapping[v])
    if (unmappedVariables.length > 0) {
      setToastMessage(`Please map all variables: ${unmappedVariables.join(", ")}`)
      setShowToast(true)
      return
    }

    setStep("success")
    setTimeout(() => {
      setToastMessage("Publishing initiated. WhatsApp sending is handled by backend.")
      setShowToast(true)
      setTimeout(() => {
        onClose()
      }, 1500)
    }, 1000)
  }

  const csvHeaders = csvData ? csvData[0] : []
  const csvPreviewRow = csvData && csvData.length > 1 ? csvData[1] : null

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in-0"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto border border-slate-200/50"
          >
            {/* Header */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between p-6 border-b border-slate-200/80 sticky top-0 bg-gradient-to-r from-slate-50/50 to-white backdrop-blur-sm z-10"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                Publish Template
              </h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-6"
            >
            <p className="text-slate-500 mb-6 text-sm">
              Upload a CSV of patient IDs and map variables to publish this report.
            </p>

            {step === "upload" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Upload CSV</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50/30 transition-colors">
                    <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" />
                    <label htmlFor="csv-upload" className="cursor-pointer block">
                      <p className="text-slate-900 font-medium mb-1">Click to upload CSV</p>
                      <p className="text-sm text-slate-500">
                        Required columns: patient_id, name, age, gender, current_weight_kg, goal_weight_kg
                      </p>
                    </label>
                  </div>
                  {csvFile && <p className="text-sm text-blue-600 mt-2 font-medium">✓ {csvFile.name} selected</p>}
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep("mapping")}
                    disabled={!csvFile}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    Next: Map Variables
                  </motion.button>
                </div>
              </div>
            )}

            {step === "mapping" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Map Variables to CSV Columns</h3>
                  <div className="space-y-3">
                    {templateVariables.map((variable) => (
                      <div key={variable} className="flex items-center gap-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">{variable}</p>
                        </div>
                        <select
                          value={variableMapping[variable] || ""}
                          onChange={(e) => handleMappingChange(variable, e.target.value)}
                          className="px-3 py-2 border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                        >
                          <option value="">Select column...</option>
                          {csvHeaders.map((header, idx) => (
                            <option key={idx} value={header}>
                              {header}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                  <p className="text-xs font-semibold text-slate-600 uppercase mb-2">Preview Data</p>
                  {csvPreviewRow && (
                    <div className="space-y-2 text-sm">
                      {csvHeaders.map((header, idx) => (
                        <p key={idx}>
                          <span className="font-medium text-slate-900">{header}:</span>
                          <span className="text-slate-600 ml-2">{csvPreviewRow[idx]}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setStep("upload")}
                    className="px-6 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-100 transition-colors"
                  >
                    Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep("preview")}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
                  >
                    Next: Preview
                  </motion.button>
                </div>
              </div>
            )}

            {step === "preview" && (
              <div className="space-y-6">
                <p className="text-sm text-slate-500">
                  Preview of your report template with sample data. This will be sent to{" "}
                  {csvData ? csvData.length - 1 : 0} patients via WhatsApp.
                </p>

                <div className="bg-blue-50/50 rounded-lg p-6 min-h-96 border border-slate-200 space-y-4">
                  <h3 className="font-semibold text-lg text-slate-900">Sample Report Preview</h3>
                  <div className="bg-white rounded-lg p-4 space-y-2 text-sm border border-slate-200">
                    <p>
                      <span className="font-medium text-slate-900">Template:</span> <span className="text-slate-600">{template.name}</span>
                    </p>
                    <p>
                      <span className="font-medium text-slate-900">Blocks:</span> <span className="text-slate-600">{template.blocks.length}</span>
                    </p>
                    <p>
                      <span className="font-medium text-slate-900">Variables Mapped:</span> <span className="text-slate-600">{Object.keys(variableMapping).length}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-4">
                      All blocks will render with patient data from your CSV. Variables are replaced with actual values.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setStep("mapping")}
                    className="px-6 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-100 transition-colors"
                  >
                    Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePublish}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
                  >
                    Publish & Send
                  </motion.button>
                </div>
              </div>
            )}

            {step === "success" && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-200">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Publishing Initiated</h3>
                <p className="text-slate-500">Your template is being sent to patients via WhatsApp.</p>
              </div>
            )}
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </>
  )
}

