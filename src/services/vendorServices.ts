import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import authAxiosInstance from "@/api/auth.axios";
import { vendorAxiosInstance } from "@/api/private.axios";
import type { BuildingRegistrationData, GetAllBuildingsResponse, GetBuildingsParams } from "@/types/building.type";
import type { Building } from "@/types/view&editBuilding";
import type { ApiResponse, BookingStatus, BuildingStatus, GetBookingResponse, VendorFormData } from "@/types/service.type";
import { formatCurrency } from '@/utils/formatters/currency';
import { formatBookingDates } from '@/utils/formatters/date';
import type { NewOfferForm } from '@/pages/vendor/SubPages/OfferManagement';
import type { LoginData } from '@/types/service.type';
import type { NotificationResponse } from '@/types/notification.type';
import { getErrorMessage } from '@/utils/errors/errorHandler';
import type { ReportEntry } from '@/types/report.type';
import type { DownloadReportFilterParams } from '@/components/VendorHomeComps/DownloadReport';

export const vendorService = {

sendOtp: async (email: string): Promise<ApiResponse> => {
    try {
    const response = await authAxiosInstance.post('/otp/send', { email });
    return response.data;
    } catch (error:unknown) {
        console.error('Error sending OTP:', error);
        return {
            success: false,
            message: getErrorMessage(error),
          };
    }
}, 

verifyOtp: async (email: string, otp: string): Promise<ApiResponse> => {
    try {
    const response = await authAxiosInstance.post('/otp/verify', { email, otp });
    return response.data;
    } catch (error:unknown) {
    console.error('Error verifying OTP:', error);
    return {
            success: false,
            message: getErrorMessage(error),
     };
    }
},

signup: async (signupData: VendorFormData):Promise<ApiResponse>=>{
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
    console.error('Error logging in:', error);
    return {
            success: false,
            message: getErrorMessage(error),
          };
    }
},

