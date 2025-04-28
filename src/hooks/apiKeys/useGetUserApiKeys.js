import { useState, useEffect, useCallback } from 'react';
import { getKeysService } from 'services/keysServices';

const useGetUserApiKeys = (userId) => {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchKeys = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await getKeysService(userId);
      setKeys(response);    
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  return { keys, loading, error, fetchKeys };
};

export default useGetUserApiKeys;