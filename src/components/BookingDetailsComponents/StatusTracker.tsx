import type React from "react"
import { useEffect, useState } from "react"
import type { BookingStatus } from "@/types/booking.type"

interface StatusTrackerProps {
  status: BookingStatus
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({ status }) => {
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!animationComplete) {
    return (
      <div className="w-full max-w-4xl mx-auto mb-4">
        <div className="flex items-center justify-center h-16">
          <div className="animate-pulse bg-gray-300 w-full h-1 rounded-full" />
        </div>
      </div>
    )
  }

  const isStepActive = (step: number) => {
    if (status === "cancelled") return step <= 1
    if (status === "confirmed") return step <= 2
    if (status === "completed") return step <= 3
    if (status === "failed") return step <= 2
    return false
  }

  const isStepCompleted = (step: number) => {
    if (status === "cancelled") return step === 1
    if (status === "confirmed") return step < 2
    if (status === "completed") return step < 3
    if (status === "failed") return step < 2
    return false
  }

  const getStepIcon = (step: number) => {
    const baseClasses = "w-8 h-8 flex items-center justify-center text-white text-sm font-medium"
    
    if (isStepCompleted(step)) {
      return (
        <div className={`${baseClasses} bg-green-500 rounded-full`}>
          ✓
        </div>
      )
    }
    
    if (isStepActive(step)) {
      if (status === "cancelled" && step === 1) {
        return <div className={`${baseClasses} bg-red-500 rounded-full`}>✗</div>
      }
      if (status === "failed" && step === 2) {
        return <div className={`${baseClasses} bg-red-500 rounded-full`}>✗</div>
      }
      return <div className={`${baseClasses} bg-[#f69938] rounded-full`}>{step}</div>
    }
    
    return <div className={`${baseClasses} bg-gray-300 rounded-full border-2 border-gray-400`}>{step}</div>
  }

  const getLineClasses = (lineNumber: number) => {
    const baseClasses = "flex-1 h-1 mx-4 rounded-full"
    
    if (lineNumber === 1) {
      if (status === "cancelled") {
        return `${baseClasses} bg-red-500`
      }
      if (status === "confirmed" || status === "completed" || status === "failed") {
        return `${baseClasses} bg-green-500`
      }
    }
    
    if (lineNumber === 2) {
      if (status === "completed") {
        return `${baseClasses} bg-green-500`
      }
      if (status === "failed") {
        return `${baseClasses} bg-red-500`
      }
    }
    
    return `${baseClasses} bg-gray-300`
  }

  const getStepLabel = (step: number) => {
    switch (step) {
      case 1:
        return status === "cancelled" ? "Cancelled" : "Order Placed"
      case 2:
        return status === "failed" ? "Failed" : "Confirmed"
      case 3:
        return "Completed"
      default:
        return ""
    }
  }

  const getStepSubtext = (step: number) => {
    switch (step) {
      case 1:
        return status === "cancelled" ? "Order was cancelled" : "We have received your order"
      case 2:
        return status === "failed" ? "Order processing failed" : "Your booking is confirmed"
      case 3:
        return "Service completed"
      default:
        return ""
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-4">
      {/* Progress Line and Steps */}
      <div className="relative flex items-center justify-between mb-8">
        {/* Step 1 */}
        <div className="flex flex-col items-center z-10">
          {getStepIcon(1)}
        </div>

        {/* Line 1 */}
        <div className={getLineClasses(1)} />

        {/* Step 2 */}
        <div className="flex flex-col items-center z-10">
          {getStepIcon(2)}
        </div>

        {/* Line 2 */}
        <div className={getLineClasses(2)} />

        {/* Step 3 */}
        <div className="flex flex-col items-center z-10">
          {getStepIcon(3)}
        </div>
      </div>

      {/* Step Labels */}
      <div className="flex justify-between">
        <div className="flex flex-col items-center text-center flex-1">
          <h3 className={`font-semibold text-lg ${
            isStepActive(1) || isStepCompleted(1) 
              ? status === "cancelled" ? "text-red-600" : "text-green-600"
              : "text-gray-500"
          }`}>
            {getStepLabel(1)}
          </h3>
          <p className="text-sm text-gray-500 mt-1 max-w-32">
            {getStepSubtext(1)}
          </p>
        </div>

        <div className="flex flex-col items-center text-center flex-1">
          <h3 className={`font-semibold text-lg ${
            isStepActive(2) || isStepCompleted(2)
              ? status === "failed" ? "text-red-600" : "text-green-600"
              : "text-gray-500"
          }`}>
            {getStepLabel(2)}
          </h3>
          <p className="text-sm text-gray-500 mt-1 max-w-32">
            {getStepSubtext(2)}
          </p>
        </div>

        <div className="flex flex-col items-center text-center flex-1">
          <h3 className={`font-semibold text-lg ${
            isStepActive(3) || isStepCompleted(3) ? "text-green-600" : "text-gray-500"
          }`}>
            {getStepLabel(3)}
          </h3>
          <p className="text-sm text-gray-500 mt-1 max-w-32">
            {getStepSubtext(3)}
          </p>
        </div>
      </div>
    </div>
  )
}