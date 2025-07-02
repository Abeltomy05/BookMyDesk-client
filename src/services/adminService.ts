import { adminAxiosInstance } from "@/api/admin.axios";
import authAxiosInstance from "@/api/auth.axios";

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
    } catch (error) {
      console.error('Error logging in:', error);
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }
    },

    logout: async():Promise<ApiResponse>=>{
       try {
         const response = await adminAxiosInstance.post("/logout");
         return response.data
        } catch (error) {
         console.error('Error in logout:', error);
         return {
           success: false,
           message: 'Logout Error',
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
        } catch (error:any) {
          console.error('Error fetching users:', error);
          return {
            success: false,
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
      } catch (error) {
         console.error("Failed to fetch pending buildings", error);
    return {
      success: false,
      buildings: [],
      totalPages: 0,
      currentPage: 1,
      message: "Error fetching buildings"
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
      } catch (error:any) {
        console.error("Error updating user status:", error);
        return {
          success: false,
          message: error.response?.data?.message || "Failed to update user status",
        };
      }
    },

   getUserCount: async():Promise<ApiResponse>=>{
    try{
      const response = await adminAxiosInstance.get('/get-user-count');
      return response.data;
    }catch(error:any){
      console.error("Error fetching user count:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch user count",
        data: null
      };
    }
   },

   getWalletDetails: async ({page,limit}:{page:number,limit:number}): Promise<ApiResponse> => {
     try {
         const response = await adminAxiosInstance.get('/get-wallet-details',{
         params:{page,limit}
         });
         return response.data;
     } catch (error:any) {
       console.error('Error fetching wallet details:', error);
       return {
         success: false,
         message: error.message || 'Failed to fetch wallet details. Please try again later.',
       };
     }
   },

   getVendorsAndBuildings:async():Promise<ApiResponse>=>{
    try {
       const response = await adminAxiosInstance.get("/get-vendor-buildings");
       return response.data;
    } catch (error:any) {
     console.error('Error fetching wallet details:', error);
       return {
         success: false,
         message: error.message || 'Failed to fetch wallet details. Please try again later.',
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
    } catch (error) {
      console.error("Error fetching bookings:", error);
    return {
      success: false,
      message: "Failed to fetch bookings.",
      data: null, 
    };
    }
   },

   getSingleVendorData: async(vendorId:string):Promise<ApiResponse>=>{
    try {
      const response = await adminAxiosInstance.get(`/get-single-vendor/${vendorId}`);
      return response.data;
    } catch (error) {
       console.error("Error fetching vendor data:", error);
    return {
      success: false,
      message: "Failed to fetch vendor data.",
      data: null, 
    };
    }
   },

}