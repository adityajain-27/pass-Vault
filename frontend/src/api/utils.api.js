import axiosInstance from './axiosInstance';

export const checkStrength = async (password) => {
  const response = await axiosInstance.post('/utils/strength', { password });
  return response.data;
};

export const checkBreach = async (password) => {
  const response = await axiosInstance.get(`/utils/breach-check?password=${encodeURIComponent(password)}`);
  return response.data;
};
