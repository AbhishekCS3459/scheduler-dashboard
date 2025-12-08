export type UserRole = "super_admin" | "branch_admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  branchId?: string // Only for branch_admin, undefined for super_admin
}

export interface Branch {
  id: string
  name: string
  city: string
  openingHours: OpeningHours
}

export interface Staff {
  id: string
  name: string
  gender: "M" | "F"
  role: "Therapist" | "Nutritionist" | "Coach"
  phone: string
  sessionTypes: string[]
  availability: Availability
  branchId: string // Link staff to a branch
}

export interface Availability {
  [date: string]: {
    available: boolean
    startTime?: string
    endTime?: string
  }
}

export interface OpeningHours {
  [day: string]: {
    isOpen: boolean
    startTime: string
    endTime: string
  }
}

export interface Session {
  id: string
  patientName: string
  patientId: string
  phone: string
  therapyType: string
  staffId: string
  branchId: string // Link session to a branch
  date: string
  startTime: string
  endTime: string
  status: "Planned" | "Completed" | "No-show" | "Conflict"
  whatsappStatus: "Confirmed" | "No response" | "Cancelled"
  notes?: string
}

export interface SessionType {
  id: string
  name: string
  durationMinutes: number
}
