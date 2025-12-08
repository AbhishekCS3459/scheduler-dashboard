"use client"

import type React from "react"

import type { Variable } from "@/lib/variables"
import { extractVariableName, formatVariable, isVariable } from "@/lib/variables"
import { useEffect, useMemo, useRef, useState } from "react"
import { VariableHint } from "./variable-hint"

interface EditableTextFieldProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  multiline?: boolean
  className?: string
  placeholder?: string
  inline?: boolean
  allowInlineVariableMenu?: boolean
  moduleVariables?: Variable[]
  variablePrefix?: string
}

export function EditableTextField({
  value,
  onChange,
  onBlur,
  multiline = false,
  className = "",
  placeholder = "",
  inline = false,
  allowInlineVariableMenu: _allowInlineVariableMenu = false,
  moduleVariables: _moduleVariables,
  variablePrefix,
}: EditableTextFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null)
  const [variableName, setVariableName] = useState("")

  useEffect(() => {
    if (isEditing && inputRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          // Select all text for easier editing
          if (inputRef.current.select) {
            inputRef.current.select()
          }
        }
      }, 10)
    }
  }, [isEditing])

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      // Only blur if we're not in inline mode, or if the click is truly outside
      if (!inline) {
        setIsEditing(false)
        onBlur?.()
        setSelectionRange(null)
      }
    }
  }

  useEffect(() => {
    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isEditing])

  // Auto-start editing when inline mode is enabled
  useEffect(() => {
    if (inline && !isEditing) {
      setIsEditing(true)
    }
  }, [inline, isEditing])

  const sanitizedVariableName = useMemo(() => {
    if (!variableName) return ""
    const base = variableName.replace(/[{}]/g, "").trim().toLowerCase()
    const slug = base.replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
    const prefix = variablePrefix ? variablePrefix.replace(/[^a-z0-9]+/gi, "_").toLowerCase() : ""
    const withPrefix = prefix ? `${prefix}_${slug}` : slug
    return withPrefix || "variable"
  }, [variableName, variablePrefix])

  const handleSelect = (e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement
    const start = target.selectionStart ?? 0
    const end = target.selectionEnd ?? 0
    if (end > start) {
      const selected = value.substring(start, end)
      setSelectionRange({ start, end })
      setVariableName(selected)
    } else {
      setSelectionRange(null)
    }
  }

  const wrapSelectionWithVariable = () => {
    if (!selectionRange) return
    const { start, end } = selectionRange
    const currentSelection = value.substring(start, end)
    if (!currentSelection) return

    const varId = sanitizedVariableName || "variable"
    const variableToken = formatVariable(varId)
    const newValue = `${value.substring(0, start)}${variableToken}${value.substring(end)}`
    onChange(newValue)
    setSelectionRange(null)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const selectionPopover = selectionRange ? (
    <div className="absolute -top-10 right-0 flex items-center gap-2 bg-white border border-slate-200 shadow-lg rounded-lg px-3 py-2 z-20">
      <span className="text-xs text-muted-foreground">Mark selection as variable</span>
      <input
        value={sanitizedVariableName}
        onChange={(e) => setVariableName(e.target.value)}
        className="text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
        placeholder="variable_name"
      />
      <button
        type="button"
        onClick={wrapSelectionWithVariable}
        className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded px-2 py-1 transition-colors"
      >
        Apply
      </button>
    </div>
  ) : null

  // Render display mode with variables highlighted (only when not inline)
  if (!isEditing && !inline) {
    return (
      <div
        ref={containerRef}
        onClick={() => setIsEditing(true)}
        className={`cursor-pointer p-2 rounded hover:bg-[#F7F9FC] transition-colors ${className}`}
      >
        {value ? (
          <div className="space-y-1">
            {value.split(/(\{\{[^}]+\}\})/g).map((part, idx) => (
              <span key={idx}>
                {isVariable(part) ? <VariableHint variableId={extractVariableName(part) || ""} /> : part}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm italic">{placeholder || "Click to edit"}</span>
        )}
      </div>
    )
  }

  // Render editing mode
  return (
    <div
      ref={containerRef}
      className={`relative ${inline ? "inline-flex items-center" : ""}`}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {multiline ? (
        <textarea
          ref={inputRef as React.Ref<HTMLTextAreaElement>}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => {
            setIsEditing(true)
            e.stopPropagation()
          }}
          onSelect={handleSelect}
          placeholder={placeholder}
          className={`${
            inline
              ? "px-2 py-1 border border-transparent hover:border-white/30 focus:border-white/50 focus:bg-white/10 rounded text-sm bg-transparent min-w-[40px] outline-none"
              : "w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm text-slate-700 bg-white resize-none"
          } transition-all ${className}`}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          rows={inline ? 1 : 3}
        />
      ) : (
        <input
          ref={inputRef as React.Ref<HTMLInputElement>}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => {
            setIsEditing(true)
            e.stopPropagation()
          }}
          onSelect={handleSelect}
          placeholder={placeholder}
          className={`${
            inline
              ? "px-2 py-1 border border-transparent hover:border-white/30 focus:border-white/50 focus:bg-white/10 rounded text-sm bg-transparent min-w-[40px] outline-none"
              : "w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm text-slate-700 bg-white"
          } transition-all ${className}`}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        />
      )}
      {selectionPopover}
    </div>
  )
}

export type { EditableTextFieldProps }

