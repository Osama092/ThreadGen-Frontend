import { useState } from 'react';
import { deleteApiKey } from 'services/keysServices';
const useDeleteApiKey = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const removeApiKey = async (key) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const data = await deleteApiKey(key); 
      setSuccessMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { removeApiKey, loading, error, successMessage };
};

export default useDeleteApiKey;
