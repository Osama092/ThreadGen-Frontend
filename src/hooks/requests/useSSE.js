// src/hooks/useSSE.js
import { useState, useEffect, useRef } from 'react';
import { getSSEUrl } from 'services/requestServices';

const useSSE = () => {
  const [data, setData] = useState(null);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    const url = getSSEUrl();
    eventSourceRef.current = new EventSource(url);

    eventSourceRef.current.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setData(parsedData);
    };

    eventSourceRef.current.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSourceRef.current.close();
    };

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return data;
};

export default useSSE;