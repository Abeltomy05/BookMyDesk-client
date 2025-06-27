import type React from "react"
import { useRef, useState } from "react"
import { Plus, Minus, Download, Upload, Calendar, Hash, DollarSign } from "lucide-react"
import ClientLayout from "../ClientLayout"
import { formatCurrency } from "@/utils/formatters/currency"
import { formatDate } from "@/utils/formatters/date"
import { LightGenericTable } from "@/components/ReusableComponents/LightGenericTable"
import type { TableColumn } from "@/types/table.type"
import type { FetchParams } from "@/types/api.type"
import { clientService } from "@/services/clientServices"

interface WalletTransaction {
  _id: string
  type: "topup" | "refund" | "withdrawal"
  amount: number
  description: string
  balanceBefore: number
  balanceAfter: number
  createdAt: string
}

interface WalletData {
  walletId: string
  balance: number
  createdAt: string
  transactions: WalletTransaction[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

const WalletPage: React.FC = () => {
  const [balance, setBalance] = useState<number>(0)
  const [showTopUpModal, setShowTopUpModal] = useState<boolean>(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false)
  const [topUpAmount, setTopUpAmount] = useState<string>("")
  const [withdrawAmount, setWithdrawAmount] = useState<string>("")

  const tableRef = useRef(null);


  const fetchTransactions = async(params: FetchParams)=>{
    try {
      const response = await clientService.getWalletDetails({
        page:params.page || 1,
        limit: params.limit || 4,
      })
      if(response.success && response.data){
         const walletData: WalletData = response.data;
         setBalance(walletData.balance);
        return {
          success:true,
          users:walletData.transactions,
          currentPage: walletData.pagination.page,
          totalPages:walletData.pagination.pages,
          totalItems:walletData.pagination.total,
        }
      }
      return {
          success: false,
          message: response.message || 'Failed to fetch bookings',
          users: [],
          currentPage: 1,
          totalPages: 0,
          totalItems: 0
        };
    } catch (error) {
       console.error('Error fetching wallet details:', error);
      return {
        success: false,
        message: 'An error occurred while fetching wallet details',
        users: [],
        currentPage: 1,
        totalPages: 0,
        totalItems: 0
      };
    }
  }

  const handleTopUp = () => {
    // const amount = Number.parseFloat(topUpAmount)
    // if (amount > 0) {
    //   const response = await clientService.topUpWallet({ amount });
    //   if (response.success) {
    //       setTopUpAmount("")
    //       setShowTopUpModal(false)
          
    //       // Refresh the table to get updated data
    //       if (tableRef.current) {
    //         tableRef.current.refreshData()
    //    }
    // }
  }

  const handleWithdraw = () => {
    // const amount = Number.parseFloat(withdrawAmount)
    // if (amount > 0 && amount <= balance) {
    //   const newBalance = balance - amount
    //   setBalance(newBalance)
    //   setWithdrawAmount("")
    //   setShowWithdrawModal(false)

    //   if (tableRef.current) {
    //     tableRef.current.refreshData()
    //   }
    // }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "topup":
        return <Upload className="w-4 h-4 text-green-600" />
      case "withdrawal":
        return <Download className="w-4 h-4 text-red-600" />
      case "refund":
        return <DollarSign className="w-4 h-4 text-blue-600" />
      default:
        return null
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "topup":
        return "text-green-600 bg-green-50"
      case "withdrawal":
        return "text-red-600 bg-red-50"
      case "refund":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

   const tableColumns:TableColumn<WalletTransaction>[] = [
   {
      key: 'transactionId',
      label: 'Transaction ID',
      width: 'col-span-3',
      render: (transaction) => (
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-sm">{transaction._id}</span>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      width: 'col-span-2',
      render: (transaction) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(transaction.type)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(transaction.type)}`}>
            {transaction.type}
          </span>
        </div>
      )
    },
    {
      key: 'date',
      label: 'Date',
      width: 'col-span-2',
      render: (transaction) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{formatDate(transaction.createdAt)}</span>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      width: 'col-span-2',
      render: (transaction) => (
        <span className={`font-semibold ${
          transaction.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
        }`}>
          {transaction.type === 'withdrawal' ? '-' : '+'}
          {formatCurrency(Math.abs(transaction.amount))}
        </span>
      )
    },
    {
      key: 'balance',
      label: 'Balance After',
      width: 'col-span-3',
      render: (transaction) => (
        <span className="font-medium text-gray-900">
          {formatCurrency(transaction.balanceAfter)}
        </span>
      )
    }
  ];


  return (
    <ClientLayout>
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wallet</h1>
          <p className="text-gray-600">Manage your balance and view transaction history</p>
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <p className="text-gray-600 text-sm font-medium mb-2">Current Balance</p>
              <p className="text-4xl md:text-5xl font-bold text-gray-900">{formatCurrency(balance)}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowTopUpModal(true)}
                className="flex items-center justify-center gap-2 bg-[#f69938] hover:bg-[#e8872e] text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
              >
                <Plus className="w-5 h-5" />
                Top Up
              </button>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
              >
                <Minus className="w-5 h-5" />
                Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <LightGenericTable
          ref={tableRef}
          title="Transaction History"
          columns={tableColumns}
          fetchData={fetchTransactions}
          enableSearch={false}
          enablePagination={true}
          enableActions={false}
          itemsPerPage={4}
          emptyMessage="No transactions found"
          loadingMessage="Loading transactions..."
        />

        {/* Top Up Modal */}
        {showTopUpModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Top Up Wallet</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></span>
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f69938] focus:border-transparent outline-none"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowTopUpModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTopUp}
                  className="flex-1 px-4 py-3 bg-[#f69938] hover:bg-[#e8872e] text-white rounded-xl font-semibold transition-colors duration-200"
                >
                  Top Up
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Withdraw Funds</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f69938] focus:border-transparent outline-none"
                    placeholder="0.00"
                    min="0"
                    max={balance}
                    step="0.01"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Available balance: {formatCurrency(balance)}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdraw}
                  className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors duration-200"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </ClientLayout>
  )
}

export default WalletPage
