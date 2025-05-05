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
    
    try {
      const data = await generateVideo(apiKey, threadName, ttsText);
      
      // Update state with the result
      setVideoUrl(data.video);
      setConfigPath(data.configPath);
      
      // Return the actual response data
      return data;
    } catch (err) {
      console.error("Video generation error:", err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, error, videoUrl, configPath };
};

export default useGenerateVideo;