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

      console.log('EventSource opened.');

      eventSource.onmessage = (event) => {
        const newData = JSON.parse(event.data);
        setData((prevData) => [...prevData, ...newData]);
      };

      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        eventSource.close();
        console.log('EventSource closed due to error.');
      };

      // Handle closing the connection when the page is about to unload
      const handleBeforeUnload = () => {
        console.log('EventSource closed due to page unload.');
        eventSource.close();
      };

      // Add the event listener for 'beforeunload'
      window.addEventListener('beforeunload', handleBeforeUnload);

      // Cleanup function to remove the event listener and close the EventSource
      return () => {
        eventSource.close();
        console.log('EventSource closed during cleanup.');
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [user]);

  return (
    <SSEContext.Provider value={data}>
      {children}
    </SSEContext.Provider>
  );
};
