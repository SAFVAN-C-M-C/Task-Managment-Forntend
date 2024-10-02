import { AxiosRequestConfig } from "axios";

// Common Axios configuration
export const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
};
export const SERVER_URL = import.meta.env.VITE_CHAT_ME_APP_SERVER_URL;