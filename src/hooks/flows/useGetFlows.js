import { useState, useEffect, useCallback } from 'react';
import { getFlows } from '../../services/flowsServices';

const useGetFlows = () => {
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFlows = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFlows();
      setFlows(data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlows();
  }, [fetchFlows]);

  return { flows, loading, error, refetch: fetchFlows };
};

export default useGetFlows;
