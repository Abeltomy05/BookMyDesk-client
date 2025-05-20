import authAxiosInstance from "@/api/auth.axios";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
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
        message: 'Failed to verify OTP',
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
    } catch (error) {
      console.error('Error logging in:', error);
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }
  },

  forgotPassword: async (email: string): Promise<ApiResponse> => {
    try {
      const response = await authAxiosInstance.post('/forgot-password', { 
        email,
        role: 'client'
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
        password,
        role: 'client'
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
};