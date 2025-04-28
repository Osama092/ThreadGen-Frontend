import { useState } from 'react';
import { addThread } from 'services/addThreadService';

const useAddThread = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [thread, setThread] = useState(null);

  const handleAddThread = async (startThumbnailFile, pauseThumbnailFile, endThumbnailFile, userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
        formData.append('start_thumbnail', startThumbnailFile);
        formData.append('pause_thumbnail', pauseThumbnailFile);
        formData.append('end_thumbnail', endThumbnailFile);
            
      if (userData) {
          if (userData.session_id) formData.append('session_id', userData.session_id);
          if (userData.user_id) formData.append('user_id', userData.user_id);
          if (userData.user_name) formData.append('user_name', userData.user_name);
          if (userData.thread_name) formData.append('thread_name', userData.thread_name);
          if (userData.description) formData.append('description', userData.description);
          if (userData.ttsText) formData.append('ttsText', userData.ttsText);
          if (userData.smart_pause) formData.append('smart_pause', userData.smart_pause.toString());
          if (userData.fast_progress) formData.append('fast_progress', userData.fast_progress.toString());
          if (userData.subtitle) formData.append('subtitle', userData.subtitle.toString());
          if (userData.color) formData.append('color', userData.color);
      }
      
      
      const data = await addThread(formData);
      setThread(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addThread: handleAddThread, loading, error, thread };
};

export default useAddThread;