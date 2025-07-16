import { HandledAuthError } from "@/utils/errors/handleAuthError";
import { clientLogout } from "@/store/slices/client.slice";
import { store } from "@/store/store";
import axios from "axios";
import toast from "react-hot-toast";


const  BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const clientAxiosInstance = axios.create({
  baseURL:  `${BACKEND_URL}/api/_c/client`,
  withCredentials:true
});

let isRefreshing = false;

clientAxiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			if (!isRefreshing) {
				isRefreshing = true;
				try {
					await clientAxiosInstance.post("/refresh-token");
					isRefreshing = false;
					return clientAxiosInstance(originalRequest);
				} catch (refreshError) {
					isRefreshing = false;

					store.dispatch(clientLogout());

					window.location.href = "/login";
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
			console.log("Session ended",error.response.data.message);

            toast.error(error.response.data.message || "Please login again",{
				 duration: 3000, 
			});
			store.dispatch(clientLogout());
			// throw new HandledAuthError("Blocked user");

			return Promise.reject(error);
		}

		return Promise.reject(error);
	}
);

