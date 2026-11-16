import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
    timeout: 10000,
    withCredentials:true
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response) {
            const status = error.response.status
            if (status === 401) {
                console.log("Unauthorized access - please login")
            } else if (status === 404) {
                console.log("API not found")
            } else if (status >= 500) {
                console.log("Server error")
            }
        } else if (error.request) {
            console.log("No response from server")
        } else {
            console.log(`Error: ${error.message}`)
        }
        return Promise.reject(error)
    }
)

export default axiosInstance