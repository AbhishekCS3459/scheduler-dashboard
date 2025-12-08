"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface DragDropContextType {
  draggedBlockId: string | null
  setDraggedBlockId: (id: string | null) => void
  dragOverBlockId: string | null
  setDragOverBlockId: (id: string | null) => void
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined)

export function DragDropProvider({ children }: { children: React.ReactNode }) {
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null)
  const [dragOverBlockId, setDragOverBlockId] = useState<string | null>(null)

  return (
    <DragDropContext.Provider
      value={{
        draggedBlockId,
        setDraggedBlockId,
        dragOverBlockId,
        setDragOverBlockId,
      }}
    >
      {children}
    </DragDropContext.Provider>
  )
}

export function useDragDrop() {
  const context = useContext(DragDropContext)
  if (!context) {
    throw new Error("useDragDrop must be used within DragDropProvider")
  }
  return context
}

