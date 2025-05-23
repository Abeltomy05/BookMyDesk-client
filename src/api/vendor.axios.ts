import axios from "axios";


const  BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const vendorAxiosInstance = axios.create({
  baseURL:  `${BACKEND_URL}/api/_v/vendor`,
  withCredentials:true
});

