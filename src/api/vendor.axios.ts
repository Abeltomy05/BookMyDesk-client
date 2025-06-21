import { HandledAuthError } from "@/lib/errors/handleAuthError";
import { vendorLogout } from "@/store/slices/vendor.slice";
import { store } from "@/store/store";
import axios from "axios";
import toast from "react-hot-toast";


const  BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const vendorAxiosInstance = axios.create({
  baseURL:  `${BACKEND_URL}/api/_v/vendor`,
  withCredentials:true
});

let isRefreshing = false;

vendorAxiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			if (!isRefreshing) {
				isRefreshing = true;
				try {
					await vendorAxiosInstance.post("/refresh-token");
					isRefreshing = false;
					return vendorAxiosInstance(originalRequest);
				} catch (refreshError) {
					isRefreshing = false;

					store.dispatch(vendorLogout());

					window.location.href = "/vendor/login";
					toast("Please login again");
					return Promise.reject(refreshError);
				}
			}
		}

		if (
			(error.response.status === 403 &&
				error.response.data.message === "Token is blacklisted") ||
			(error.response.status === 403 &&
				error.response.data.message ===
					"Access denied: Your account has been blocked" &&
				!originalRequest._retry)
		) {
			console.log("Session ended");
			toast.error(error.response.data.message || "Please login again",{
				 duration: 3000,
				 icon: "‼️"
			});
			store.dispatch(vendorLogout());
			// throw new HandledAuthError("Blocked user");
			
			return Promise.reject(error);
		}

		return Promise.reject(error);
	}
);
