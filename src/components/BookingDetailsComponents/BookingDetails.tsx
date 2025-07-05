import type React from "react"
import type { BookingData } from "@/types/booking.type" 
import { formatCurrency } from "../../utils/formatters/currency"
import { formatDate } from "@/utils/formatters/date"

interface BookingDetailsProps {
  booking: BookingData
}

export const BookingDetails: React.FC<BookingDetailsProps> = ({ booking }) => {

  const calculatePricePerDay = () => {
    return ((booking.totalPrice ?? 0) + (booking.discountAmount ?? 0)) / (booking.numberOfDesks || 1);
  }


return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">Booking Summary</h2>
        <div className="text-right">
          <p className="text-sm text-gray-500">Order Created</p>
          <p className="text-sm font-medium text-gray-700">{formatDate(booking.createdAt)}</p>
        </div>
      </div>

      {/* Booking Information Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-600 mb-1">Booking Date</p>
            <p className="text-gray-800 font-semibold">{formatDate(booking.bookingDate)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-600 mb-1">Number of Desks</p>
            <p className="text-gray-800 font-semibold">{booking.numberOfDesks || 0}</p>
          </div>
        </div>
      </div>

      {/* Location Details Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Location Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2">
            <span className="font-medium text-gray-600">Space:</span>
            <span className="text-gray-800 font-medium">{booking.space?.name || 'N/A'}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-medium text-gray-600">Building:</span>
            <span className="text-gray-800">{booking.building?.buildingName || 'N/A'}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-medium text-gray-600">Location:</span>
            <span className="text-gray-800">{booking.building?.location?.name || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
     <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing Breakdown</h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Price Per Day:</span>
            <span className="text-gray-800">{formatCurrency(calculatePricePerDay())}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Number of Desks:</span>
            <span className="text-gray-800">x {booking.numberOfDesks || 0}</span>
          </div>
          {booking.discountAmount && booking.discountAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-green-600 font-medium">Discount Applied:</span>
              <span className="text-green-600 font-medium">-{formatCurrency(booking.discountAmount)}</span>
            </div>
          )}
          <div className="border-t border-gray-300 pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
              <span className="text-xl font-bold text-[#f69938]">{formatCurrency(booking.totalPrice ?? 0)}</span>
            </div>
          </div>
        </div>
      </div>


      {/* Payment Information Section */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2">
            <span className="font-medium text-gray-600">Payment Method:</span>
            <span className="text-gray-800">{booking.paymentMethod || 'N/A'}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-medium text-gray-600">Transaction ID:</span>
            <span className="text-gray-800 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              {booking.transactionId || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
)
}