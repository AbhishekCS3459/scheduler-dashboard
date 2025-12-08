"use client"

import type { View } from "@/lib/report-builder-types"
import { cn } from "@/lib/utils"
import { Clock3, LayoutTemplate, PlusCircle } from "lucide-react"
import { useState } from "react"

interface SidebarProps {
  currentView: View
  onViewChange: (view: View) => void
  onNewTemplate: () => void
}

export function Sidebar({ currentView, onViewChange, onNewTemplate }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div
      className={cn(
        "bg-white border-r border-[#E5E7EB] flex flex-col sticky top-0 h-screen shadow-sm transition-all duration-300",
        isExpanded ? "w-64" : "w-20",
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Header */}
      <div className={cn("border-b border-[#E5E7EB] shrink-0", isExpanded ? "p-6" : "p-3")}>
        <div className={cn("flex items-center gap-3", !isExpanded && "justify-center")}>
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
            vC
          </div>
          {isExpanded && (
            <div>
              <h1 className="font-bold text-foreground text-sm leading-tight">vCura</h1>
              <p className="text-xs text-muted-foreground">Report Builder</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-2 overflow-y-auto">
        <button
          onClick={() => onViewChange("templates")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
            isExpanded && "px-4",
            currentView === "templates" ? "bg-blue-500 text-white" : "text-foreground hover:bg-[#F7F9FC]",
          )}
          title={!isExpanded ? "Templates" : ""}
        >
          <LayoutTemplate className="w-5 h-5 shrink-0" />
          {isExpanded && <span className="font-medium text-sm">Templates</span>}
        </button>
        <button
          onClick={() => onViewChange("history")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
            isExpanded && "px-4",
            currentView === "history" ? "bg-blue-500 text-white" : "text-foreground hover:bg-[#F7F9FC]",
          )}
          title={!isExpanded ? "History" : ""}
        >
          <Clock3 className="w-5 h-5 shrink-0" />
          {isExpanded && <span className="font-medium text-sm">History</span>}
        </button>
      </nav>

      {/* New Template Button */}
      <div className={cn("border-t border-[#E5E7EB] shrink-0", isExpanded ? "p-4" : "p-2")}>
        <button
          onClick={onNewTemplate}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-blue-500 text-white font-medium text-sm hover:bg-blue-600 transition-colors",
            isExpanded && "px-4",
          )}
          title={!isExpanded ? "New Template" : ""}
        >
          <PlusCircle className="w-5 h-5 shrink-0" />
          {isExpanded && <span>New</span>}
        </button>
      </div>

      {/* Footer */}
      {isExpanded && (
        <div className="p-4 border-t border-[#E5E7EB] text-xs text-muted-foreground shrink-0">
          <p>Reports sent via WhatsApp from backend.</p>
        </div>
      )}
    </div>
  )
}

