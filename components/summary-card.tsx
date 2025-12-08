"use client"
import type { LucideIcon } from "lucide-react"

interface SummaryCardProps {
  icon: LucideIcon
  label: string
  value: number
  subtext?: string
  variant?: "default" | "success" | "warning" | "error"
}

export function SummaryCard({ icon: Icon, label, value, subtext, variant = "default" }: SummaryCardProps) {
  const getColors = () => {
    switch (variant) {
      case "success":
        return { bg: "bg-blue-50", text: "text-blue-700", icon: "text-blue-600" }
      case "warning":
        return { bg: "bg-amber-50", text: "text-amber-700", icon: "text-amber-600" }
      case "error":
        return { bg: "bg-red-50", text: "text-red-700", icon: "text-red-600" }
      default:
        return { bg: "bg-blue-50", text: "text-blue-700", icon: "text-blue-600" }
    }
  }

  const colors = getColors()

  return (
    <div className={`${colors.bg} rounded-xl p-6 shadow-md hover:shadow-lg border border-slate-200/50 transition-all duration-200 hover:scale-[1.02]`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wide font-medium text-slate-600 mb-2">{label}</p>
          <p className={`text-3xl font-bold ${colors.text} mb-1`}>{value}</p>
          {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>
        <div className={`${colors.icon} bg-white/60 rounded-lg p-2.5`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>
    </div>
  )
}
