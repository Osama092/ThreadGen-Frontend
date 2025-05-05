import { useState } from 'react';
import { cancelSubscription } from 'services/paddle/cancelSub';

export const useSubscriptionCancel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const handleCancelSubscription = async (subscriptionId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cancelSubscription(subscriptionId);
      setData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    data,
    handleCancelSubscription,
  };
};