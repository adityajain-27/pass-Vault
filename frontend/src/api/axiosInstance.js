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
);