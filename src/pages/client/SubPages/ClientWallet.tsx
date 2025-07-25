import React from 'react'
import WalletComponent from '@/components/ReusableComponents/Wallet' 
import { clientService } from '@/services/clientServices'

const ClientWalletPage: React.FC = () => {
  return (
      <WalletComponent
        title="My Wallet"
        subtitle="Manage your balance and view transaction history"
        walletService={clientService}
        showTopUpButton={true}
        showWithdrawButton={false}
        primaryColor="#f69938"
        primaryColorHover="#e8872e"
        itemsPerPage={5}
        enableWithdrawal={false}
      />
  )
}

export default ClientWalletPage