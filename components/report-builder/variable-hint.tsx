"use client"

interface VariableHintProps {
  variableId: string
}

export function VariableHint({ variableId }: VariableHintProps) {
  return (
    <span className="inline-block bg-blue-500/10 border border-blue-500 text-blue-600 px-2 py-0.5 rounded text-xs font-mono">
      {`{{${variableId}}}`}
    </span>
  )
}

