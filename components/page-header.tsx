"use client"
import { format } from "date-fns"
import { motion } from "framer-motion"

interface PageHeaderProps {
  pageName: string
  pageSubtext?: string
}

export function PageHeader({ pageName, pageSubtext }: PageHeaderProps) {
  const today = new Date()
  const formattedDate = format(today, "PPP")

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between border-b border-slate-200/80 pb-6 mb-6"
    >
      <div className="flex-1">
        <div className="flex items-center gap-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-semibold text-slate-900"
            >
              {pageName}
            </motion.h1>
            {pageSubtext && (
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-slate-500 mt-1"
              >
                {pageSubtext}
              </motion.p>
            )}
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="text-right"
      >
        <p className="text-sm font-medium text-slate-600">Today: {formattedDate}</p>
      </motion.div>
    </motion.div>
  )
}
