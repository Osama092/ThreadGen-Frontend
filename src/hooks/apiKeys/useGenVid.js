// useGenerateVideo.js
import { useState } from 'react';
import { generateVideo } from 'services/genVideoService';

const useGenerateVideo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const generate = async (apiKey, flowId, ttsText) => {
    setLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      const data = await generateVideo(apiKey, flowId, ttsText);
      setVideoUrl(data.video);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, error, videoUrl };
};

export default useGenerateVideo;