import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:4000/api/v1", 
  headers: { "Content-Type": "application/json" },
});


axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    
    const message = error?.response?.data?.message || error.message || "Unknown error";
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
