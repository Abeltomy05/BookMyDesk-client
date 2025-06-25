import authAxiosInstance from "@/api/auth.axios";
import { clientAxiosInstance } from "@/api/client.axios";
import type { UserProfile } from "@/pages/client/SubPages/ClientProfile";
import type { BookingData } from "@/types/booking.type";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface ApiResponseWithPagination{
  success: boolean;
  message?:string;
  data?: any;
  total?:number;
  page?:number;
  limit?:number;
  totalPages?:number;
}

export interface SignupData {
  username: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

export interface LoginData {
  email: string;
  password: string;
  role:string;
}


export interface GetBookingResponse {
  success: boolean;
  data?: BookingData[];
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
  message?: string
}

export const clientService = {

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
        message: 'The OTP you entered is incorrect or has expired. Please try again or request a new OTP.',
      };
    }
  },

  signup: async (signupData: SignupData):Promise<ApiResponse>=>{
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
      const message = error.response?.data?.message || "Something went wrong. Please try again.";
      return {
        success: false,
        message,
      };
    }
  },

  forgotPassword: async (email: string): Promise<ApiResponse> => {
    try {
      const response = await authAxiosInstance.post('/forgot-password', { 
        email
      });
      return response.data;
    } catch (error: any) {
      console.error('Error requesting password reset:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Failed to send password reset email',
      };
    }
  },

  resetPassword: async (token: string, password: string): Promise<ApiResponse> => {
    try {
      const response = await authAxiosInstance.post('/reset-password', {
        token,
        password
      });
      return response.data;
    } catch (error: any) {
      console.error('Error resetting password:', error);
      if (error.response && error.response.data) {
        return error.response.data;
      }

       if (error.message?.toLowerCase().includes('token')) {
        return {
          success: false,
          message: 'Invalid or expired token. Please request a new password reset link.',
        };
      }
      
      return {
        success: false,
        message: 'Failed to reset password. Please try again later.',
      };
    }
  },

  handleGoogleLogin:  () => {
       const role = "client";
       window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google?role=${role}`;
  },

  getMe: async(): Promise<ApiResponse>=>{
     try {
      const response = await authAxiosInstance.get("/me");
      return response.data
     } catch (error) {
      console.error('Error geting user data:', error);
      return {
        success: false,
        message: 'User not found',
      };
     }
  },

  getSingleUser: async (): Promise<ApiResponse> => {
   try {
      const response = await clientAxiosInstance.get("/get-user-data");
      return response.data
     } catch (error) {
      console.error('Error geting user data:', error);
      return {
        success: false,
        message: 'User not found',
      };
     }
  },

  updateProfile: async (data: UserProfile): Promise<ApiResponse> => {
    try {
      const response = await clientAxiosInstance.put("/update-profile", data);
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
      const response = await clientAxiosInstance.put("/update-password", {
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

  //buildings listing

  fetchBuildings: async(page = 1, limit = 5,
    filters: {
    locationName?: string;
    type?: string;
    priceRange?: string;
  }
  ): Promise<ApiResponseWithPagination>=>{
    try {
      const response = await clientAxiosInstance.get("/list-buildings",{
         params: { page, limit, locationName: filters.locationName,  type: filters.type,  priceRange: filters.priceRange,},
      });
      return response.data;
    } catch (error: any) {
    console.error("Error fetching buildings:", error);

    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong while fetching buildings",
    };
  }
  },

  //building details

  getBuildingDetails: async(buildingId:string): Promise<ApiResponse>=>{
     try {
      const id = buildingId;
      const response = await clientAxiosInstance.get(`/building/${id}`);
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

  //booking pages

  getBookingPageData: async(spaceId:string): Promise<ApiResponse>=>{
    try {
      const response = await clientAxiosInstance.get(`/get-booking-page-data/${spaceId}`);
      return response.data;
    } catch (error:any) {
       console.error('get  booking page details error:', error);
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

  //Stripe

  createPaymentIntent: async (data: {
    amount: number
    currency: string
    spaceId: string
    bookingDate: string
    numberOfDesks: number
  }):Promise<ApiResponse> => {
    try {
      const response = await clientAxiosInstance.post('/create-payment-intent', data);
      return response.data;
    } catch (error:any) {
       console.error('create payment intent error:', error);
     if (error.response) {
       return {
          success: false,
          message: error.response.data?.message || 'Server error occurred',
          data: error.response.data
        };
      }else{
        return {
              success: false,
              message: 'An unexpected error occurred in create payment intent'
            };
        }
    }
  },

  confirmPayment: async (data: {
    paymentIntentId: string
  }):Promise<ApiResponse> => {
      try {
        const response = await clientAxiosInstance.post('/confirm-payment', data);
        return response.data;
      } catch (error:any) {
        console.error('confirm payment error:', error);
        if (error.response) {
          return {
              success: false,
              message: error.response.data?.message || 'Server error occurred',
              data: error.response.data
            };0
          }else{
            return {
                  success: false,
                  message: 'An unexpected error occurred in confirm payment'
                };
            }
      }
  },

  //bookings
  
  getBookings: async ({page = 1, limit = 5, search='', status}:{page:number,limit:number,search:string,status?:string}): Promise<GetBookingResponse> => {
     try {
      const response = await clientAxiosInstance.get('/get-bookings', {
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

  getBookingDetails: async (bookingId: string): Promise<ApiResponse> => {
    try {
      const response = await clientAxiosInstance.get(`/get-booking-details/${bookingId}`);
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




  logout: async():Promise<ApiResponse>=>{
    try {
      const response = await clientAxiosInstance.post("/logout");
      return response.data
     } catch (error) {
      console.error('Error in logout:', error);
      return {
        success: false,
        message: 'Logout Error',
      };
     }
  }
};