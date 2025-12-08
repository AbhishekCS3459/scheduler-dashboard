"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useBranchAnalytics } from "@/hooks/useBranchAnalytics"
import type { Branch } from "@/lib/types"
import { BarChart3, Info, MessageSquare, Phone, RefreshCw, TrendingDown, TrendingUp, Users } from "lucide-react"
import { useMemo, useState } from "react"

interface BranchAnalyticsViewProps {
  branch: Branch | null
  branches?: Branch[]
}

export function BranchAnalyticsView({ branch, branches = [] }: BranchAnalyticsViewProps) {
  const [selectedBranch, setSelectedBranch] = useState<string>(branch?.id || "all")
  const [selectedDateRange, setSelectedDateRange] = useState("today")
  const [customDate, setCustomDate] = useState(new Date().toISOString().split("T")[0])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(7)

  const { kpis, tableData, isLoading } = useBranchAnalytics(selectedBranch, selectedDateRange, customDate)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsRefreshing(false)
  }

  const paginatedData = useMemo(() => {
    return tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [tableData, page, rowsPerPage])

  const hasData = kpis && kpis.noShowRate !== undefined

  const totalPages = Math.ceil(tableData.length / rowsPerPage)

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-200 shadow-sm bg-white p-4">
        <div className="flex flex-wrap items-end gap-4">
          {/* Branch Selector */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-slate-600 mb-2 block">Branch</label>
            <Select value={selectedBranch} onValueChange={(value) => {
              setSelectedBranch(value)
              setPage(0)
            }}>
              <SelectTrigger className="bg-white border border-slate-200 hover:border-blue-300 focus:ring-2 focus:ring-blue-500/20 w-full">
                <SelectValue>
                  {selectedBranch === "all" ? "All Branches" : branches.find(b => b.id === selectedBranch)?.name || "Select Branch"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date range buttons */}
          <div className="flex gap-2">
            <Button
              variant={selectedDateRange === "today" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedDateRange("today")
                setPage(0)
              }}
            >
              Today
            </Button>
            <Button
              variant={selectedDateRange === "yesterday" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedDateRange("yesterday")
                setPage(0)
              }}
            >
              Yesterday
            </Button>
            <Button
              variant={selectedDateRange === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedDateRange("week")
                setPage(0)
              }}
            >
              Last 7 days
            </Button>
          </div>

          {/* Custom date picker */}
          <div className="min-w-[150px]">
            <Input
              type="date"
              value={customDate}
              onChange={(e) => {
                setCustomDate(e.target.value)
                setSelectedDateRange("custom")
                setPage(0)
              }}
              className="w-full bg-white border border-slate-200 hover:border-blue-300 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Refresh button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !hasData ? (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2 text-slate-700">No analytics available</h3>
            <p className="text-sm text-slate-600">
              Try selecting another date or branch to view analytics data.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <KpiCard
            label="No-show Rate"
            value={`${kpis!.noShowRate}%`}
            subtext={`${kpis!.noShowCount} of ${kpis!.totalAppointments} appointments`}
            tooltip="Percentage of patients who had a confirmed appointment but did not arrive."
            icon={TrendingDown}
            variant="warning"
          />
          <KpiCard
            label="Follow-up Rate"
            value={`${kpis!.followUpRate}%`}
            subtext={`${kpis!.followedUpCount} of ${kpis!.scheduledPatients} patients followed up`}
            tooltip="Percentage of patients scheduled for tomorrow or today for whom we have attempted a follow-up."
            icon={Users}
            variant="success"
          />
          <KpiCard
            label="Followed-up by Call"
            value={kpis!.callFollowUpCount}
            subtext="patients called"
            tooltip="Number of patients for whom staff has already done a follow-up via phone call."
            icon={Phone}
            variant="default"
          />
          <KpiCard
            label="Message Response Rate"
            value={`${kpis!.messageResponseRate}%`}
            subtext={`${kpis!.messageResponseCount} of ${kpis!.messagesReceived} responded`}
            tooltip="Among patients who received reminder messages, percentage who replied with confirmation."
            icon={MessageSquare}
            variant="success"
          />
          <KpiCard
            label="Auto-scheduling Rate"
            value={`${kpis!.autoSchedulingRate}%`}
            subtext={`${kpis!.whatsappBookings} of ${kpis!.totalBookings} bookings via WhatsApp`}
            tooltip="Percentage of total confirmed bookings that were scheduled via the WhatsApp flow."
            icon={BarChart3}
            variant="success"
          />
          <KpiCard
            label="Follow-up to Arrival Rate"
            value={`${kpis!.followUpToArrivalRate}%`}
            subtext="Arrivals after follow-up"
            tooltip="Among patients who were followed up, percentage who actually arrived at the clinic."
            icon={TrendingUp}
            variant="success"
          />
        </div>
      )}

      {/* Performance Breakdown Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-slate-900">Performance Breakdown</h2>

        {/* Detail Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
          {isLoading ? (
            <div className="p-8 text-center">
              <Skeleton className="h-64 w-full" />
            </div>
          ) : tableData.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-600">No data available for this date range.</p>
            </div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                    <tr className="bg-linear-to-r from-slate-50 to-slate-100/50 border-b border-slate-200">
                    <th className="px-5 py-4 text-left font-semibold text-slate-700">Date</th>
                    <th className="px-5 py-4 text-right font-semibold text-slate-700">
                      Total Appointments
                    </th>
                    <th className="px-5 py-4 text-right font-semibold text-slate-700">
                      Confirmed via WhatsApp
                    </th>
                    <th className="px-5 py-4 text-right font-semibold text-slate-700">
                      No-shows
                    </th>
                    <th className="px-5 py-4 text-right font-semibold text-slate-700">
                      Followed-up
                    </th>
                    <th className="px-5 py-4 text-right font-semibold text-slate-700">
                      Message "Yes"
                    </th>
                    <th className="px-5 py-4 text-right font-semibold text-slate-700">
                      Arrivals After FU
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-200/80 hover:bg-blue-50/30 transition-all duration-200"
                    >
                      <td className="px-5 py-4 text-slate-900 font-medium">{row.date}</td>
                      <td className="px-5 py-4 text-right text-slate-900">
                        {row.totalAppointments}
                      </td>
                      <td className="px-5 py-4 text-right text-slate-900">
                        {row.whatsappBookings}
                      </td>
                      <td className="px-5 py-4 text-right text-amber-700">
                        {row.noShows}
                      </td>
                      <td className="px-5 py-4 text-right text-slate-900">
                        {row.followedUp}
                      </td>
                      <td className="px-5 py-4 text-right text-slate-900">
                        {row.messageYes}
                      </td>
                      <td className="px-5 py-4 text-right text-slate-900">
                        {row.arrivalsAfterFollowUp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">Rows per page:</span>
                    <Select
                      value={rowsPerPage.toString()}
                      onValueChange={(value) => {
                        setRowsPerPage(Number.parseInt(value, 10))
                        setPage(0)
                      }}
                    >
                      <SelectTrigger className="bg-white border border-slate-200 hover:border-blue-300 focus:ring-2 focus:ring-blue-500/20 w-20 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="7">7</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">
                      {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, tableData.length)} of {tableData.length}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// KPI Card Component
interface KpiCardProps {
  label: string
  value: string | number
  subtext: string
  tooltip: string
  icon: React.ComponentType<{ className?: string }>
  variant?: "default" | "success" | "warning" | "error"
}

function KpiCard({ label, value, subtext, tooltip, icon: Icon, variant = "default" }: KpiCardProps) {
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
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`${colors.bg} rounded-xl p-6 shadow-md hover:shadow-lg border border-slate-200/50 transition-all duration-200 hover:scale-[1.02] cursor-help`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-2">
                <p className="text-xs uppercase tracking-wide font-medium text-slate-600">{label}</p>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className={`text-3xl font-bold ${colors.text} mb-1`}>{value}</p>
              <p className="text-xs text-slate-500 mt-1">{subtext}</p>
            </div>
            <div className={`${colors.icon} bg-white/60 rounded-lg p-2.5`}>
              <Icon className={`w-6 h-6 ${colors.icon}`} />
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}

