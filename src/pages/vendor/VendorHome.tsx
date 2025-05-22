import { vendorLogout } from '@/store/slices/vendor.slice'
import { useDispatch } from 'react-redux'

const VendorHome = () => {
    const dispatch = useDispatch()
    const handleLogOut = ()=>{
         dispatch(vendorLogout())
    }
  return (
    <>
    <div>VendorHome</div>
    <button onClick={handleLogOut}>Logout</button>
    </>
  )
}

export default VendorHome