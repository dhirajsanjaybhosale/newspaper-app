import api from './api';

export const newspaperService = {
  getAllNewspapers: async () => {
    const response = await api.get('/newspapers');
    return response.data;
  },

  getNewspaper: async (id) => {
    const response = await api.get(`/newspapers/${id}`);
    return response.data;
  },

  searchNewspapers: async (query) => {
    const response = await api.get(`/newspapers?search=${query}`);
    return response.data;
  },
};
