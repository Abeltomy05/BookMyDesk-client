import React from 'react'
import VendorLayout from '../VendorLayout'
import WalletComponent from '@/components/ReusableComponents/Wallet' 
import { vendorService } from '@/services/vendorServices' 

const VendorWalletPage: React.FC = () => {
  return (
    <VendorLayout
      backgroundClass="bg-black"
    >
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
    </VendorLayout>
  )
}

export default VendorWalletPage