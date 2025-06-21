import React from 'react'
import ReusableSignup from '@/components/ReusableComponents/ReusableSignup'
import { vendorSignupConfig } from '@/config/vendorSignupConfig'

const VendorSignup: React.FC = () => {
  return <ReusableSignup config={vendorSignupConfig} />
}

export default VendorSignup