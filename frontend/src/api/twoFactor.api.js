import axiosInstance from './axiosInstance';

export const get2FAStatus = () => axiosInstance.get('/auth/2fa/status');
export const setup2FA = () => axiosInstance.post('/auth/2fa/setup');
export const enable2FA = (token) => axiosInstance.post('/auth/2fa/enable', { token });
export const disable2FA = (token) => axiosInstance.post('/auth/2fa/disable', { token });
