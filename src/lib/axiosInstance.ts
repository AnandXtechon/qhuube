import { useAdminStore } from "@/store/userStore"
import axios from "axios"


const axiosInstance = axios.create({
    baseURL: `${process.env.BACKEND_URL}/api/v1` || "http://localhost:8000/api/v1",
})

// Add request interceptor to attach token from Zustand store
axiosInstance.interceptors.request.use(
    (config) => {
        // Since this runs outside React, we directly access Zustand store state
        const token = useAdminStore.getState().admin?.token

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default axiosInstance
