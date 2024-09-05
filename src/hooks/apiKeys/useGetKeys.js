import { useState, useEffect, useCallback } from 'react';
import { getApiKeys } from 'services/apiKeysServices';

const useGetApiKeys = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApiKeys = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getApiKeys();
      setApiKeys(data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  return { apiKeys, loading, error, refetch: fetchApiKeys };
};

export default useGetApiKeys;
