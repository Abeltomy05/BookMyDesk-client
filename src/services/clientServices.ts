import authAxiosInstance from "@/api/auth.axios";
import { clientAxiosInstance } from "@/api/client.axios";
import type { UserProfile } from "@/pages/client/SubPages/ClientProfile";
import type { BookingData } from "@/types/booking.type";
import type { LoginData } from "./adminService";
import type { NotificationResponse } from "@/types/notification.type";
import { getErrorMessage } from "@/utils/errors/errorHandler";
import jsPDF from 'jspdf'
import { formatBookingDates, formatDate } from "@/utils/formatters/date"; 
import { formatCurrency } from "@/utils/formatters/currency"

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
    latitude?: string,
    longitude?: string,
    radius?: string,
    amenities?: string[];
    amenityMatchMode?: 'any' | 'all';
  }
  ): Promise<ApiResponseWithPagination>=>{
    try {
      const response = await clientAxiosInstance.get("/list-buildings",{
         params: { 
          page, limit, locationName: filters.locationName,  
          type: filters.type,  priceRange: filters.priceRange, 
          latitude: filters.latitude, longitude: filters.longitude, 
          radius: filters.radius, amenities: filters.amenities ? JSON.stringify(filters.amenities) : undefined,
          amenityMatchMode: filters.amenityMatchMode,
        },
      });
      return response.data;
    } catch (error: unknown) {
     return {
      success: false,
      message: getErrorMessage(error),
    };
  }
  },

  fetchFilters: async(): Promise<ApiResponse> => {
  try {
    const response = await clientAxiosInstance.get("/fetch-filters");
    return response.data;
  } catch (error:unknown) {
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
    bookingDates: string[]
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

  payWithWallet:async ({spaceId,bookingDates,numberOfDesks,totalPrice,discountAmount}:{spaceId: string,bookingDates:Date[],numberOfDesks:number,totalPrice:number,discountAmount?:number})=>{
    try {
      const response = await clientAxiosInstance.post("/pay-with-wallet",{
        spaceId,
        bookingDates,
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

handleDownloadInvoice : async(booking:BookingData, user?:{username?:string,email?:string,location?:string}):Promise<{success:true}>=>{
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = 30;

  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('BOOK MY DESK', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Invoice', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 20;
  
  // Invoice details
  doc.setFontSize(10);
  doc.text(`Invoice Date: ${formatDate(new Date())}`, margin, yPosition);
  doc.text(`Booking ID: ${booking.bookingId.slice(0,28)}`, pageWidth - margin - 60, yPosition);
  
  yPosition += 15;
  
  // Client Details Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Client Details', margin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${user?.username || 'N/A'}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Email: ${user?.email || 'N/A'}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Location: ${user?.location || 'N/A'}`, margin, yPosition);
  
  yPosition += 15;
  
  // Booking Details Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Booking Details', margin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Space: ${booking.space?.name || 'N/A'}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Building: ${booking.building?.buildingName || 'N/A'}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Location: ${booking.building?.location?.name || 'N/A'}`, margin, yPosition);
  yPosition += 6;
  const formattedDates = formatBookingDates(booking.bookingDates);
  const dateLines = formattedDates.split('\n');
  doc.text(`Booking Dates:`, margin, yPosition);
  yPosition += 6;
  for (const line of dateLines) {
    doc.text(line, margin + 10, yPosition); 
    yPosition += 6;
  }
  doc.text(`Number of Desks: ${booking.numberOfDesks || 0}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Status: ${booking.status}`, margin, yPosition);
  
  yPosition += 15;
  
  // Pricing Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Pricing Breakdown', margin, yPosition);
  yPosition += 10;
  
  // Table header
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Description', margin, yPosition);
  doc.text('Amount', pageWidth - margin - 40, yPosition);
  yPosition += 8;
  
  // Table separator line
 doc.line(margin, yPosition - 4, pageWidth - margin, yPosition - 4);
  // Table content
  doc.setFont('helvetica', 'normal');
    const deskCount = booking.numberOfDesks || 1;
    const dayCount = booking.bookingDates?.length || 1;
    const totalBeforeDiscount = (booking.totalPrice ?? 0) + (booking.discountAmount ?? 0);
    const pricePerDay = totalBeforeDiscount / (deskCount * dayCount)
  
  doc.text(`Price Per Day`, margin, yPosition);
  doc.text(`${formatCurrency(pricePerDay)}`, pageWidth - margin - 40, yPosition);
  yPosition += 6;
  
  doc.text(`Number of Desks`, margin, yPosition);
  doc.text(` ${deskCount}`, pageWidth - margin - 40, yPosition);
  yPosition += 6;

  doc.text(`Number of Days`, margin, yPosition);
  doc.text(` ${dayCount}`, pageWidth - margin - 40, yPosition);
  yPosition += 6;
  
  // Offer/Discount section
  if (booking.discountAmount && booking.discountAmount > 0) {
    doc.setTextColor(0, 128, 0);
    doc.text('Offer Applied (Discount)', margin, yPosition);
    doc.text(`-${formatCurrency(booking.discountAmount)}`, pageWidth - margin - 40, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 6;
  }
  
  // Total line
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;
  
  // Total amount
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Amount:', margin, yPosition);
  doc.text(`${formatCurrency(booking.totalPrice ?? 0)}`, pageWidth - margin - 40, yPosition);
  
  yPosition += 15;
  
  // Payment Information
  doc.setFontSize(14);
  doc.text('Payment Information', margin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Payment Method: ${booking.paymentMethod || 'N/A'}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Transaction ID: ${booking.transactionId || 'N/A'}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Order Created: ${formatDate(booking.createdAt)}`, margin, yPosition);
  
  // Footer
  yPosition = doc.internal.pageSize.getHeight() - 30;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Thank you for choosing Book My Desk!', pageWidth / 2, yPosition, { align: 'center' });
  doc.text('For any queries, please contact our support team.', pageWidth / 2, yPosition + 8, { align: 'center' });
  
  // Save the PDF
  doc.save(`invoice-${booking._id}.pdf`);
  return {
    success:true
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

clearNotifications: async():Promise<ApiResponse>=>{
  try {
    const response = await clientAxiosInstance.delete('/clear-notifications');
    return response.data;
  } catch (error:unknown) {
      return {
      success: false,
      message: getErrorMessage(error),
    };
  }
},

getAllAmenities: async(page?:number,limit?:number,search?:string,isActive?:boolean): Promise<ApiResponse>=>{
    try {
      const response = await clientAxiosInstance.get('/get-amenities',{
        params:{page,limit,search,isActive}
      })
      return response.data;
    }catch (error:unknown) {
        return {
        success: false,
        message: getErrorMessage(error),
        data: [],
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