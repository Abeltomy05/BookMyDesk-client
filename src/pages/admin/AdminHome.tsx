import { adminLogout } from "@/store/slices/admin.slice";
import { useDispatch } from "react-redux";

const AdminHome = () => {
    const dispatch = useDispatch();
    const handleLogout = async () => {
       dispatch(adminLogout())
    }
  return (
    <div>
        <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default AdminHome