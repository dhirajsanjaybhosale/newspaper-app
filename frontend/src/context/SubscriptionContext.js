import React, { createContext, useState, useContext } from 'react';
import { subscriptionService } from '../services/subscriptionService';

const SubscriptionContext = createContext({});

export const SubscriptionProvider = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await subscriptionService.getMySubscriptions();
      setSubscriptions(response.data.subscriptions);
      return { success: true };
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch subscriptions',
      };
    } finally {
      setLoading(false);
    }
  };

  const createSubscription = async (subscriptionData) => {
    try {
      const response = await subscriptionService.createSubscription(subscriptionData);
      setSubscriptions([...subscriptions, response.data.subscription]);
      return { success: true, data: response.data.subscription };
    } catch (error) {
      console.error('Error creating subscription:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create subscription',
      };
    }
  };

  const cancelSubscription = async (id) => {
    try {
      await subscriptionService.cancelSubscription(id);
      setSubscriptions(subscriptions.filter((sub) => sub._id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to cancel subscription',
      };
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        loading,
        fetchSubscriptions,
        createSubscription,
        cancelSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export default SubscriptionContext;
