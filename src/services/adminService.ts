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
    }
}