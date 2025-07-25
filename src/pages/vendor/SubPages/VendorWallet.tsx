import React from 'react'
import WalletComponent from '@/components/ReusableComponents/Wallet' 
import { vendorService } from '@/services/vendorServices' 

const VendorWalletPage: React.FC = () => {
  return (
    <div className='mt-13'>
      <WalletComponent
        title="My Wallet"
        subtitle="Manage your balance and view transaction history"
        walletService={vendorService}
        showTopUpButton={false}
        showWithdrawButton={false}
        primaryColor="#f69938"
        primaryColorHover="#e8872e"
        itemsPerPage={5}
        enableWithdrawal={false}
      />
    </div>  
  )
}

export default VendorWalletPage