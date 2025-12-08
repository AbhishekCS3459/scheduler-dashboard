"use client"
import type { Variable } from "@/lib/variables"
import { getVariablesList } from "@/lib/variables"
import { ChevronRight } from "lucide-react"

interface VariableInsertMenuProps {
  onInsertVariable: (variableId: string) => void
  position: { top: number; left: number }
  moduleVariables?: Variable[]
}

export function VariableInsertMenu({ onInsertVariable, position, moduleVariables }: VariableInsertMenuProps) {
  const variables = getVariablesList(moduleVariables)

  return (
    <div
      className="fixed bg-white rounded-lg shadow-lg border border-[#E5E7EB] z-50 py-1"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide px-3 py-2 border-b border-[#E5E7EB]">
        Insert Variable
      </div>
      <div className="max-h-80 overflow-y-auto">
        {variables.map((variable) => (
          <button
            key={variable.id}
            onClick={() => onInsertVariable(variable.id)}
            className="w-full text-left px-3 py-2 text-sm hover:bg-[#F7F9FC] transition-colors flex items-center justify-between"
          >
            <div>
              <div className="font-semibold text-foreground">{variable.label}</div>
              <div className="text-xs text-muted-foreground font-mono">{variable.placeholder}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  )
}

