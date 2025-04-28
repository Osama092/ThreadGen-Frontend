import { useState } from 'react';
import { uploadThread } from 'services/threadsUploadService';

const useThreadUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [thread, setThread] = useState(null);

  const handleUploadThread = async (videoFile, userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('video', videoFile);
            
      if (userData) {
        if (userData.user_id) formData.append('user_id', userData.user_id);
        if (userData.user_name) formData.append('user_name', userData.user_name);
        if (userData.flow_name) formData.append('flow_name', userData.flow_name);
      }
      


      
      const data = await uploadThread(formData);
      setThread(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { uploadThread: handleUploadThread, loading, error, thread };
};

export default useThreadUpload;