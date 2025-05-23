import axios from "axios";


const  BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const adminAxiosInstance = axios.create({
  baseURL:  `${BACKEND_URL}/api/_a/admin`,
  withCredentials:true
});

