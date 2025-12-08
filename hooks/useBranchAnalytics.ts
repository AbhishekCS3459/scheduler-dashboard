"use client"

import { useEffect, useState } from "react"

export interface BranchAnalyticsKpi {
  noShowRate: number
  noShowCount: number
  totalAppointments: number
  followUpRate: number
  followedUpCount: number
  scheduledPatients: number
  callFollowUpCount: number
  messageResponseRate: number
  messageResponseCount: number
  messagesReceived: number
  autoSchedulingRate: number
  whatsappBookings: number
  totalBookings: number
  followUpToArrivalRate: number
}

export interface DailyAnalyticsRow {
  date: string
  totalAppointments: number
  whatsappBookings: number
  noShows: number
  followedUp: number
  messageYes: number
  arrivalsAfterFollowUp: number
}

const mockKpis: BranchAnalyticsKpi = {
  noShowRate: 15,
  noShowCount: 3,
  totalAppointments: 20,
  followUpRate: 92,
  followedUpCount: 45,
  scheduledPatients: 49,
  callFollowUpCount: 12,
  messageResponseRate: 88,
  messageResponseCount: 35,
  messagesReceived: 40,
  autoSchedulingRate: 76,
  whatsappBookings: 19,
  totalBookings: 25,
  followUpToArrivalRate: 84,
}

const mockTableData: DailyAnalyticsRow[] = [
  {
    date: "2024-12-08",
    totalAppointments: 20,
    whatsappBookings: 15,
    noShows: 3,
    followedUp: 18,
    messageYes: 16,
    arrivalsAfterFollowUp: 15,
  },
  {
    date: "2024-12-07",
    totalAppointments: 18,
    whatsappBookings: 13,
    noShows: 2,
    followedUp: 16,
    messageYes: 14,
    arrivalsAfterFollowUp: 14,
  },
  {
    date: "2024-12-06",
    totalAppointments: 22,
    whatsappBookings: 17,
    noShows: 4,
    followedUp: 19,
    messageYes: 17,
    arrivalsAfterFollowUp: 16,
  },
  {
    date: "2024-12-05",
    totalAppointments: 19,
    whatsappBookings: 14,
    noShows: 2,
    followedUp: 17,
    messageYes: 15,
    arrivalsAfterFollowUp: 15,
  },
  {
    date: "2024-12-04",
    totalAppointments: 21,
    whatsappBookings: 16,
    noShows: 3,
    followedUp: 18,
    messageYes: 16,
    arrivalsAfterFollowUp: 15,
  },
  {
    date: "2024-12-03",
    totalAppointments: 17,
    whatsappBookings: 12,
    noShows: 2,
    followedUp: 15,
    messageYes: 13,
    arrivalsAfterFollowUp: 13,
  },
  {
    date: "2024-12-02",
    totalAppointments: 20,
    whatsappBookings: 15,
    noShows: 3,
    followedUp: 17,
    messageYes: 15,
    arrivalsAfterFollowUp: 14,
  },
]

export function useBranchAnalytics(
  branchId: string,
  dateRange: string,
  customDate: string,
): {
  kpis: BranchAnalyticsKpi | null
  tableData: DailyAnalyticsRow[]
  isLoading: boolean
} {
  const [isLoading, setIsLoading] = useState(false)

  // Simulate API call
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [branchId, dateRange, customDate])

  // Mock: Return empty state for demo if needed
  if (branchId === "westside" && dateRange === "yesterday") {
    return {
      kpis: null,
      tableData: [],
      isLoading: false,
    }
  }

  return {
    kpis: mockKpis,
    tableData: mockTableData,
    isLoading,
  }
}

