import { adminLogout } from "@/store/slices/admin.slice";
import { store } from "@/store/store";
import axios from "axios";
import toast from "react-hot-toast";
import qs from "qs";


const  BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const adminAxiosInstance = axios.create({
  baseURL:  `${BACKEND_URL}/api/_a/admin`,
  withCredentials:true,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

let isRefreshing = false;

adminAxiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (
			error.response?.status === 401 &&
			// error.response.data.message === "Token Expired" &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;
			if (!isRefreshing) {
				isRefreshing = true;
				try {
					await adminAxiosInstance.post("/refresh-token");
					isRefreshing = false;
					return adminAxiosInstance(originalRequest);
				} catch (refreshError) {
					isRefreshing = false;

					store.dispatch(adminLogout());

					window.location.href = "/admin/login";
					toast("Please login again");
					return Promise.reject(refreshError);
				}
			}
		}
		if (
			(error.response.status === 401 &&
				error.response.data.message === "Invalid token") ||
			(error.response.status === 403 &&
				error.response.data.message === "Token is blacklisted") ||
			(error.response.status === 403 &&
				error.response.data.message ===
					"Access denied: Your account has been blocked" &&
				!originalRequest._retry)
		) {
			console.log("Session ended");
			store.dispatch(adminLogout());

			window.location.href = "/admin/login";
			toast("Please login again");
			return Promise.reject(error);
		}

		return Promise.reject(error);
	}
);

