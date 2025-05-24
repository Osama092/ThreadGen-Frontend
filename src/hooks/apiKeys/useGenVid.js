import { useState } from 'react';
import { generateVideo } from 'services/genVideoService';
import { useToast } from '@chakra-ui/react';

const useGenerateVideo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [configPath, setConfigPath] = useState(null);
  const [remainingTries, setRemainingTries] = useState(null);
  const toast = useToast();

  const generate = async (apiKey, threadName, ttsText) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await generateVideo(apiKey, threadName, ttsText);
      
      // Update state with the result
      setVideoUrl(data.video);
      setConfigPath(data.configPath);
      setRemainingTries(data.remainingTries);
      
      // Show success toast with remaining tries
      toast({
        title: "Video Generated Successfully",
        description: `Remaining tries: ${data.remainingTries || 'N/A'}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      // Return the actual response data
      return data;
    } catch (err) {
      console.error("Video generation error:", err);
      
      // Check if it's a usage limit exceeded error (429 status)
      if (err.status === 429 || (err.error && err.error === 'Usage limit exceeded')) {
        toast({
          title: "Usage Limit Exceeded",
          description: err.message || `You have reached your usage limit. Current usage: ${err.currentUsage}/${err.limit}`,
          status: "error",
          duration: 8000,
          isClosable: true,
        });
      } else if (err.status === 400) {
        // Handle other 400 errors
        let description = err.message || err.error || "Bad request";
        toast({
          title: "Request Error",
          description: description,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else if (err.status === 403) {
        // Handle forbidden errors
        toast({
          title: "Access Denied",
          description: err.message || err.error || "You don't have permission to access this resource",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Handle other errors
        toast({
          title: "Generation Failed",
          description: err.message || err.error || "An unexpected error occurred",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, error, videoUrl, configPath, remainingTries };
};

export default useGenerateVideo;