import { useState, useEffect, useCallback } from 'react';
import getUserThreads from 'services/userThreadsService';

const useGetUserThreads = (user_id) => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchThreads = useCallback(async () => {
    if (!user_id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getUserThreads(user_id);
      setThreads(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user_id]);

  // Refetch function that can be called manually
  const refetchThreads = useCallback(async () => {
    await fetchThreads();
  }, [fetchThreads]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  return { threads, loading, error, refetchThreads };
};

export default useGetUserThreads;