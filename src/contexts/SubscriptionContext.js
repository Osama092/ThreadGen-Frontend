import React, { createContext, useState, useEffect } from 'react';
import { getSubscriptions } from 'services/billsService';

export const SubscriptionsContext = createContext();

export const SubscriptionsProvider = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const data = await getSubscriptions();
        setSubscriptions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  return (
    <SubscriptionsContext.Provider value={{ subscriptions, loading, error }}>
      {children}
    </SubscriptionsContext.Provider>
  );
};