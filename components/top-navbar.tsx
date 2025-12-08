"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Branch, User } from "@/lib/types"
import { motion } from "framer-motion"
import { Building2, User as UserIcon } from "lucide-react"

interface TopNavbarProps {
  currentUser: User
  branches: Branch[]
  selectedBranchId: string | null
  onBranchChange: (branchId: string | null) => void
}

export function TopNavbar({ currentUser, branches, selectedBranchId, onBranchChange }: TopNavbarProps) {
  // Super admin can see all branches, branch admin can only see their branch
  const availableBranches =
    currentUser.role === "super_admin" ? branches : branches.filter((b) => b.id === currentUser.branchId)

  // For branch admin, always use their branch
  const effectiveBranchId = currentUser.role === "branch_admin" ? currentUser.branchId : selectedBranchId

  const selectedBranch = branches.find((b) => b.id === effectiveBranchId)

  const handleBranchChange = (branchId: string) => {
    if (currentUser.role === "super_admin") {
      onBranchChange(branchId === "all" ? null : branchId)
    } else {
      // Branch admin can't change branch
      onBranchChange(currentUser.branchId || null)
    }
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 shadow-sm"
    >
      <div className="flex items-center justify-between px-6 h-16">
        {/* Left side - Branch Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-slate-600">Branch:</span>
          </div>

          {currentUser.role === "super_admin" ? (
            <Select value={effectiveBranchId || "all"} onValueChange={handleBranchChange}>
              <SelectTrigger className="w-[280px] bg-white border border-slate-200 shadow-sm">
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
          ) : (
            <div className="px-3 py-2 bg-slate-50 rounded-md border border-slate-200">
              <span className="text-sm font-medium text-slate-700">{selectedBranch?.name || "No branch assigned"}</span>
            </div>
          )}
        </div>

        {/* Right side - User Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-md">
            <UserIcon className="w-4 h-4 text-slate-600" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-900">{currentUser.name}</span>
              <span className="text-xs text-slate-500">
                {currentUser.role === "super_admin" ? "Super Admin" : "Branch Admin"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
