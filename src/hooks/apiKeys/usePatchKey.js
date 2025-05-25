import { useState } from 'react';
import { patchApiKey } from 'services/keysServices';

const usePatchApiKey = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const softDeleteApiKey = async (key) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const data = await patchApiKey(key); 
      setSuccessMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { softDeleteApiKey, loading, error, successMessage };
};

export default usePatchApiKey;