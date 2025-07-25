import type React from "react"
import { useEffect, useState } from "react"
import { StatusTracker } from "@/components/BookingDetailsComponents/StatusTracker" 
import { BookingDetails } from "@/components/BookingDetailsComponents/BookingDetails" 
import type { BookingData } from "@/types/booking.type" 
import { clientService } from "@/services/clientServices"
import { useParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import StripePaymentModal from "@/components/ReusableComponents/StripeModal"
import CancelBookingModal from "@/components/BookingDetailsComponents/CancelConfirmModal"
import { getErrorMessage } from "@/utils/errors/errorHandler"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"


export const BookingDetailsPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [chatLoading, setChatLoading] = useState(false);

  const user = useSelector((state: RootState) => state.client.client);
  
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
      setShowCancelModal(true)
  }

   const handleConfirmCancel = async (reason: string) => {
    if (!bookingId) return;
    
    setCancelLoading(true);
    try {
      const cancelResponse = await clientService.cancelBooking(bookingId, reason);
      if(!cancelResponse.success) {
        toast.error(cancelResponse.message || "Failed to cancel booking. Please try again.");
        return;
      }
      toast.success("Booking cancelled successfully and money refunded to your wallet.");
      setShowCancelModal(false);
      
      const response = await clientService.getBookingDetails(bookingId);
      setBooking(response.data);
    } catch (error:unknown) {
      console.error("Error cancelling booking:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setCancelLoading(false);
    }
  };

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

 const handleDownloadInvoice = async() => {
  if (!booking || !booking._id) {
    toast.error('Booking information is incomplete.');
    return;
  }
   try {
    const result = await clientService.handleDownloadInvoice(booking, {
      username: user?.username,
      email: user?.email,
      location: user?.location?.name,
    });

    if (!result.success) {
      toast.error("Something went wrong, Please try again.");
      return;
    }

    toast.success('Invoice downloaded successfully!');
  } catch (error) {
    console.error("Invoice download failed:", error);
    toast.error("Failed to generate invoice. Please try again.");
  }
}

  const handleGoBack = () => {
    navigate(-1) 
  }

  const handleChatWithVendor = async () => {
    if (!booking) return;
   setChatLoading(true);
  
  try {
    const response = await clientService.createSession({
      buildingId: booking.buildingId,
    })
    if (!response.success) {
      throw new Error('Failed to create chat session');
    }
    navigate(`/chat?sessionId=${response.data.sessionId}`)
  }catch(error){
    console.error('Error creating chat session:', error);
  } 
  finally {
    setChatLoading(false);
  }
};

   if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          Loading booking details...
        </div>
    )
  }

   if (!booking) {
    return (
        <div className="min-h-screen flex items-center justify-center text-red-600">
          Booking not found.
        </div>
    )
  }

return (
  <>
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

             {booking.cancelledBy === 'vendor' && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                            <h3 className="text-sm font-semibold text-red-800 mb-1">Cancelled by Vendor</h3>
                            <p className="text-sm text-red-700">
                                <span className="font-medium">Reason:</span> {booking.cancellationReason || 'No reason provided'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <StatusTracker status={booking.status} />

            {/* Action Buttons  */}
            <div className="flex justify-end mb-4">
                <div className="flex gap-2">
                    {/* Chat with Vendor Button - Available for active bookings */}
                    {(booking.status === 'confirmed') && (
                        <button
                            onClick={handleChatWithVendor}
                            disabled={chatLoading}
                            className="px-3 py-1.5 text-xs font-medium text-[#f69938] bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {chatLoading ? (
                                <div className="w-3 h-3 border border-[#f69938] border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            )}
                            Chat with Vendor
                        </button>
                    )}

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
            discountAmount: booking.discountAmount ?? 0,
            pricePerDay: booking.space?.pricePerDay ?? 0, 
            bookingId: booking._id ,
          }}
        />
      )}

        {/* Cancel Booking Modal */}
        <CancelBookingModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleConfirmCancel}
          loading={cancelLoading}
        />

</>
)
}

export default BookingDetailsPage