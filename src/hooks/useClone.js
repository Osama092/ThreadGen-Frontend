// src/hooks/useAudioCloning.js
import { useState } from 'react';
import { cloneAudio } from 'services/clonedService';

const useAudioCloning = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const cloneUserAudio = async (email, text) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cloneAudio(email, text);
      setSuccess(result.message);
    } catch (err) {
      setError(err.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { cloneUserAudio, loading, error, success };
};

export default useAudioCloning;
