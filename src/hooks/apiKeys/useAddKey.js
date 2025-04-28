import { useState } from 'react';
import { addApiKey } from 'services/keysServices';

const useAddApiKey = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState(null);

  const createApiKey = async (user_id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await addApiKey(user_id);
      setApiKey(data);
    } catch (err) {
      setError(err.message); 
    } finally {
      setLoading(false);
    }
  };

  return { createApiKey, loading, error, apiKey };
};

export default useAddApiKey;
