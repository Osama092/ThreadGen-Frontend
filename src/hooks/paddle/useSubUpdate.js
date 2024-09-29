// hooks/useUpdateSubscription.js
import { useState } from 'react';
import { updateSubscription } from 'services/paddle/subUpdateService';

export const useUpdateSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const handleUpdateSubscription = async (subscriptionId, priceId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateSubscription(subscriptionId, priceId);
      setData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    data,
    handleUpdateSubscription,
  };
};
