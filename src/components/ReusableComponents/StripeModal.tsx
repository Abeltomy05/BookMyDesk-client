import { useEffect, useState } from "react"
import { X, CreditCard, Lock, Loader2 } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { clientService } from "@/services/clientServices"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (bookingId: string) => void
  bookingData: {
    spaceId: string
    spaceName: string
    location: string
    bookingDate: Date
    numberOfDesks: number
    totalAmount: number
    pricePerDay: number
    bookingId?: string
  }
}

interface PaymentIntentResponse {
  clientSecret: string
  paymentIntentId: string
  publishableKey: string
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    invalid: {
      color: "#9e2146",
    },
  },
  hidePostalCode: true,
}

function PaymentForm({ 
  clientSecret,  
  paymentIntentId,
  bookingData, 
  onSuccess, 
  onError 
}: {
  clientSecret: string
  paymentIntentId: string
  bookingData: PaymentModalProps['bookingData']
  onSuccess: (bookingId: string) => void
  onError: (error: string) => void
}) {
  const user = useSelector((state: RootState) => state.client.client)
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardError, setCardError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setCardError(null)

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      setIsProcessing(false)
      return
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.username || 'Customer',
            email: user?.email || undefined,
          },
        },
      })

      if (error) {
        console.error("Payment failed:", error)
        setCardError(error.message || "Payment failed")
        toast.error(error.message || "Payment failed")
        onError(error.message || "Payment failed")
      } else if (paymentIntent.status === 'requires_capture') {
        try {
          const confirmResponse = await clientService.confirmPayment({
            paymentIntentId: paymentIntent.id,
          })
          console.log("Payment confirmed:", confirmResponse)

          if (confirmResponse.success) {
            toast.success("Payment successful! Your booking has been confirmed.")
            onSuccess(confirmResponse.data.bookingId)
          } else {
            toast.error(confirmResponse.message || "Payment processed but booking confirmation failed. Please contact support.")
            onError(confirmResponse.message || "Booking confirmation failed")
          }
        } catch (confirmError: any) {
          console.error("Confirmation error:", confirmError)
          toast.error("Payment processed but booking confirmation failed. Please contact support.")
          onError("Booking confirmation failed")
        }
      } else if (paymentIntent.status === 'succeeded') {
        toast.success("Payment successful!")
        onSuccess(paymentIntentId)
      } else {
        console.error("Unexpected payment status:", paymentIntent.status)
        toast.error("Payment completed but with unexpected status. Please contact support.")
        onError("Unexpected payment status")
      }
    } catch (error: any) {
      console.error("Payment error:", error)
      const errorMessage = error.message || "An unexpected error occurred"
      setCardError(errorMessage)
      toast.error(errorMessage)
      onError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCardChange = (event: any) => {
    if (event.error) {
      setCardError(event.error.message)
    } else {
      setCardError(null)
    }
  }

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h4 className="font-semibold text-gray-900">Booking Summary</h4>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-600">Space:</span>
            <span className="font-medium">{bookingData.spaceName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Location:</span>
            <span className="font-medium">{formatLocation(bookingData.location)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{formatDate(bookingData.bookingDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Desks:</span>
            <span className="font-medium">{bookingData.numberOfDesks}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Price per desk:</span>
            <span className="font-medium">₹{bookingData.pricePerDay}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold text-lg">₹{bookingData.totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-gray-500" />
          <h4 className="font-semibold text-gray-900">Payment Details</h4>
        </div>
        
        <div className="border border-gray-300 rounded-md p-3 bg-white">
          <CardElement
            options={cardElementOptions}
            onChange={handleCardChange}
          />
        </div>
        
        {cardError && (
          <div className="text-red-600 text-sm flex items-center space-x-2">
            <span>⚠️</span>
            <span>{cardError}</span>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <Lock className="w-4 h-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-[#f69938] text-white font-semibold py-3 px-4 rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-opacity"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <span>Pay ₹{bookingData.totalAmount}</span>
        )}
      </button>
    </form>
  )
}

export default function StripePaymentModal({
  isOpen,
  onClose,
  onSuccess,
  bookingData,
}: PaymentModalProps) {
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentIntentResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && !paymentData) {
      initializePayment()
    }
  }, [isOpen])

  const initializePayment = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // const totalAmountInPaise = Math.round(bookingData.totalAmount * 100);
      const response = await clientService.createPaymentIntent({
        amount: bookingData.totalAmount, 
        currency: "inr",
        spaceId: bookingData.spaceId,
        bookingDate: bookingData.bookingDate.toISOString(),
        numberOfDesks: bookingData.numberOfDesks,
        bookingId: bookingData.bookingId || undefined,
      })

      if (response.success) {
        setPaymentData(response.data)
        setStripePromise(loadStripe(response.data.publishableKey))
      } else {
        setError(response.message || "Failed to initialize payment")
        toast.error(response.message || "Failed to initialize payment")
      }
    } catch (error: any) {
      console.error("Error initializing payment:", error)
      const errorMessage = error.message || "Failed to initialize payment"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setPaymentData(null)
    setError(null)
    onClose()
  }

  const handlePaymentSuccess = (bookingId: string) => {
    setPaymentData(null)
    setError(null)
    onSuccess(bookingId)
  }

  const handlePaymentError = (error: string) => {
    setError(error)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-opacity-50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Complete Payment</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#f69938]" />
              <span className="ml-2 text-gray-600">Initializing payment...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">{error}</div>
              <button
                onClick={initializePayment}
                className="bg-[#f69938] text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
            </div>
          ) : paymentData && stripePromise ? (
            <Elements stripe={stripePromise} options={{ clientSecret: paymentData.clientSecret }}>
              <PaymentForm
                clientSecret={paymentData.clientSecret}
                paymentIntentId={paymentData.paymentIntentId}
                bookingData={bookingData}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </Elements>
          ) : null}
        </div>
      </div>
    </div>
  )
}