import { useState } from "react"
import { X, Wallet, CheckCircle, AlertCircle } from "lucide-react"
import { clientService } from "@/services/clientServices"
import toast from "react-hot-toast"

interface BookingData {
  spaceId: string
  spaceName: string
  location: string
  bookingDate: Date
  numberOfDesks: number
  totalAmount: number
  pricePerDay: number
}

interface WalletPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (bookingId: string) => void
  bookingData: BookingData
  walletBalance?: number 
}

const WalletPaymentModal: React.FC<WalletPaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  bookingData,
  walletBalance = 0 
}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')

  if (!isOpen) return null

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatLocation = (location: string): string => {
    const parts = location.split(",").map((p) => p.trim())
    if (parts.length <= 4) return location
    return `${parts[0]}, ${parts[1]}, ${parts[parts.length - 2]}, ${parts[parts.length - 1]}`
  }

  const hasInsufficientFunds = walletBalance < bookingData.totalAmount

  const handlePayment = async () => {
    if (hasInsufficientFunds) return

    setIsProcessing(true)
    setPaymentStatus('processing')

    try {
     
      const response = await clientService.payWithWallet({
        spaceId: bookingData.spaceId,
        bookingDate: bookingData.bookingDate,
        numberOfDesks: bookingData.numberOfDesks,
        totalPrice: bookingData.totalAmount
      })

      if(response.success){
        toast.success(response.message || "Booking Successfull.")
        setPaymentStatus('success')
         setTimeout(() => {
          onSuccess(response.data)
        }, 1500)
      }else{
        setPaymentStatus('error')
        setIsProcessing(false)
        toast.error(response.message || "Booking UnSuccessfull.")
        onClose()
      }
      

    } catch (error) {
      console.error('Wallet payment failed:', error)
      setPaymentStatus('error')
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4 mt-7">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#f69938" }}
            >
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-black">Wallet Payment</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isProcessing}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Wallet Balance */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Available Balance</span>
              <span className="text-lg font-semibold text-black">₹{walletBalance.toLocaleString()}</span>
            </div>
            {hasInsufficientFunds && (
              <div className="flex items-center mt-2 text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">Insufficient wallet balance</span>
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-black mb-4">Booking Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Space:</span>
                <span className="text-black font-medium">{bookingData.spaceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="text-black">{formatLocation(bookingData.location)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="text-black">{formatDate(bookingData.bookingDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">No. of Desks:</span>
                <span className="text-black">{bookingData.numberOfDesks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price per desk:</span>
                <span className="text-black">₹{bookingData.pricePerDay}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-black">Total Amount:</span>
                  <span className="text-black">₹{bookingData.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          {paymentStatus === 'processing' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-blue-800 text-sm">Processing your payment...</span>
              </div>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-green-800 text-sm">Payment successful! Redirecting...</span>
              </div>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <span className="text-red-800 text-sm">Payment failed. Please try again.</span>
              </div>
            </div>
          )}

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={hasInsufficientFunds || isProcessing || paymentStatus === 'success'}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
              hasInsufficientFunds || isProcessing || paymentStatus === 'success'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'hover:opacity-90'
            }`}
            style={{ 
              backgroundColor: hasInsufficientFunds || isProcessing || paymentStatus === 'success' 
                ? '#9CA3AF' 
                : '#f69938' 
            }}
          >
            {isProcessing ? 'Processing...' : 
             paymentStatus === 'success' ? 'Payment Successful' :
             hasInsufficientFunds ? 'Insufficient Balance' : 
             `Pay ₹${bookingData.totalAmount}`}
          </button>

          {hasInsufficientFunds && (
            <p className="text-sm text-gray-500 text-center mt-3">
              Please add ₹{(bookingData.totalAmount - walletBalance).toLocaleString()} to your wallet to complete this booking.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default WalletPaymentModal