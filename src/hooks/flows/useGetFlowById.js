import { useState, useEffect } from 'react';
import { getFlowById } from 'services/flowsServices';

const useFlow = (id) => {
  const [flow, setFlow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlow = async () => {
      try {
        const data = await getFlowById(id);
        setFlow(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlow();
  }, [id]);

  return { flow, loading, error };
};

export default useFlow;