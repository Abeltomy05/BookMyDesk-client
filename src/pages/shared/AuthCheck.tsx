import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import { useDispatch } from "react-redux";
import { clientLogin } from "@/store/slices/client.slice";
import { vendorLogin } from "@/store/slices/vendor.slice";
import authAxiosInstance from "@/api/auth.axios";
import Loading from "@/components/Loadings/Loading";
import toast from "react-hot-toast";

const AuthCallback = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true)
        const res = await authAxiosInstance.get('/me');
        const user = res.data.data;
        console.log("Google Login user details:",user)
        setTimeout(()=>{
        if (user.role === "client"){
           dispatch(clientLogin(user));
           navigate("/home");

        }else if (user.role === "vendor"){
          if (!user.idProof) {
            toast("Please upload your ID document to complete registration.");
            navigate("/vendor/upload-doc");
          }else if (user.status === "pending") {
             toast.error("Your vendor account has not yet been approved by the admin.");
             navigate("/vendor/login");
          }else if(user.status === "rejected") {
            toast.error("Your vendor account has been rejected by the admin. Check your email for more details.");
            navigate("/vendor/login");
          }else{  
              dispatch(vendorLogin(user));
              navigate("/vendor/home");
          }
        }
        },1000)
      } catch (err) {
        console.error("Login failed", err);
        navigate("/login");
        setIsLoading(false)
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  return(
    <>
     {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-75 h-75">
            <Loading/>
          </div>
        </div>
      )}
    </>
  )
};

export default AuthCallback;