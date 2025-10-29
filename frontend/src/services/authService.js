import api from './api';

export const authService = {
  signup: async (userData) => {
    const response = await api.post('/users/signup', userData);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.get('/users/logout');
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/users/forgotPassword', { email });
    return response.data;
  },

  resetPassword: async (token, password, passwordConfirm) => {
    const response = await api.patch(`/users/resetPassword/${token}`, {
      password,
      passwordConfirm,
    });
    return response.data;
  },

  updatePassword: async (passwordCurrent, password, passwordConfirm) => {
    const response = await api.patch('/users/updateMyPassword', {
      passwordCurrent,
      password,
      passwordConfirm,
    });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateMe: async (userData) => {
    const response = await api.patch('/users/updateMe', userData);
    return response.data;
  },
};
