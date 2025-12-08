"use client"

import { useEffect } from "react"

interface ToastProps {
  message: string
  onClose: () => void
  duration?: number
}

export function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-lg px-6 py-4 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-blue-500" />
        <p className="text-foreground text-sm font-medium">{message}</p>
        <button onClick={onClose} className="ml-2 text-muted-foreground hover:text-foreground">
          ✕
        </button>
      </div>
    </div>
  )
}

