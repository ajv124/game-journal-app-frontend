import axiosInstance from "./axiosInstance";

const apiService = async (httpMethod, url, reqBody = null, reqHeader = {}) => {
    const reqConfig = {
        method: httpMethod,
        url,
        data: reqBody,
        headers: reqHeader
    }

    const response = await axiosInstance(reqConfig)
    return response.data
}

export default apiService;