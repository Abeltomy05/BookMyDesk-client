import axios from "axios";


const  BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const clientAxiosInstance = axios.create({
  baseURL:  `${BACKEND_URL}/api/_c/client`,
  withCredentials:true
});

