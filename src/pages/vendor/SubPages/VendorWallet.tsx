import React from 'react'
import VendorLayout from '../VendorLayout'
import WalletComponent from '@/components/ReusableComponents/Wallet' 
import { vendorService } from '@/services/vendorServices' 

const VendorWalletPage: React.FC = () => {
  return (
    <VendorLayout
      notificationCount={5}
      backgroundClass="bg-black"
    >
    <div className='mt-13'>
      <WalletComponent
        title="My Wallet"
        subtitle="Manage your balance and view transaction history"
        walletService={vendorService}
        showTopUpButton={true}
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