"use client"

import { formatDistanceToNow } from "date-fns"
import { Download, Eye } from "lucide-react"
import { useState } from "react"

interface PublishRecord {
  id: string
  templateName: string
  publishedOn: Date
  numberOfPatients: number
  cohortTag: string
  status: "completed" | "scheduled" | "failed"
  patientData?: Array<{
    id: string
    name: string
    reportLink: string
  }>
}

const samplePublishHistory: PublishRecord[] = [
  {
    id: "1",
    templateName: "Monthly Progress – Standard",
    publishedOn: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    numberOfPatients: 24,
    cohortTag: "Premium Plan",
    status: "completed",
    patientData: [
      { id: "P001", name: "Arun Kumar", reportLink: "https://reports.vecura.com/arun-kumar-001" },
      { id: "P002", name: "Priya Singh", reportLink: "https://reports.vecura.com/priya-singh-002" },
      { id: "P003", name: "Rajesh Patel", reportLink: "https://reports.vecura.com/rajesh-patel-003" },
    ],
  },
  {
    id: "2",
    templateName: "Cryo360 Upsell Focus",
    publishedOn: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    numberOfPatients: 18,
    cohortTag: "Low Attendance",
    status: "completed",
    patientData: [
      { id: "P004", name: "Deepa Sharma", reportLink: "https://reports.vecura.com/deepa-sharma-004" },
      { id: "P005", name: "Vikas Gupta", reportLink: "https://reports.vecura.com/vikas-gupta-005" },
    ],
  },
  {
    id: "3",
    templateName: "New Year Motivation",
    publishedOn: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    numberOfPatients: 42,
    cohortTag: "First Month",
    status: "completed",
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-50 text-green-700 border border-green-200"
    case "scheduled":
      return "bg-blue-50 text-blue-700 border border-blue-200"
    case "failed":
      return "bg-red-50 text-red-700 border border-red-200"
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200"
  }
}

export function HistoryView() {
  const [selectedRecord, setSelectedRecord] = useState<PublishRecord | null>(null)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-[#E5E7EB] bg-white p-8">
        <h1 className="text-4xl font-bold text-foreground tracking-tight">Publishing History</h1>
        <p className="text-sm text-muted-foreground mt-2">View all template publishes, status, and patient reports.</p>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F7F9FC] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  Template Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  Published
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  Patients
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  Cohort
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {samplePublishHistory.map((record) => (
                <tr key={record.id} className="hover:bg-[#F7F9FC] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-foreground text-sm">{record.templateName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(record.publishedOn), { addSuffix: true })}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-3 py-1 bg-[#F7F9FC] text-foreground rounded-full text-xs font-bold">
                      {record.numberOfPatients}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-[#F7F9FC] text-foreground rounded-full text-xs font-medium">
                      {record.cohortTag}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize inline-block ${getStatusColor(record.status)}`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="flex items-center gap-1 ml-auto text-[#00B8B0] hover:text-[#009B93] font-semibold text-sm transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full md:w-2xl rounded-t-2xl p-6 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedRecord.templateName}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Published {formatDistanceToNow(new Date(selectedRecord.publishedOn), { addSuffix: true })}
                </p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-muted-foreground hover:text-foreground text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#F7F9FC] rounded-lg p-4">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Patients Reached</p>
                  <p className="text-2xl font-bold text-foreground">{selectedRecord.numberOfPatients}</p>
                </div>
                <div className="bg-[#F7F9FC] rounded-lg p-4">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Status</p>
                  <p
                    className={`font-bold capitalize ${selectedRecord.status === "completed" ? "text-green-700" : selectedRecord.status === "scheduled" ? "text-blue-700" : "text-red-700"}`}
                  >
                    {selectedRecord.status}
                  </p>
                </div>
                <div className="bg-[#F7F9FC] rounded-lg p-4">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Cohort</p>
                  <p className="font-bold text-foreground">{selectedRecord.cohortTag}</p>
                </div>
              </div>

              {/* Patient Data Table */}
              {selectedRecord.patientData && selectedRecord.patientData.length > 0 && (
                <div>
                  <h3 className="font-bold text-foreground mb-3 text-sm uppercase">
                    Patient Reports
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-[#F7F9FC] border-b border-[#E5E7EB]">
                        <tr>
                          <th className="px-4 py-2 text-left font-bold text-muted-foreground text-xs">Patient ID</th>
                          <th className="px-4 py-2 text-left font-bold text-muted-foreground text-xs">Patient Name</th>
                          <th className="px-4 py-2 text-left font-bold text-muted-foreground text-xs">Report Link</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E7EB]">
                        {selectedRecord.patientData.map((patient) => (
                          <tr key={patient.id} className="hover:bg-[#F7F9FC]">
                            <td className="px-4 py-2 font-mono text-foreground text-xs">{patient.id}</td>
                            <td className="px-4 py-2 text-foreground text-xs font-medium">{patient.name}</td>
                            <td className="px-4 py-2">
                              <a
                                href={patient.reportLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#00B8B0] hover:underline text-xs font-medium flex items-center gap-1"
                              >
                                View Report
                                <span>→</span>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="flex-1 px-4 py-2 rounded-lg bg-[#F7F9FC] text-foreground font-medium hover:bg-[#E5E7EB] transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#E5E7EB] text-foreground font-medium hover:bg-[#F7F9FC] transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
