import type React from "react"
import { useEffect, useState } from "react"
import { StatusTracker } from "@/components/BookingDetailsComponents/StatusTracker" 
import { BookingDetails } from "@/components/BookingDetailsComponents/BookingDetails" 
import type { BookingData } from "@/types/booking.type" 
import ClientLayout from "../ClientLayout"
import { clientService } from "@/services/clientServices"
import { useParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import StripePaymentModal from "@/components/ReusableComponents/StripeModal"

export const BookingDetailsPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  
  useEffect(()=>{
    const fetchBookingDetails = async () => {
        try {
             if (!bookingId) return
            const response = await clientService.getBookingDetails(bookingId);
            console.log("Booking details fetched:", response.data)
            setBooking(response.data)
        } catch (error) {
            console.error("Error fetching booking details:", error)
            toast.error("Failed to fetch booking details. Please try again later.")
        }finally{
          setLoading(false)  
        }
    }
    fetchBookingDetails()
  },[bookingId])
  
  const handleCancelBooking = () => {
    console.log("Cancelling booking...")
    setBooking((prev) => prev ? { ...prev, status: "cancelled" } : null)
  }

  const handleRetryBooking = () => {
      setShowPaymentModal(true)
  }

  const handleRetrySuccess = (bookingId: string) => {
  setShowPaymentModal(false)
  const fetchBookingDetails = async () => {
    try {
      if (!bookingId) return
      const response = await clientService.getBookingDetails(bookingId);
      setBooking(response.data)
      // toast.success("Payment successful! Your booking has been confirmed.")
    } catch (error) {
      console.error("Error fetching booking details:", error)
    }
  }
  fetchBookingDetails()
}

  const handleDownloadInvoice = () => {
    console.log("Downloading invoice...")
  }

  const handleGoBack = () => {
    navigate(-1) 
  }

   if (loading) {
    return (
      <ClientLayout>
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          Loading booking details...
        </div>
      </ClientLayout>
    )
  }

   if (!booking) {
    return (
      <ClientLayout>
        <div className="min-h-screen flex items-center justify-center text-red-600">
          Booking not found.
        </div>
      </ClientLayout>
    )
  }

return (
    <ClientLayout>
        <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">

            <div className="relative flex items-center justify-center mb-8">
                {/* Back Button - Left Side */}
                <button
                    onClick={handleGoBack}
                    className="absolute left-0 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                    <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M15 19l-7-7 7-7" 
                        />
                    </svg>
                    <span className="font-medium">Go Back</span>
                </button>
                
                {/* Centered Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-[#f69938] mb-2">Booking for {booking.space?.name}</h1>
                    <p className="text-gray-600">Track your booking status and manage your reservation</p>
                </div>
            </div>

            <StatusTracker status={booking.status} />

            {/* Action Buttons  */}
            <div className="flex justify-end mb-4">
                <div className="flex gap-2">
                    {booking.status === 'confirmed' && (
                        <button
                            onClick={handleCancelBooking}
                            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors duration-200"
                        >
                            Cancel Booking
                        </button>
                    )}
                    
                    {(booking.status === 'cancelled' || booking.status === 'failed') && (
                        <button
                            onClick={handleRetryBooking}
                            className="px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors duration-200 flex items-center gap-1"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Retry Booking
                        </button>
                    )}
                    
                    {booking.status === 'completed' && (
                        <button
                            onClick={handleDownloadInvoice}
                            className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors duration-200 flex items-center gap-1"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Invoice
                        </button>
                    )}
                </div>
            </div>

            <BookingDetails booking={booking} />
        </div>
        </div>

        {showPaymentModal && booking && (
        <StripePaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handleRetrySuccess}
          bookingData={{
            spaceId: booking.spaceId,
            spaceName: booking.space?.name ?? "Unknown Space",
            location: booking.building?.location?.displayName ?? "Unknown Location",
            bookingDate: new Date(booking.bookingDate),
            numberOfDesks: booking.numberOfDesks ?? 1,
            totalAmount: booking.totalPrice ?? 0,
            pricePerDay: booking.space?.pricePerDay ?? 0, 
            bookingId: booking._id ,
          }}
        />
      )}
    </ClientLayout>
)
}

export default BookingDetailsPage