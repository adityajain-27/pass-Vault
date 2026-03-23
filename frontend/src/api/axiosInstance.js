import axios from 'axios';

const axiosInstance = axios.create({
    baseURL : 
    import.meta.env.VITE_API_URL || 
    'https://localhost:5000/api' ,
}) // here we create the base instance

axiosInstance.interceptors.request.use
(
    (config) => {
        const accessToken = 
    localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization =
    `Bearer ${accessToken}` ;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);//Request Interceptor: Attach the access token to every outgoing request so not to connect manually

//Response  Interceptor : Automatically refresh the token if it expires (401 error)
axiosInstance.interceptors.response.use
(
    (response) => {
        return response
    },

async (error) => {
    const originalRequest = 
error.config;

if (error.response?.status === 401 && !originalRequest._retry){
    originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error("No refresh token available");
        // Attempt to get a new access token using the refresh token
        // Note: Using standard 'axios' here to avoid an infinite loop in our interceptor
        const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`, {
          refreshToken,
        });
        // Save the new access token
        localStorage.setItem('accessToken', response.data.accessToken);
        // Update the failed request with the new token and retry it
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If the refresh token is also invalid/expired, log the user out
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;