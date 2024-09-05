// src/hooks/useAddApiKey.js
import { useState } from 'react';
import { addApiKey } from 'services/apiKeysServices';

const useAddApiKey = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addKey = async (key) => {
    setLoading(true);
    try {
      await addApiKey(key);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return { addKey, loading, error };
};

export default useAddApiKey;