handleGoogleLogin:  () => {
    const role = "vendor";
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google?role=${role}`;
},  

uploadIdProof: async (idProof: string): Promise<ApiResponse> => {
    try {
      const response = await vendorAxiosInstance.post('/users/id-proof', { idProof });
      return response.data;
    } catch (error:unknown) {
      console.error('Error uploading ID proof:', error);
      return {
            success: false,
            message: getErrorMessage(error),
      };
    }
},

//handle profile 

getSingleUser: async (): Promise<ApiResponse> => {
   try {
      const response = await vendorAxiosInstance.get("/users/me");
      return response.data
     } catch (error:unknown) {
      console.error('Error geting user data:', error);
      return {
            success: false,
            message: getErrorMessage(error),
       };
     }
  },

updateProfile: async (data: any): Promise<ApiResponse> => {
    try {
      const response = await vendorAxiosInstance.patch("/users/me", data);
      return response.data;
    } catch (error:unknown) {
      console.error('Error updating profile:', error);
      return {
            success: false,
            message: getErrorMessage(error),
      };
    }
},

updatePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse> => {
    try {
      const response = await vendorAxiosInstance.patch("/users/password", {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error:unknown) {
      console.error('Error updating password:', error);
      return {
            success: false,
            message: getErrorMessage(error),
      };
    }
},

//retry registration

getRetrydata: async (token:string): Promise<ApiResponse>=>{
  try {
     const response = await vendorAxiosInstance.get(`/users/retry?token=${token}`);
     console.log("Fetched retry data",response.data.data)
     return response.data;
  } catch (error:unknown) {
    console.error('Error fetching retry data', error);
     return {
        success: false,
        message: getErrorMessage(error),
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
     const response = await vendorAxiosInstance.post("/users/retry",data);
     return response.data;
   } catch (error:unknown) {
    console.error('Error retry registration:', error);
      return {
        success: false,
        message: getErrorMessage(error),
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
      const response = await vendorAxiosInstance.get("/buildings", {
        params: {
          page,
          limit,
          search,
          status: status === "all" ? undefined : status
        },
      });
      
      console.log('Buildings response:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching buildings:', error);
      return {
        success: false,
        buildings: [],
        totalPages: 0,
        currentPage: 0,
        message: getErrorMessage(error),
      };
    }
},

registerNewBuilding: async(data: BuildingRegistrationData): Promise<ApiResponse>=>{
   try {
     const response = await vendorAxiosInstance.post('/buildings', data);
     return response.data;
   } catch (error:unknown) {
     console.error('Register building error:', error);
     return {
        success: false,
        message: getErrorMessage(error),
      };
   }
},

editBuildingData: async(data:Building):Promise<ApiResponse>=>{
  try {
    console.log(data)
    const response = await vendorAxiosInstance.put("/buildings/edit",data);
    return response.data;
  } catch (error:unknown) {
     console.error('Register building error:', error);
     return {
        success: false,
        message: getErrorMessage(error),
      };
}
},

getBuildingDetails:async(id: string):Promise<ApiResponse>=>{
    try {
       const response = await vendorAxiosInstance.get(`/buildings/${id}`);
       return response.data;
    } catch (error:unknown) {
       console.error('get  building  detail error:', error);
     return {
        success: false,
        message: getErrorMessage(error),
      };
}
},

updateBuildingStatus: async (
      entityType: "building",
      entityId: string,
      status: BuildingStatus ,
      reason?: string
    ): Promise<ApiResponse> => {
      try {
        const response = await vendorAxiosInstance.patch("/entity/status", {
          entityType,
          entityId,
          status,
          reason,
        });
        return response.data;
      } catch (error:unknown) {
        console.error("Error updating user status:", error);
       return {
        success: false,
        message: getErrorMessage(error),
      };
      }
    },

getBookings: async ({page = 1, limit = 5,status,buildingId,fromDate,toDate}:{page:number,limit:number,status?:string,buildingId?:string,fromDate?:string,toDate?:string}): Promise<GetBookingResponse> => {
     try {
      const response = await vendorAxiosInstance.get('/bookings', {
        params: { page, limit, ...(status && { status }), buildingId,fromDate,toDate }
      })
      return response.data;
     } catch (error:unknown) {
      console.error('Error fetching bookings:', error);
      return {
        success: false,
        message: getErrorMessage(error),
      };
     }
  },  
  
updateBookingStatus: async ( 
      entityType: "booking",
      entityId: string,
      status: BookingStatus ,
      reason?: string
    ): Promise<ApiResponse> =>{
     try {
       const response = await vendorAxiosInstance.patch("/entity/status", {
          entityType,
          entityId,
          status,
          reason,
        });
        return response.data;
     } catch (error:unknown) {
      console.error("Error updating user status:", error);
        return {
        success: false,
        message: getErrorMessage(error),
      };
     }
 },

cancelBooking: async (bookingId: string, reason: string): Promise<ApiResponse> => {
     try {
      const response = await vendorAxiosInstance.patch(`/bookings/${bookingId}/cancel`, { 
        reason
       });
      return response.data;
     } catch (error:unknown) {
      console.error('Error cancelling booking:', error);
      return {
        success: false,
        message: getErrorMessage(error),
      };
     }
  }, 

getWalletDetails: async ({page,limit}:{page:number,limit:number}): Promise<ApiResponse> => {
  try {
      const response = await vendorAxiosInstance.get('/wallet',{
      params:{page,limit}
      });
      return response.data;
  } catch (error:unknown) {
    console.error('Error fetching wallet details:', error);
    return {
        success: false,
        message: getErrorMessage(error),
      };
  }
},  

getHomeData: async ()=>{
  try {
    const response = await vendorAxiosInstance.get("/users/home-data");
    return response.data;
  } catch (error:unknown) {
    console.error('Error fetching vendor home details:', error);
    return {
        success: false,
        message: getErrorMessage(error),
      };
  }
},

//download report
downloadPdf: (
  reportData: ReportEntry[],
  vendorData:{username?:string,companyName?:string,email?:string},
  selectedBuildingName?: string
)=>{
   const doc = new jsPDF();

   //Heading
   doc.setFont('helvetica', 'bold');
   doc.setFontSize(22);
   doc.text('Book My Desk', 70, 20);

   doc.setFontSize(13);
   doc.text('Vendor Revenue Report', 69, 30);

   // Vendor Info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Name:', 14, 40);
    doc.setFont('helvetica', 'normal');
    doc.text(`${vendorData.username || ''}`, 40, 40);

    // Company
    doc.setFont('helvetica', 'bold');
    doc.text('Company:', 14, 46);
    doc.setFont('helvetica', 'normal');
    doc.text(`${vendorData.companyName || ''}`, 40, 46);

    // Email
    doc.setFont('helvetica', 'bold');
    doc.text('Email:', 14, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(`${vendorData.email || ''}`, 40, 52);


    let startY = 65;
    if (selectedBuildingName) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(`Building: ${selectedBuildingName}`, 14, startY);
      startY += 10;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Customer Bookings', 14, startY);

    const headColumns = selectedBuildingName
    ? [['Booking ID', 'Customer', 'Space', 'Desks', 'Amount', 'Date']]
    : [['Booking ID', 'Customer', 'Space', 'Building', 'Desks', 'Amount', 'Date']];

    const bodyRows = reportData.map((b) =>
    selectedBuildingName
      ? [
          b.bookingId.slice(0, 13),
          b.clientId?.username || '',
          b.spaceId?.name || '',
          b.numberOfDesks?.toString() || '',
          formatCurrency(b.totalPrice!),
          formatBookingDates(b.bookingDates),
        ]
      : [
          b.bookingId.slice(0, 16),
          b.clientId?.username || '',
          b.spaceId?.name || '',
          b.buildingId?.buildingName || '',
          b.numberOfDesks?.toString() || '',
          formatCurrency(b.totalPrice!),
          formatBookingDates(b.bookingDates),
        ]
  );

   autoTable(doc, {
    startY: startY + 5,
    head: headColumns,
    body: bodyRows,
    styles: {
      fontSize: 10,
      cellPadding: 1.5,
    },
    margin: { left: 14 },
    columnStyles: selectedBuildingName
    ? {
        0: { cellWidth: 25 }, // Booking ID (shorter)
        1: { cellWidth: 28 }, // Customer
        2: { cellWidth: 30 }, // Space
        3: { cellWidth: 15 }, // Desks
        4: { cellWidth: 25 }, // Amount
        5: { cellWidth: 50 }, // Date (longest)
      }
    : {
        0: { cellWidth: 25 },
        1: { cellWidth: 25 },
        2: { cellWidth: 28 },
        3: { cellWidth: 30 }, // Building
        4: { cellWidth: 15 }, // Desks
        5: { cellWidth: 25 }, // Amount
        6: { cellWidth: 50 }, // Date
      }
  });
  doc.save('vendor-revenue-report.pdf');
},

getRevenueReport: async(buildingId?:string,filterParams?: DownloadReportFilterParams):Promise<ApiResponse>=>{
  try {
    const response = await vendorAxiosInstance.get('/bookings/revenue-report',{
      params:{
        buildingId,
        ...filterParams,
      }
    })
    return response.data;
  } catch (error:unknown) {
    console.error('Error geting revenue report for vendor:', error);
    return {
        success: false,
        message: getErrorMessage(error),
      };
  }
},

getRevenueChartData: async (filterParams: {
  filterType: 'month' | 'year' | 'date';
  date?: string;
  month?: string;
  year: string;
}):Promise<ApiResponse> => {
  const response = await vendorAxiosInstance.get('/bookings/revenue-chart', { 
    params: filterParams 
  });
  return response.data;
},

fetchBuildingsForVendor: async():Promise<ApiResponse>=>{
  try {
    const response = await vendorAxiosInstance.get("/buildings/vendor");
    return response.data;
  } catch (error:unknown) {
    console.error('Error fetching buildings for vendor:', error);
    return {
        success: false,
        message: getErrorMessage(error),
      };
  }
},

fetchSpacesForBuildings: async(buildingId:string):Promise<ApiResponse>=>{
  try {
     const response = await vendorAxiosInstance.get(`/buildings/${buildingId}/spaces`);
     return response.data;
  } catch (error:unknown) {
     console.error('Error fetching spaces for building:', error);
    return {
        success: false,
        message: getErrorMessage(error),
      };
  }
},

fetchOffers: async({page=1,limit=5}:{page:number,limit:number})=>{
  try {
    const response = await vendorAxiosInstance.get("/offers",{
      params:{page,limit}
    });
    return response.data;
  } catch (error:unknown) {
     console.error('Error fetching spaces for building:', error);
    return {
        success: false,
        message: getErrorMessage(error),
      };
  }
},

createOffer: async(data: NewOfferForm):Promise<ApiResponse>=>{
   try {
     const response = await vendorAxiosInstance.post("/offers",data);
     return response.data;
   } catch (error:unknown) {
     console.error('Error creating offer:', error);
    return {
        success: false,
        message: getErrorMessage(error),
      };
   }
},

deleteOffer: async(offerId:string):Promise<ApiResponse>=>{
   try {
     const response = await vendorAxiosInstance.delete("/offers",{
      params:{
        entityType: 'offer',
        entityId: offerId
      }
     })
     return response.data;
   } catch (error:unknown) {
     console.error('Error creating offer:', error);
     return {
        success: false,
        message: getErrorMessage(error),
      };
   }
},

getNotifications: async(page:number,limit:number,filter: "unread" | "all"):Promise<{ success: boolean, data?: NotificationResponse, message?: string}>=>{
    try {
      const response = await vendorAxiosInstance.get("/notifications",{
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
         console.error('Error getting notifiactions:', error);
      return {
        success: false,
        message: getErrorMessage(error),
      };
    }
  },

markAsRead: async(id:string | undefined):Promise<ApiResponse>=>{
  try {
     const endpoint = id ? `/notifications/${id}/read` : `/notifications`;
     const response = await vendorAxiosInstance.patch(endpoint);
     return response.data;
  } catch (error:unknown) {
     console.error('Error getting notifiactions:', error);
      return {
        success: false,
        message: getErrorMessage(error),
      };
  }
},

getChats: async(buildingId:string):Promise<ApiResponse>=>{
 try {
   const response = await vendorAxiosInstance.get('/chats',{
    params: { buildingId }
   });
   return response.data;
 } catch (error:unknown) {
  console.error('Error getting notifiactions:', error);
    return {
        success: false,
        message: getErrorMessage(error),
      };
 }
},

getChatMessages: async(sessionId:string):Promise<ApiResponse>=>{
  try {
    const response = await vendorAxiosInstance.get(`/chats/${sessionId}/messages`)
    return response.data;
  } catch (error:unknown) {
    console.error('Error getting notifiactions:', error);
    return {
        success: false,
        message: getErrorMessage(error),
      };
  }
},

clearChat: async(sessionId: string):Promise<ApiResponse>=>{
  try {
    const response = await vendorAxiosInstance.patch(`/chats/${sessionId}/clear`);
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
    const response = await vendorAxiosInstance.delete('/notifications');
    return response.data;
  } catch (error:unknown) {
      return {
      success: false,
      message: getErrorMessage(error),
    };
  }
},

getAllAmenities: async(page?:number,limit?:number,search?:string,status?: string): Promise<ApiResponse>=>{
    try {
      const response = await vendorAxiosInstance.get('/amenities',{
        params:{page,limit,search,status}
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

  getBuildingByToken: async(token: string):Promise<ApiResponse>=>{
    try {
      const response = await vendorAxiosInstance.get("/buildings/retry",{
        params:{token}
      });
      return response.data
     } catch (error:unknown) {
      console.error('Error in logout:', error);
      return {
        success: false,
        message: getErrorMessage(error),
      };
     }
    },

  retryBuilding: async(buildingData:Building):Promise<ApiResponse>=>{
    try {
      const response = await vendorAxiosInstance.post("/buildings/retry",buildingData);
      return response.data;
    } catch (error:unknown) {
      console.error('Error in retry building application:', error);
      return {
        success: false,
        message: getErrorMessage(error),
      };
    }
  },  

  requestAmenity: async(amenityData: { name: string; description: string }): Promise<ApiResponse>=>{
    try {
      const response = await vendorAxiosInstance.post("/amenities",amenityData);
      return response.data;
    } catch (error) {
      console.error('Error in lrequesting amenity:', error);
      return {
        success: false,
        message: getErrorMessage(error),
      };
    }
  },

 logout: async():Promise<ApiResponse>=>{
    try {
      const response = await vendorAxiosInstance.post("/logout");
      return response.data
     } catch (error:unknown) {
      console.error('Error in logout:', error);
      return {
        success: false,
        message: getErrorMessage(error),
      };
     }
  }

  


}