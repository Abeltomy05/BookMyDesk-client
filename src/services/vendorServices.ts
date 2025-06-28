import authAxiosInstance from "@/api/auth.axios";
import { vendorAxiosInstance } from "@/api/vendor.axios";
import type { BuildingRegistrationData, GetAllBuildingsResponse, GetBuildingsParams } from "@/types/building.type";
import type { Building } from "@/types/view&editBuilding";
import type { VendorRetryFormData } from "@/utils/validations/retry-vendor.validation";
import type { GetBookingResponse } from "./clientServices";

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
export type BuildingStatus = "approved" | "archived";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed" | "failed";

export const vendorService = {

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

    const message = error?.response?.data?.message || "Something went wrong. Please try again.";
    
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

//handle profile 

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

//retry registration

getRetrydata: async (token:string): Promise<ApiResponse>=>{
  try {
     const response = await vendorAxiosInstance.get(`/get-retry-data?token=${token}`);
     console.log("Fetched retry data",response.data.data)
     return response.data;
  } catch (error:any) {
    console.error('Error fetching retry data', error);
      const message = error.response?.data?.message || 'Failed to fetch retry data';
      return {
        success: false,
        message,
      };
  }
},

retryRegistration: async(data:{
    email: string;
    phone: string;
    companyName: string;
    companyAddress: string;
    idProof: string;
}): Promise<ApiResponse> =>{
   try {
     const response = await vendorAxiosInstance.post("/retry-registration",data);
     return response.data;
   } catch (error:any) {
    console.error('Error retry registration:', error);
      const message = error.response?.data?.message || 'Failed to update password';
      return {
        success: false,
        message,
      };
   }
},

//manage building

//get buildings for a vendor
getAllBuildings: async ({
    page = 1,
    limit = 5,
    search = "",
    status
}: GetBuildingsParams): Promise<GetAllBuildingsResponse>=>{
     try {
      const response = await vendorAxiosInstance.get("/get-all-buildings", {
        params: {
          page,
          limit,
          search,
          status: status === "all" ? undefined : status
        },
      });
      
      console.log('Buildings response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching buildings:', error);
      return {
        success: false,
        buildings: [],
        totalPages: 0,
        currentPage: 0,
        message: error.response?.data?.message || 'Failed to fetch buildings'
      };
    }
},

registerNewBuilding: async(data: BuildingRegistrationData): Promise<ApiResponse>=>{
   try {
     const response = await vendorAxiosInstance.post('/register-building', data);
     return response.data;
   } catch (error:any) {
     console.error('Register building error:', error);
     if (error.response) {
       return {
          success: false,
          message: error.response.data?.message || 'Server error occurred',
          data: error.response.data
        };
     }else if (error.request) {
        return {
          success: false,
          message: 'Network error - please check your connection'
        };
     }else {
        return {
          success: false,
          message: 'An unexpected error occurred'
        };
      }
   }
},

editBuildingData: async(data:Building):Promise<ApiResponse>=>{
  try {
    console.log(data)
    const response = await vendorAxiosInstance.put("/edit-building",data);
    return response.data;
  } catch (error:any) {
     console.error('Register building error:', error);
     if (error.response) {
       return {
          success: false,
          message: error.response.data?.message || 'Server error occurred',
          data: error.response.data
        };
  }else{
     return {
          success: false,
          message: 'An unexpected error occurred'
        };
  }
}
},

getBuildingDetails:async(id: string):Promise<ApiResponse>=>{
    try {
       const response = await vendorAxiosInstance.get(`/building/${id}`);
       return response.data;
    } catch (error:any) {
       console.error('get  building  detail error:', error);
     if (error.response) {
       return {
          success: false,
          message: error.response.data?.message || 'Server error occurred',
          data: error.response.data
        };
  }else{
     return {
          success: false,
          message: 'An unexpected error occurred'
        };
    }
}
},

updateBuildingStatus: async (
      entityType: "building",
      entityId: string,
      status: BuildingStatus ,
      reason?: string
    ): Promise<ApiResponse> => {
      try {
        const response = await vendorAxiosInstance.patch("/update-status", {
          entityType,
          entityId,
          status,
          reason,
        });
        return response.data;
      } catch (error:any) {
        console.error("Error updating user status:", error);
        return {
          success: false,
          message: error.response?.data?.message || "Failed to update user status",
        };
      }
    },

getBookings: async ({page = 1, limit = 5, search='', status}:{page:number,limit:number,search:string,status?:string}): Promise<GetBookingResponse> => {
     try {
      const response = await vendorAxiosInstance.get('/get-bookings', {
        params: { page, limit, search, ...(status && { status }) }
      })
      return response.data;
     } catch (error:any) {
      console.error('Error fetching bookings:', error);
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || 'Server error occurred',
          data: error.response.data
        };
      } else {
        return {
          success: false,
          message: 'An unexpected error occurred while fetching bookings'
        };
      }
     }
  },  
  
updateBookingStatus: async ( 
      entityType: "booking",
      entityId: string,
      status: BookingStatus ,
      reason?: string
    ): Promise<ApiResponse> =>{
     try {
       const response = await vendorAxiosInstance.patch("/update-status", {
          entityType,
          entityId,
          status,
          reason,
        });
        return response.data;
     } catch (error:any) {
      console.error("Error updating user status:", error);
        return {
          success: false,
          message: error.response?.data?.message || "Failed to update user status",
        };
     }
 },

cancelBooking: async (bookingId: string, reason: string): Promise<ApiResponse> => {
     try {
      const response = await vendorAxiosInstance.post(`/cancel-booking`, { 
        reason,
        bookingId
       });
      return response.data;
     } catch (error) {
      console.error('Error cancelling booking:', error);
      return {
        success: false,
        message: 'Failed to cancel booking. Please try again later.',
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