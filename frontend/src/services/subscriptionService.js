import api from './api';

export const subscriptionService = {
  getAllSubscriptions: async () => {
    const response = await api.get('/subscriptions');
    return response.data;
  },

  getSubscription: async (id) => {
    const response = await api.get(`/subscriptions/${id}`);
    return response.data;
  },

  createSubscription: async (subscriptionData) => {
    const response = await api.post('/subscriptions', subscriptionData);
    return response.data;
  },

  updateSubscription: async (id, subscriptionData) => {
    const response = await api.patch(`/subscriptions/${id}`, subscriptionData);
    return response.data;
  },

  cancelSubscription: async (id) => {
    const response = await api.delete(`/subscriptions/${id}`);
    return response.data;
  },

  getMySubscriptions: async () => {
    const response = await api.get('/users/my-subscriptions');
    return response.data;
  },
};
