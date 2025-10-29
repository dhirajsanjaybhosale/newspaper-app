import api from './api';

export const paymentService = {
  createOrder: async (subscriptionId) => {
    const response = await api.post('/payments/create-order', { subscriptionId });
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await api.post('/payments/verify', paymentData);
    return response.data;
  },

  getPaymentDetails: async (subscriptionId) => {
    const response = await api.get(`/payments/${subscriptionId}`);
    return response.data;
  },
};
