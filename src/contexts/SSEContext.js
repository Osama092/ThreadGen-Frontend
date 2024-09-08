import React, { createContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

export const SSEContext = createContext();

export const SSEProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const email = user.primaryEmailAddress.emailAddress;
      const eventSource = new EventSource(`http://localhost:5000/sse-requests?email=${encodeURIComponent(email)}`);

      eventSource.onmessage = (event) => {
        const newData = JSON.parse(event.data);
        setData((prevData) => [...prevData, ...newData]);
      };

      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [user]);

  return (
    <SSEContext.Provider value={data}>
      {children}
    </SSEContext.Provider>
  );
};
