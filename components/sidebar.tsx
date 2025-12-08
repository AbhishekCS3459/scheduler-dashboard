"use client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Branch, User } from "@/lib/types"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { BarChart3, Building2, CalendarDays, Clock3, LayoutTemplate, PlusCircle, Settings, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  onNewBooking: () => void
  branchName: string
  currentUser?: User
  branches?: Branch[]
  selectedBranchId?: string | null
  onBranchChange?: (branchId: string | null) => void
  isMobile?: boolean
}

export function Sidebar({
  onNewBooking,
  branchName,
  currentUser,
  branches,
  selectedBranchId,
  onBranchChange,
  isMobile = false,
}: SidebarProps) {
  const pathname = usePathname()
  const navItems = [
    { id: "schedule", label: "Schedule", icon: CalendarDays, href: "/schedule" },
    { id: "staff_management", label: "Staff Management", icon: Users, href: "/staff_management" },
    { id: "branch_analytics", label: "Branch Analytics", icon: BarChart3, href: "/branch_analytics" },
    { id: "settings", label: "Branch Settings", icon: Settings, href: "/settings" },
    { id: "report_builder", label: "Report Builder", icon: LayoutTemplate, href: "/report_builder" },
    { id: "report_history", label: "Report History", icon: Clock3, href: "/report_history" },
  ]

  const isSuperAdmin = currentUser?.role === "super_admin"
  const effectiveBranchId = currentUser?.role === "branch_admin" ? currentUser.branchId : selectedBranchId
  const selectedBranch = branches?.find((b) => b.id === effectiveBranchId)
  const availableBranches = isSuperAdmin ? branches || [] : branches?.filter((b) => b.id === currentUser?.branchId) || []

  const handleBranchChange = (branchId: string) => {
    if (onBranchChange) {
      onBranchChange(branchId === "all" ? null : branchId)
    }
  }

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-linear-to-b from-white to-blue-50/30 border-r border-blue-100/80 backdrop-blur-sm flex flex-col shadow-lg z-30",
        isMobile ? "hidden" : "fixed left-0 top-0 h-screen w-60 lg:w-64",
      )}
    >
      {/* Brand */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="p-6 border-b border-slate-200/80"
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/30"
          >
            S
          </motion.div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900">Scheduler</h1>
            <p className="text-xs text-slate-500">Schedule Management</p>
          </div>
        </div>
        {/* Branch Selector */}
        {isSuperAdmin && branches && branches.length > 0 && onBranchChange && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-600 flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              Select Branch
            </label>
            <Select value={effectiveBranchId || "all"} onValueChange={handleBranchChange}>
              <SelectTrigger className="w-full bg-white border border-slate-200 text-xs h-8">
                <SelectValue>
                  {effectiveBranchId ? selectedBranch?.name : "All Branches"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {availableBranches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {!isSuperAdmin && selectedBranch && (
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-md border border-blue-200">
            <Building2 className="w-3 h-3 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">{selectedBranch.name}</span>
          </div>
        )}
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <motion.div
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={item.href}
              className={cn(
                "relative w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                    ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "text-slate-600 hover:bg-blue-50/80 hover:text-blue-700",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                    className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-500 to-blue-600 -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{item.label}</span>
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* New Booking Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-4 border-t border-slate-200/80 space-y-3"
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onNewBooking}
            className="w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all duration-200"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            New Booking
          </Button>
        </motion.div>
        <p className="text-xs text-slate-500 text-center">
          Branch: <span className="font-medium text-slate-700">{branchName}</span>
        </p>
      </motion.div>
    </motion.aside>
  )
}
