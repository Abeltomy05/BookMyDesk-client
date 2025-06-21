import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import toast from "react-hot-toast"

interface RejectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reason: string) => Promise<void>
  title: string
  description?: string
  predefinedReasons: string[]
  isSubmitting?: boolean
}

export default function RejectionModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  description = "Please select a reason for rejection:",
  predefinedReasons,
  isSubmitting = false
}: RejectionModalProps) {
  const [selectedReason, setSelectedReason] = useState("")
  const [customReason, setCustomReason] = useState("")

  const handleSubmit = async () => {
    const reason = selectedReason === "other" ? customReason : selectedReason
    
    if (!reason.trim()) {
      toast.error("Please select or enter a reason for rejection")
      return
    }

    try {
      await onSubmit(reason)
      setSelectedReason("")
      setCustomReason("")
    } catch (error) {
      console.error("Rejection submission failed:", error)
    }
  }

  const handleClose = () => {
    if (isSubmitting) return
    setSelectedReason("")
    setCustomReason("")
    onClose()
  }

  const isSubmitDisabled = isSubmitting || (!selectedReason || (selectedReason === "other" && !customReason.trim()))

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-[#f69938]">{title}</h3>
              <button 
                onClick={handleClose} 
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                disabled={isSubmitting}
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 mb-4">{description}</p>
              
              {/* Predefined Reasons */}
              <div className="space-y-3 mb-4">
                {predefinedReasons.map((reason, index) => (
                  <label key={index} className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="rejectReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="mt-1 w-4 h-4 text-[#f69938] bg-gray-800 border-gray-600 focus:ring-[#f69938] focus:ring-2"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {reason}
                    </span>
                  </label>
                ))}
                
                {/* Other Reason Option */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="rejectReason"
                    value="other"
                    checked={selectedReason === "other"}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="mt-1 w-4 h-4 text-[#f69938] bg-gray-800 border-gray-600 focus:ring-[#f69938] focus:ring-2"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    Other (specify below)
                  </span>
                </label>
              </div>

              {/* Custom Reason Textarea */}
              {selectedReason === "other" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Please specify the reason for rejection..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:border-transparent resize-none"
                    rows={3}
                    disabled={isSubmitting}
                  />
                </motion.div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors text-sm"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-md transition-colors text-sm flex items-center gap-2"
              >
                {isSubmitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {isSubmitting ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}