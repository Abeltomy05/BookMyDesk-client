import { useState } from "react"

interface OfferData {
  percentage: number
  title: string
  description: string
  startDate: string
  endDate: string
}

interface OfferBadgeProps {
  offer: OfferData
  className?: string
}

export default function OfferBadge({ offer, className = "" }: OfferBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Offer Badge */}
      <div className="relative">
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-200">
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold">{offer.percentage}%</span>
            <span className="text-xs font-medium">OFF</span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#ebff0c] rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#ebff0c] rounded-full animate-pulse delay-300"></div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-5000 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 relative">
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>

            {/* Tooltip Content */}
            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">{offer.title}</h3>
                <p className="text-gray-600 text-xs mt-1">{offer.description}</p>
              </div>

              <div className="border-t border-gray-100 pt-2">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Valid from:</span>
                  <span className="font-medium">{formatDate(offer.startDate)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                  <span>Valid until:</span>
                  <span className="font-medium">{formatDate(offer.endDate)}</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-md p-2 text-center">
                <span className="text-red-600 font-bold text-sm">{offer.percentage}% OFF</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
