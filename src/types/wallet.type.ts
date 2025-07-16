import type { ExtendableItem } from "./table.type"

export interface WalletTransaction extends ExtendableItem {
  _id: string
  type: "topup" | "refund" | "withdrawal" | "payment" | 'platform-fee' | 'booking-income'
  amount: number
  description: string
  balanceBefore: number
  balanceAfter: number
  createdAt: string
}

export interface WalletData {
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