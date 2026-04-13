import axiosInstance from './axiosInstance';

export const getEntries = async () => {
  const response = await axiosInstance.get('/vault');
  return response.data;
};

export const createEntry = async ({ label, encryptedData, category, isFavorite }) => {
  const response = await axiosInstance.post('/vault', { 
    label, 
    encryptedData, 
    category, 
    isFavorite 
  });
  return response.data;
};

export const updateEntry = async (id, data) => {
  const response = await axiosInstance.put(`/vault/${id}`, data);
  return response.data;
};

export const deleteEntry = async (id) => {
  const response = await axiosInstance.delete(`/vault/${id}`);
  return response.data;
};

// Security and Analytics helpers (Keeper Style)
export const getVaultHealth = async () => {
    const entries = await getEntries();
    // In a real Keeper app, this would be a backend aggregation, 
    // but we can calculate it client-side for immediate feedback
    return entries; 
};
