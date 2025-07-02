import React from 'react'
import ReusableSignup from '@/components/ReusableComponents/ReusableSignup'
import { clientSignupConfig } from '@/config/clientSignupConfig'

const ClientSignup: React.FC = () => {
  return <ReusableSignup config={clientSignupConfig} />
}

export default ClientSignup