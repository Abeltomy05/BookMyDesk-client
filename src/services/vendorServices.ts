import authAxiosInstance from "@/api/auth.axios";
import { vendorAxiosInstance } from "@/api/vendor.axios";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface LoginData {
  email: string;
  password: string;
  role:string;
}

export interface VendorFormData {
  username: string
  email: string
  password: string
  phone: string
  companyName: string
  companyAddress: string
  idProof: string
  role: string
}

export const vendorService = {
      /* ============================ */ 
            /* Auth Services */
     /* ============================ */

sendOtp: async (email: string): Promise<ApiResponse> => {
    try {
    const response = await authAxiosInstance.post('/send-otp', { email });
    return response.data;
    } catch (error:any) {
    console.error('Error sending OTP:', error);
        if (error.response && error.response.data) {
                return error.response.data
        }
        return {
            success: false,
            message: "Failed to connect to server"
        }
    }
}, 

verifyOtp: async (email: string, otp: string): Promise<ApiResponse> => {
    try {
    const response = await authAxiosInstance.post('/verify-otp', { email, otp });
    return response.data;
    } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
        success: false,
        message: 'Failed to verify OTP',
    };
    }
},

signup: async (signupData: VendorFormData):Promise<ApiResponse>=>{
      try {
      const response = await authAxiosInstance.post('/signup', signupData);
      return response.data;
    } catch (error) {
      console.error('Error signing up:', error);
      return {
        success: false,
        message: 'Failed to create account',
      };
    }
},

login: async (data: LoginData): Promise<ApiResponse> => {
    try {
      const response = await authAxiosInstance.post('/login', data);
      console.log(response.data);
      return response.data;
    } catch (error:any) {
    console.error('Error logging in:', error);

    const message = error?.response?.data?.message || 'An unexpected error occurred';
    
    return {
      success: false,
      message,
    };
    }
},

handleGoogleLogin:  () => {
    const role = "vendor";
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google?role=${role}`;
},  

uploadIdProof: async (idProof: string): Promise<ApiResponse> => {
    try {
      const response = await vendorAxiosInstance.post('/upload-id-proof', { idProof });
      return response.data;
    } catch (error) {
      console.error('Error uploading ID proof:', error);
      return {
        success: false,
        message: 'Failed to upload ID proof',
      };
    }
},

 getSingleUser: async (): Promise<ApiResponse> => {
   try {
      const response = await vendorAxiosInstance.get("/get-user-data");
      return response.data
     } catch (error) {
      console.error('Error geting user data:', error);
      return {
        success: false,
        message: 'User not found',
      };
     }
  },

 updateProfile: async (data: any): Promise<ApiResponse> => {
    try {
      const response = await vendorAxiosInstance.put("/update-profile", data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        message: 'Failed to update profile',
      };
    }
},

updatePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse> => {
    try {
      const response = await vendorAxiosInstance.put("/update-password", {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error:any) {
      console.error('Error updating password:', error);
      const message = error.response?.data?.message || 'Failed to update password';
      return {
        success: false,
        message,
      };
    }
},






 logout: async():Promise<ApiResponse>=>{
    try {
      const response = await vendorAxiosInstance.post("/logout");
      return response.data
     } catch (error) {
      console.error('Error in logout:', error);
      return {
        success: false,
        message: 'Logout Error',
      };
     }
  }

  


}