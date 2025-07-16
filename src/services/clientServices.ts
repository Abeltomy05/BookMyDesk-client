import authAxiosInstance from "@/api/auth.axios";
import { clientAxiosInstance } from "@/api/client.axios";
import type { UserProfile } from "@/pages/client/SubPages/ClientProfile";
import type { BookingData } from "@/types/booking.type";
import type { LoginData } from "./adminService";
import type { NotificationResponse } from "@/types/notification.type";
import { getErrorMessage } from "@/utils/errors/errorHandler";

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
    } catch (error:unknown) {
       return {
          success: false,
          message: getErrorMessage(error),
        };
    }
  },

  verifyOtp: async (email: string, otp: string): Promise<ApiResponse> => {
    try {
       const response = await authAxiosInstance.post('/verify-otp', { email, otp });
       return response.data;
    } catch (error:unknown) {
      return {
        success: false,
        message: getErrorMessage(error),
      };
    }
  },

  signup: async (signupData: SignupData):Promise<ApiResponse>=>{
      try {
      const response = await authAxiosInstance.post('/signup', signupData);
      return response.data;
    } catch (error:unknown) {
       return {
          success: false,
          message: getErrorMessage(error),
        };
    }
  },

  login: async (data: LoginData): Promise<ApiResponse> => {
    try {
      const response = await authAxiosInstance.post('/login', data);
      console.log(response.data);
      return response.data;
    } catch (error:unknown) {
      return {
        success: false,
        message: getErrorMessage(error),
      };
    }
  },

  forgotPassword: async (email: string): Promise<ApiResponse> => {
    try {
      const response = await authAxiosInstance.post('/forgot-password', { 
        email
      });
      return response.data;
    } catch (error: unknown) {
      return {
        success: false,
        message: getErrorMessage(error),
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
    } catch (error: unknown) {
      return {
        success: false,
        message: getErrorMessage(error),
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
     } catch (error:unknown) {
       return {
          success: false,
          message: getErrorMessage(error),
        };
     }
  },

  getSingleUser: async (): Promise<ApiResponse> => {
   try {
      const response = await clientAxiosInstance.get("/get-user-data");
      return response.data
     } catch (error:unknown) {
      return {
        success: false,
        message: getErrorMessage(error),
      };
     }
  },

  updateProfile: async (data: UserProfile): Promise<ApiResponse> => {
    try {
      const response = await clientAxiosInstance.put("/update-profile", data);
      return response.data;
    } catch (error:unknown) {
       return {
        success: false,
        message: getErrorMessage(error),
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
    } catch (error:unknown) {
       return {
          success: false,
          message: getErrorMessage(error),
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
    } catch (error: unknown) {
     return {
      success: false,
      message: getErrorMessage(error),
    };
  }
  },

  //building details

  getBuildingDetails: async(buildingId:string): Promise<ApiResponse>=>{
     try {
      const id = buildingId;
      const response = await clientAxiosInstance.get(`/building/${id}`);
      return response.data;
     } catch (error:unknown) {
      return {
        success: false,
        message: getErrorMessage(error),
      };
     }
  },

  //booking pages

  getBookingPageData: async(spaceId:string): Promise<ApiResponse>=>{
    try {
      const response = await clientAxiosInstance.get(`/get-booking-page-data/${spaceId}`);
      return response.data;
    } catch (error:unknown) {
       return {
          success: false,
          message: getErrorMessage(error),
        };
    }
  },

  //Stripe

  createPaymentIntent: async (data: {
    amount: number
    currency: string
    spaceId: string
    bookingDate: string
    numberOfDesks: number
    discountAmount?: number
    bookingId?: string
  }):Promise<ApiResponse> => {
    try {
      const response = await clientAxiosInstance.post('/create-payment-intent', data);
      return response.data;
    } catch (error:unknown) {
       return {
        success: false,
        message: getErrorMessage(error),
      };
    }
  },

  confirmPayment: async (data: {
    paymentIntentId: string
  }):Promise<ApiResponse> => {
      try {
        const response = await clientAxiosInstance.post('/confirm-payment', data);
        return response.data;
      } catch (error:unknown) {
         return {
          success: false,
          message: getErrorMessage(error),
        };
      }
  },

  //bookings

  getBookings: async ({page = 1, limit = 5, search='', status}:{page:number,limit:number,search:string,status?:string}): Promise<GetBookingResponse> => {
     try {
      const response = await clientAxiosInstance.get('/get-bookings', {
        params: { page, limit, search, ...(status && { status }) }
      })
      return response.data;
     } catch (error:unknown) {
      return {
        success: false,
        message: getErrorMessage(error),
      };
     }
  },

  getBookingDetails: async (bookingId: string): Promise<ApiResponse> => {
    try {
      const response = await clientAxiosInstance.get(`/get-booking-details/${bookingId}`);
      return response.data;
    } catch (error:unknown) {
      return {
      success: false,
      message: getErrorMessage(error),
    };
    }
  },

  cancelBooking: async (bookingId: string, reason: string): Promise<ApiResponse> => {
     try {
      const response = await clientAxiosInstance.post(`/cancel-booking`, { 
        reason,
        bookingId
       });
      return response.data;
     } catch (error:unknown) {
       return {
          success: false,
          message: getErrorMessage(error),
        };
     }
  },

  // wallet

  getWalletDetails: async ({page,limit}:{page:number,limit:number}): Promise<ApiResponse> => {
    try {
       const response = await clientAxiosInstance.get('/get-wallet-details',{
        params:{page,limit}
       });
       return response.data;
    } catch (error:unknown) {
       return {
        success: false,
        message: getErrorMessage(error),
      };
    }
  },

  payWithWallet:async ({spaceId,bookingDate,numberOfDesks,totalPrice,discountAmount}:{spaceId: string,bookingDate:Date,numberOfDesks:number,totalPrice:number,discountAmount?:number})=>{
    try {
      const response = await clientAxiosInstance.post("/pay-with-wallet",{
        spaceId,
        bookingDate,
        numberOfDesks,
        totalPrice,
        discountAmount
      })
      return response.data;
    } catch (error:unknown) {
      return {
        success: false,
        message: getErrorMessage(error),
      };
    }
  },

  // wallet topup

  createTopUpPaymentIntent:async({amount,currency}:{amount:number,currency:string}): Promise<ApiResponse>=>{
    try {
      const response = await clientAxiosInstance.post('/create-topup-payment-intent',{amount,currency});
      return response.data;
    } catch (error:unknown) {
        return {
          success: false,
          message: getErrorMessage(error),
        };
    }
  },

  confirmTopUpPayment: async(paymentIntentId: string):Promise<ApiResponse>=>{
    try {
       const response = await clientAxiosInstance.post("/confirm-topup-payment",{ paymentIntentId });
       return response.data;
    } catch (error:unknown) {
        return {
      success: false,
      message: getErrorMessage(error),
    };
    }
  },

  getNotifications: async(page:number,limit:number,filter: "unread" | "all"):Promise<{ success: boolean, data?: NotificationResponse, message?: string}>=>{
    try {
      const response = await clientAxiosInstance.get("/get-notifications",{
        params:{
          page,
          limit,
          filter,
        }
      })
      const data = response.data.data;
        return {
          success: true,
          data: {
            items: data.items,
            totalCount: data.totalCount,
            unreadCount: data.unreadCount,
            hasMore: (page + 1) * limit < data.totalCount,
          },
        };
    } catch (error:unknown) {
        return {
      success: false,
      message: getErrorMessage(error),
    };
    }
  },

markAsRead: async(id:string):Promise<ApiResponse>=>{
  try {
     const response = await clientAxiosInstance.patch(`/mark-as-read/${id}`);
     return response.data;
  } catch (error:unknown) {
      return {
      success: false,
      message: getErrorMessage(error),
    };
  }
},

//chat related
createSession: async({buildingId}:{buildingId:string}):Promise<ApiResponse>=>{
 try {
    const response = await clientAxiosInstance.post('/create-session',{
      buildingId,
    });
    return response.data;
 } catch (error:unknown) {
   return {
      success: false,
      message: getErrorMessage(error),
    };
 }
},

getChats: async():Promise<ApiResponse>=>{
 try {
   const response = await clientAxiosInstance.get('/getChats');
   return response.data;
 } catch (error:unknown) {
   return {
      success: false,
      message: getErrorMessage(error),
    };
 }
},

getChatMessages: async(sessionId:string):Promise<ApiResponse>=>{
  try {
    const response = await clientAxiosInstance.get('/messages',{
      params:{
        sessionId
      }
    })
    return response.data;
  } catch (error:unknown) {
     return {
      success: false,
      message: getErrorMessage(error),
    };
  }
},

clearChat: async(sessionId: string):Promise<ApiResponse>=>{
  try {
    const response = await clientAxiosInstance.post('/clear-chat',{sessionId});
    return response.data;
  } catch (error:unknown) {
      return {
      success: false,
      message: getErrorMessage(error),
    };
  }
},

logout: async():Promise<ApiResponse>=>{
    try {
      const response = await clientAxiosInstance.post("/logout");
      return response.data
     } catch (error:unknown) {
      console.error('Error in logout:', error);
      return {
        success: false,
        message: getErrorMessage(error),
      };
     }
  }
};