import React from 'react'
import ClientLayout from '../ClientLayout'
import WalletComponent from '@/components/ReusableComponents/Wallet' 
import { clientService } from '@/services/clientServices'

const ClientWalletPage: React.FC = () => {
  return (
    <ClientLayout>
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
    </ClientLayout>
  )
}

export default ClientWalletPage