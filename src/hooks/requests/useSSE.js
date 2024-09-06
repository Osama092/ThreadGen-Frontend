// useSSE.js
import { useState, useEffect } from 'react';

const useSSE = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    eventSource.onerror = () => {
      setError('Error connecting to SSE endpoint');
    };

    return () => {
      eventSource.close();
    };
  }, [url]);

  return [data, error];
};

export default useSSE;