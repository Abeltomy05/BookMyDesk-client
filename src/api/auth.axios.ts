import axios from "axios";

const  BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const authAxiosInstance = axios.create({
  baseURL:  `${BACKEND_URL}/api/auth`,
  withCredentials:true
})

export default authAxiosInstance