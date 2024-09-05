// src/hooks/useDeleteApiKey.js
import { useState } from 'react';
import { deleteApiKey } from 'services/apiKeysServices';

const useDeleteApiKey = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const removeApiKey = async (id) => {
    setLoading(true);
    try {
      await deleteApiKey(id);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return { removeApiKey, loading, error };
};

export default useDeleteApiKey;
