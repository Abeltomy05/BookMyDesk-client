import { adminAxiosInstance } from "@/api/admin.axios";
import authAxiosInstance from "@/api/auth.axios";
import type { AllBuildingsData } from "@/pages/admin/sub-pages/BuildingListing";
import type { NotificationResponse } from "@/types/notification.type";
import type { AdminReportEntry } from "@/types/report.type";
import { getErrorMessage } from "@/utils/errors/errorHandler";
import { formatCurrency } from "@/utils/formatters/currency";
import { formatBookingDates } from "@/utils/formatters/date"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface LoginData {
  email: string;
  password: string;
  role:string;
  fcmToken?:string;
}

export type ClientStatus = "active" | "blocked";
export type VendorStatus = "pending" | "approved" | "rejected" | "blocked";
export type AmenityStatus = "active" | "non-active"

interface GetUsersParams {
  role?: "client" | "vendor";
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  excludeStatus?: string | string[];
}

interface GetAllUsersResponse {
  success: boolean;
  users: ClientData[] | VendorData[];
  totalPages: number;
  currentPage: number;
  message?: string
}

export interface Amenities{
  _id:string,
  name:string,
  isActive:boolean,
}

interface GetAllBuildingResponse{
  success: boolean;
  buildings: AllBuildingsData[];
  totalPages: number;
  currentPage: number;
  totalItems?: number;
  message?: string;
}

export interface GetAllAmenities{
  success:boolean;
  message:string;
  data: Amenities[];
  totalPages:number;
  currentPage:number;
  totalItems?:number;
}

interface VendorData {
  _id: string;
  username: string;
  email: string;
  phone: string;
  status: VendorStatus
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  companyName?: string;
  companyAddress?: string;
  banner?: string;
  description?: string;
  idProof?: string;
}

interface ClientData {
  _id: string
  username: string
  email: string
  phone: string
  status: ClientStatus
  avatar?: string
  createdAt?: string;
  updatedAt?: string;
}

