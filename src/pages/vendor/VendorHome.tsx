import { vendorService } from '@/services/vendorServices'
import { vendorLogout } from '@/store/slices/vendor.slice'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const VendorHome = () => {
    const dispatch = useDispatch()

   const handleLogout = async()=>{
      try {
          const response = await vendorService.logout();
            if(response.success){
              toast.success("Logout successful!");
              dispatch(vendorLogout());
            }else{
              toast.error(response.message || "Logout Error");
            }
      } catch (error) {
        toast.error("Logout Error")
      } 
    }

  return (
    <>
    <div>VendorHome</div>
    <button onClick={handleLogout}>Logout</button>
    </>
  )
}

export default VendorHome