"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { SessionType } from "@/lib/types"
import React from "react"

interface AddStaffModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: { name: string; gender: "M" | "F"; sessionTypes: string[] }) => void
  sessionTypes: SessionType[]
}

export function AddStaffModal({ isOpen, onClose, onConfirm, sessionTypes }: AddStaffModalProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    gender: "M" as "M" | "F",
    selectedSessionTypes: [] as string[],
  })

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("Please enter staff name")
      return
    }
    if (formData.selectedSessionTypes.length === 0) {
      alert("Please select at least one session type")
      return
    }
    onConfirm({
      name: formData.name.trim(),
      gender: formData.gender,
      sessionTypes: formData.selectedSessionTypes,
    })
    // Reset form
    setFormData({
      name: "",
      gender: "M",
      selectedSessionTypes: [],
    })
    onClose()
  }

  const handleSessionTypeToggle = (sessionTypeId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedSessionTypes: prev.selectedSessionTypes.includes(sessionTypeId)
        ? prev.selectedSessionTypes.filter((id) => id !== sessionTypeId)
        : [...prev.selectedSessionTypes, sessionTypeId],
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Staff</DialogTitle>
          <DialogDescription>Add a new staff member to the system with their details and session types.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-slate-700">Staff Name *</Label>
            <Input
              id="name"
              placeholder="Enter staff name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          {/* Gender */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700">Gender *</Label>
            <RadioGroup
              value={formData.gender}
              onValueChange={(value) => setFormData({ ...formData, gender: value as "M" | "F" })}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="M" id="male" />
                <Label htmlFor="male" className="font-normal cursor-pointer text-slate-700">
                  Male
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="F" id="female" />
                <Label htmlFor="female" className="font-normal cursor-pointer text-slate-700">
                  Female
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Session Types */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700">Session Types *</Label>
            <div className="space-y-2 border border-slate-200 rounded-lg p-4 max-h-48 overflow-y-auto bg-slate-50/50">
              {sessionTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-white transition-colors">
                  <Checkbox
                    id={type.id}
                    checked={formData.selectedSessionTypes.includes(type.id)}
                    onCheckedChange={() => handleSessionTypeToggle(type.id)}
                  />
                  <Label htmlFor={type.id} className="font-normal cursor-pointer flex-1 text-slate-700">
                    {type.name}
                  </Label>
                </div>
              ))}
            </div>
            {formData.selectedSessionTypes.length === 0 && (
              <p className="text-xs text-amber-600">Select at least one session type</p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose} className="hover:bg-slate-100">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30">
            Add Staff
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

