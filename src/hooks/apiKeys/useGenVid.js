import { useState } from 'react';
import { generateVideo } from 'services/genVideoService';

const useGenerateVideo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [configPath, setConfigPath] = useState(null);

  const generate = async (apiKey, threadName, ttsText) => {
    setLoading(true);
    setError(null);
    setVideoUrl(null);
    setConfigPath(null);

    try {
      const data = await generateVideo(apiKey, threadName, ttsText);
      setVideoUrl(data.video);
      setConfigPath(data.configPath);
      return data; // Return the data so it's available in the calling function
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, error, videoUrl, configPath };
};

export default useGenerateVideo;