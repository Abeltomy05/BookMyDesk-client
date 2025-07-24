import { useEffect, useState } from "react"
import { X, CreditCard, Lock, Loader2, Wallet } from "lucide-react"
import { loadStripe, type StripeCardElementChangeEvent  } from "@stripe/stripe-js"
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

interface TopUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  currentBalance?: number
}

interface TopUpPaymentIntentResponse {
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

function TopUpPaymentForm({ 
  clientSecret,  
  paymentIntentId,
  amount,
  onSuccess, 
  onError 
}: {
  clientSecret: string
  paymentIntentId: string
  amount: number
  onSuccess: () => void
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
        console.error("Top-up payment failed:", error)
        setCardError(error.message || "Payment failed")
        toast.error(error.message || "Payment failed")
        onError(error.message || "Payment failed")
      } else if (paymentIntent.status === 'requires_capture') {
        // Payment authorized successfully - backend will handle capture
        try {
          const response = await clientService.confirmTopUpPayment(paymentIntent.id);
          
          console.log("Top-up payment authorization handled:", response)

          if (response.success) {
            toast.success("Top-up successful! Your wallet has been updated.")
            onSuccess()
          } else {
            toast.error(response.message || "Payment authorized but processing failed. Please contact support.")
            onError(response.message || "Payment processing failed")
          }
        } catch (authError: unknown) {
          const message = authError instanceof Error ? authError.message : "Payment processing failed";
          console.error("Top-up authorization handling error:", authError);
          toast.error("Payment authorized but processing failed. Please contact support.");
          onError(message);
        }
      } else if (paymentIntent.status === 'succeeded') {
        console.warn("Payment succeeded immediately — investigate manual capture settings")
        toast.success("Payment succeeded unexpectedly. If your balance isn't updated, please contact support.")
        onSuccess()
      } else {
        console.error("Unexpected payment status:", paymentIntent.status)
        toast.error("Payment completed but with unexpected status. Please contact support.")
        onError("Unexpected payment status")
      }
    } catch (error: unknown) {
       const message = error instanceof Error ? error.message : "An unexpected error occurred";
        console.error("Top-up payment error:", error);
        setCardError(message);
        toast.error(message);
        onError(message);
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCardChange = (event: StripeCardElementChangeEvent) => {
    if (event.error) {
      setCardError(event.error.message)
    } else {
      setCardError(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top-up Summary */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h4 className="font-semibold text-gray-900">Top-up Summary</h4>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-600">Amount to add:</span>
            <span className="font-semibold text-lg text-[#f69938]">₹{amount}</span>
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
          <>
            <Wallet className="w-4 h-4" />
            <span>Add ₹{amount} to Wallet</span>
          </>
        )}
      </button>
    </form>
  )
}

export default function StripeTopUpModal({
  isOpen,
  onClose,
  onSuccess,
  currentBalance = 0,
}: TopUpModalProps) {
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null)
  const [paymentData, setPaymentData] = useState<TopUpPaymentIntentResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")

  
  const MIN_TOP_UP = 50
  const MAX_TOP_UP = 10000
  const quickAmounts = [100, 250, 500, 1000, 2000, 5000]

  const initializePayment = async () => {
    if (!selectedAmount) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await clientService.createTopUpPaymentIntent({
        amount: selectedAmount,
        currency: "inr",
      })
      console.log(response.data);

      if (response.success) {
        setPaymentData(response.data)
        setStripePromise(loadStripe(response.data.publishableKey))
      } else {
        setError(response.message || "Failed to initialize payment")
        toast.error(response.message || "Failed to initialize payment")
      }
    } catch (error: unknown) {
      console.error("Error initializing top-up payment:", error)
       const errorMessage =
      error instanceof Error ? error.message : "Failed to initialize payment";

    setError(errorMessage);
    toast.error(errorMessage);
    } finally {
      setIsLoading(false)
    }
  }

  const handleAmountSelection = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount("")
    setPaymentData(null)
    setError(null)
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue >= MIN_TOP_UP && numValue <= MAX_TOP_UP) {
      setSelectedAmount(numValue)
      setPaymentData(null)
      setError(null)
    } else {
      setSelectedAmount(null)
    }
  }

  const handleClose = () => {
    setPaymentData(null)
    setError(null)
    setSelectedAmount(null)
    setCustomAmount("")
    onClose()
  }

  const handlePaymentSuccess = () => {
    setPaymentData(null)
    setError(null)
    setSelectedAmount(null)
    setCustomAmount("")
    onSuccess()
  }

  const handlePaymentError = (error: string) => {
    setError(error)
  }

  const handleBackToAmountSelection = () => {
    setPaymentData(null)
    setError(null)
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
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-[#f69938]" />
            <h3 className="text-lg font-semibold text-gray-900">Top Up Wallet</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current Balance */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-600">Current Balance</span>
              <span className="text-lg font-semibold text-blue-700">₹{currentBalance}</span>
            </div>
          </div>

          {!selectedAmount || (!paymentData && !isLoading && !error) ? (
            // Amount Selection Screen
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Select Amount</h4>
                
                {/* Quick Amounts Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelection(amount)}
                      className="p-3 border border-gray-300 rounded-lg hover:border-[#f69938] hover:bg-orange-50 transition-colors text-center"
                    >
                      <div className="text-sm font-medium">₹{amount}</div>
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Or enter custom amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f69938] focus:border-transparent outline-none transition-all"
                      placeholder="Enter amount"
                      min="1"
                      step="1"
                    />
                    {customAmount && (selectedAmount === null) && (
                        <p className="text-sm text-red-500 mt-1">
                            Please enter an amount between ₹{MIN_TOP_UP} and ₹{MAX_TOP_UP}.
                        </p>
                     )}
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={initializePayment}
                disabled={!selectedAmount || selectedAmount < MIN_TOP_UP || selectedAmount > MAX_TOP_UP}
                className="w-full bg-[#f69938] text-white font-semibold py-3 px-4 rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-opacity"
              >
                <span>
                  {selectedAmount ? `Continue with ₹${selectedAmount}` : "Select an amount"}
                </span>
              </button>
            </div>
          ) : isLoading ? (
            // Loading Screen
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#f69938]" />
              <span className="ml-2 text-gray-600">Initializing payment...</span>
            </div>
          ) : error ? (
            // Error Screen
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">{error}</div>
              <div className="space-y-3">
                <button
                  onClick={initializePayment}
                  className="bg-[#f69938] text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                >
                  Try Again
                </button>
                <button
                  onClick={handleBackToAmountSelection}
                  className="block w-full text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Back to amount selection
                </button>
              </div>
            </div>
          ) : paymentData && stripePromise ? (
            // Payment Form
            <div className="space-y-4">
              <button
                onClick={handleBackToAmountSelection}
                className="text-gray-600 hover:text-gray-800 transition-colors text-sm flex items-center space-x-1"
              >
                <span>←</span>
                <span>Back to amount selection</span>
              </button>
              
              <Elements stripe={stripePromise} options={{ clientSecret: paymentData.clientSecret }}>
                <TopUpPaymentForm
                  clientSecret={paymentData.clientSecret}
                  paymentIntentId={paymentData.paymentIntentId}
                  amount={selectedAmount!}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}