import { createAxiosInstance } from "@/api/createAxiosInstance.axios";

export const adminAxiosInstance = createAxiosInstance("admin");
export const clientAxiosInstance = createAxiosInstance("client");
export const vendorAxiosInstance = createAxiosInstance("vendor");