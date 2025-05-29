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
  excludeStatus?: string | string[];
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

interface GetAllUsersResponse {
  success: boolean;
  users: ClientData[] | VendorData[];
  totalPages: number;
  currentPage: number;
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
      excludeStatus
    }:GetUsersParams): Promise<GetAllUsersResponse>=>{
        try {
          const response = await adminAxiosInstance.get("/getAllUsers", {
                          params: {
                            role,
                            page,
                            limit,
                            search,
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

    updateUserStatus: async (
      userType: "client" | "vendor",
      userId: string,
      status: ClientStatus | VendorStatus,
      reason?: string
    ): Promise<ApiResponse> => {
      try {
        const response = await adminAxiosInstance.post("/update-user-status", {
          userType,
          userId,
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
   }

}