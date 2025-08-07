"use client"

import { motion } from "framer-motion"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function Loading() {
  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-center items-center min-h-[50vh]">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <LoadingSpinner />
          <motion.p 
            className="mt-4 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            Loading movies...
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  )
}
