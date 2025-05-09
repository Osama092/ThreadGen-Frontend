import { useState } from 'react';
import { cloneAudio } from 'services/clonedService';


const useAudioCloning = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audio, setAudio] = useState(null);

  const cloneUserAudio = async (audioFile, userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
            
      if (userData) {
        if (userData.user_id) formData.append('user_id', userData.user_id);
        if (userData.user_name) formData.append('user_name', userData.user_name);
      }
      
      
      const data = await cloneAudio(formData);
      setAudio(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { cloneAudio: cloneUserAudio, loading, error, audio };
};

export default useAudioCloning;