export const adminService = {
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

    logout: async():Promise<ApiResponse>=>{
       try {
         const response = await adminAxiosInstance.post("/logout");
         return response.data
        } catch (error:unknown) {
          return {
            success: false,
            message: getErrorMessage(error),
          };
     } 
    },

    getAllUsers: async({
      role,
      page=1,
      limit=5,
      search="",
      status,
      excludeStatus
    }:GetUsersParams): Promise<GetAllUsersResponse>=>{
        try {
          const response = await adminAxiosInstance.get("/getAllUsers", {
                          params: {
                            role,
                            page,
                            limit,
                            search,
                            status,
                            excludeStatus
                          },
                        });
           console.log(response.data);             
           return response.data;             
        } catch (error:unknown) {
           return {
              success: false,
              message: getErrorMessage(error),
              users: [],
              totalPages: 0,
              currentPage: 0,
            };
        }
    },

    getPendingBuildings: async({page=1,limit=5,})=>{
      try {
        const response = await adminAxiosInstance.get("/get-pending-buildings", {
          params: { page, limit },
       });
        return response.data;
      } catch (error:unknown) {
         console.error("Failed to fetch pending buildings", error);
        return {
          success: false,
          buildings: [],
          totalPages: 0,
          currentPage: 1,
          message: getErrorMessage(error)
        };
      }
    },

    updateEntityStatus: async (
      entityType: "client" | "vendor" | "building" | "amenity",
      entityId: string,
      status: ClientStatus | VendorStatus | AmenityStatus,
      reason?: string
    ): Promise<ApiResponse> => {
      try {
        const response = await adminAxiosInstance.patch("/update-status", {
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

   getUserCount: async():Promise<ApiResponse>=>{
    try{
      const response = await adminAxiosInstance.get('/get-user-count');
      return response.data;
    }catch(error:unknown){
      console.error("Error fetching user count:", error);
      return {
            success: false,
            message: getErrorMessage(error),
      };
    }
   },

   getWalletDetails: async ({page,limit}:{page:number,limit:number}): Promise<ApiResponse> => {
     try {
         const response = await adminAxiosInstance.get('/get-wallet-details',{
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

   getVendorsAndBuildings:async():Promise<ApiResponse>=>{
    try {
       const response = await adminAxiosInstance.get("/get-vendor-buildings");
       return response.data;
    } catch (error:unknown) {
     console.error('Error fetching wallet details:', error);
      return {
            success: false,
            message: getErrorMessage(error),
       };
    }
   },

   getBookingsForAdmin:async(params:{ page: number; limit: number; vendorId?: string; buildingId?: string; status?: string }):Promise<ApiResponse>=>{
    try {
       const response = await adminAxiosInstance.get("/get-bookings",{
        params: {
        page: params.page,
        limit: params.limit,
        vendorId: params.vendorId,
        buildingId: params.buildingId,
        status: params.status,
      },
       })
       return response.data;
    } catch (error:unknown) {
      console.error("Error fetching bookings:", error);
      return {
            success: false,
            message: getErrorMessage(error),
       };
    }
   },

   getSingleVendorData: async(vendorId:string):Promise<ApiResponse>=>{
    try {
      const response = await adminAxiosInstance.get(`/get-single-vendor/${vendorId}`);
      return response.data;
    } catch (error:unknown) {
       console.error("Error fetching vendor data:", error);
       return {
            success: false,
            message: getErrorMessage(error),
        };
    }
   },

  getNotifications: async(page:number,limit:number,filter: "unread" | "all"):Promise<{ success: boolean, data?: NotificationResponse, message?: string}>=>{
      try {
        const response = await adminAxiosInstance.get("/get-notifications",{
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

    markAsRead: async(id:string):Promise<ApiResponse>=>{
      try {
        const response = await adminAxiosInstance.patch(`/mark-as-read/${id}`);
        return response.data;
      } catch (error:unknown) {
        console.error('Error getting notifiactions:', error);
        return {
            success: false,
            message: getErrorMessage(error),
         };
      }
    },

  getAllBuildings: async(params:{ page?: number; limit?: number; search?: string; status?:string}):Promise<GetAllBuildingResponse>=>{
    try {
      const response = await adminAxiosInstance.get("/get-every-building",{
        params: {
          page: params.page,
          limit: params.limit,
          search: params.search,
          status: params.status,
        },
      })
      return response.data;
    } catch (error:unknown) {
      console.error('Error getting monthly stats:', error);
        return {
            success: false,
            message: getErrorMessage(error),
            buildings:[],
            totalPages: 0,
            currentPage: 0,
            totalItems: 0,
         };
    }
  },

  getRevenueChartData: async (filterParams: {
    filterType: 'month' | 'year' | 'date';
    date?: string;
    month?: string;
    year: string;
  }):Promise<ApiResponse> => {
     try {
    const response = await adminAxiosInstance.get('/revenue-chart', { 
      params: filterParams 
    });
    return response.data;
    } catch (error:unknown) {
        console.error('Error getting chart data:', error);
        return {
            success: false,
            message: getErrorMessage(error),
         };
      }
  },

  getRevenueReport: async (filterParams: {
    filterType: 'month' | 'year' | 'date';
    date?: string;
    month?: string;
    year: string;
  }):Promise<ApiResponse> =>{
    try {
    const response = await adminAxiosInstance.get('/revenue-report', { 
      params: filterParams 
    });
     return response.data;
    } catch (error:unknown) {
        console.error('Error getting chart data:', error);
        return {
            success: false,
            message: getErrorMessage(error),
         };
      }  
  },

  downloadPdf: (
    reportData: AdminReportEntry[],
    totalAdminRevenue: number,
    filterLabel: string
  )=>{
     const doc = new jsPDF();
  
     //Heading
     doc.setFont('helvetica', 'bold');
     doc.setFontSize(22);
     doc.text('Book My Desk', 70, 20);
  
     doc.setFontSize(13);
     doc.text('Admin Revenue Report', 69, 30);
  
     // Filter info (Month/Year/Date)
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Report Period:', 14, 38);
      doc.setFont('helvetica', 'normal');
      doc.text(`${filterLabel}`, 45, 38);

     // Table Start Position
     let startY = 50;  

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Completed Bookings', 14, startY);

     const headColumns = [['Booking ID', 'Customer', 'Space', 'Building', 'Desks', 'Amount', 'Admin Revenue', 'Date']];

     const bodyRows = reportData.map((b) =>[
          b.bookingId.slice(0, 16),
          b.clientId?.username || '',
          b.spaceId?.name || '',
          b.buildingId?.buildingName || '',
          b.numberOfDesks?.toString() || '',
          formatCurrency(b.totalPrice!),
          formatCurrency(b.adminRevenue),
          formatBookingDates(b.bookingDates || []),
        ]
      );

      autoTable(doc, {
        startY: startY + 5,
        head: headColumns,
        body: bodyRows,
        styles: {
          fontSize: 9,
          cellPadding: 2,
          valign: 'top',
        },
        columnStyles: {
          7: { cellWidth: 40 }, 
        },
      });

    const finalY = (doc as any).lastAutoTable.finalY || startY + 20;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Total Admin Revenue:', 14, finalY + 10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${formatCurrency(totalAdminRevenue)}`, 70, finalY + 10);

      doc.save('admin-revenue-report.pdf');
  },

  clearNotifications: async():Promise<ApiResponse>=>{
    try {
      const response = await adminAxiosInstance.delete('/clear-notifications');
      return response.data;
    } catch (error:unknown) {
        return {
        success: false,
        message: getErrorMessage(error),
      };
    }
  },

  getAllAmenities: async(page?:number,limit?:number,search?:string,isActive?:boolean): Promise<GetAllAmenities>=>{
    try {
      const response = await adminAxiosInstance.get('/get-amenities',{
        params: { page, limit, search, isActive }
      })
      return response.data;
    }catch (error:unknown) {
        return {
        success: false,
        message: getErrorMessage(error),
        data: [],
        totalPages:0,
        currentPage:0,
        totalItems:0,
      };
    }
  },

  createAmenity: async (name:string):Promise<ApiResponse>=>{
    try {
      const response = await adminAxiosInstance.post('/create-amenity',{name});
      return response.data;
    } catch (error:unknown) {
        return {
        success: false,
        message: getErrorMessage(error),
      };
    }
  },

  editAmenity: async (name:string,id:string):Promise<ApiResponse>=>{
    try {
      const response = await adminAxiosInstance.patch('/edit-amenity',{name,id});
      return response.data;
    } catch (error:unknown) {
        return {
        success: false,
        message: getErrorMessage(error),
      };
    }
  },
  
  deleteAmenity: async (id:string):Promise<ApiResponse>=>{
    try {
      const response = await adminAxiosInstance.delete('/delete-amenity',{
        params:{id}
      });
      return response.data;
    } catch (error:unknown) {
        return {
        success: false,
        message: getErrorMessage(error),
      };
    }
  },

}