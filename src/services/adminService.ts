import { adminAxiosInstance } from "@/api/admin.axios";
import authAxiosInstance from "@/api/auth.axios";
import type { NotificationResponse } from "@/types/notification.type";
import { getErrorMessage } from "@/utils/errors/errorHandler";

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

type ClientStatus = "active" | "blocked"
type VendorStatus = "pending" | "approved" | "rejected" | "blocked";

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

    getPendingBuildings: async({page=1,limit=5,search="",})=>{
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
      entityType: "client" | "vendor" | "building",
      entityId: string,
      status: ClientStatus | VendorStatus,
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

  monthlyStats: async():Promise<ApiResponse>=>{
   try {
    const response = await adminAxiosInstance.get("/monthly-stats");
    return response.data;
   } catch (error:unknown) {
     console.error('Error getting monthly stats:', error);
        return {
            success: false,
            message: getErrorMessage(error),
         };
   }
  }  

}