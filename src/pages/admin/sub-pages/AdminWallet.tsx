import { GenericTable } from "@/components/ReusableComponents/GenericTable"
import type { ApiResponse, FetchParams } from "@/types/api.type"
import type { TableColumn } from "@/types/table.type"
import { formatCurrency } from "@/utils/formatters/currency"
import { formatDate } from "@/utils/formatters/date"
import { ArrowUpRight, Calendar, FileText, Wallet } from "lucide-react"
import { useState } from "react"
import { motion } from 'framer-motion';
import { adminService } from "@/services/adminService"
import type { WalletData, WalletTransaction } from "@/types/wallet.type"


export default function AdminWalletPage() {
  const [currentBalance, setCurrentBalance] = useState<number>(0)
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const fetchTransactions = async (params: FetchParams): Promise<ApiResponse<WalletTransaction>> => {
      try {
        const response = await adminService.getWalletDetails({page:params.page || 1, limit:params.limit || 5}) 

       if (response.success && response.data) {
        const walletData: WalletData = response.data;
        setCurrentBalance(walletData.balance);
        return {
          success: true,
          users: walletData.transactions,
          currentPage: walletData.pagination.page,
          totalPages: walletData.pagination.pages,
          totalItems: walletData.pagination.total,
        }
      }  

       return {
        success: false,
        message: response.message || 'Failed to fetch wallet details',
        users: [],
        currentPage: 1,
        totalPages: 0,
        totalItems: 0
      };
      } catch (error) {
        console.error("Failed to fetch buildings:", error)
      return {
       success: false,
        message: 'An error occurred while fetching wallet details',
        users: [],
        currentPage: 1,
        totalPages: 0,
        totalItems: 0
      }
      }
  }



  const handleWithdraw = async () => {
    setIsWithdrawing(true)
    // Simulate withdrawal process
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert("Withdrawal request submitted successfully!")
    setIsWithdrawing(false)
  }

  const columns: TableColumn<WalletTransaction>[] = [
    {
      key: "transactionId",
      label: "Transaction ID",
      width: "col-span-3",
      render: (transaction) => (
        <div className="font-mono text-sm text-[#f69938]">
          {transaction._id}
        </div>
      )
    },
    {
      key: "date",
      label: "Date",
      width: "col-span-2",
      render: (transaction) => (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <span>{formatDate(transaction.createdAt)}</span>
        </div>
      )
    },
    {
      key: "amount",
      label: "Amount",
      width: "col-span-1",
      render: (transaction) => (
        <div className={`font-semibold ${transaction.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {transaction.amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
        </div>
      )
    },
    {
      key: "balanceAfter",
      label: "Balance After",
      width: "col-span-2",
      render: (transaction) => (
        <div className="font-medium">
          {formatCurrency(transaction.balanceAfter)}
        </div>
      )
    },
    {
      key: "description",
      label: "Description",
      width: "col-span-3",
      render: (transaction) => (
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-gray-400" />
          <span className="line-clamp-2 text-sm text-gray-300">{transaction.description}</span>
        </div>
      )
    }
  ]


  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Wallet Balance Section */}
        <motion.div
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-[#f69938]/20 p-4 rounded-full">
                <Wallet size={32} className="text-[#f69938]" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-300">Current Wallet Balance</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-white">
                    {formatCurrency(currentBalance)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* <motion.button
              onClick={handleWithdraw}
              disabled={isWithdrawing}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                isWithdrawing
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-[#f69938] text-black hover:bg-[#f69938]/90 hover:scale-105"
              }`}
              whileHover={{ scale: isWithdrawing ? 1 : 1.05 }}
              whileTap={{ scale: isWithdrawing ? 1 : 0.95 }}
            >
              {isWithdrawing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400 text-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <ArrowUpRight size={20} />
                  <span>Withdraw</span>
                </>
              )}
            </motion.button> */}
          </div>
        </motion.div>

        {/* Transactions Table */}
        <GenericTable<WalletTransaction>
          title="Transaction History"
          columns={columns}
          searchPlaceholder="Search transactions..."
          itemsPerPage={5}
          enableSearch={false}
          enablePagination={true}
          enableActions={false}
          emptyMessage="No transactions found"
          loadingMessage="Loading transactions..."
          fetchData={fetchTransactions}
          className="mt-1"
        />
      </div>
    </div>
  )
}