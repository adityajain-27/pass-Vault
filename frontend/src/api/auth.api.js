import axiosInstance from './axiosInstance';

export const register = async ({ email, masterPasswordHash }) => {
    const response = await axiosInstance.post('/auth/register', { email, masterPasswordHash });
    return response.data;
};

export const login = async ({ email, masterPasswordHash }) => {
    const response = await axiosInstance.post('/auth/login', { email, masterPasswordHash });
    return response.data;
};

export const refresh = async ({ refreshToken }) => {
    const response = await axiosInstance.post('/auth/refresh', { refreshToken });
    return response.data;
};

export const logout = async ({ refreshToken }) => {
    const response = await axiosInstance.post('/auth/logout', { refreshToken });
    return response.data;
};