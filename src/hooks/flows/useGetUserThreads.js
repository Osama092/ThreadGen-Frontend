import { useState, useEffect } from 'react';
import getUserThreads from 'services/userThreadsService';

const useGetUserThreads = (user_id) => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await getUserThreads(user_id);
        setThreads(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (user_id) {
      fetchThreads();
    } else {
      setLoading(false);
    }
  }, [user_id]);

  return { threads, loading, error };
};

export default useGetUserThreads;