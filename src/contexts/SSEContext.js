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
        try {
          const newData = JSON.parse(event.data);
  
          if (Array.isArray(newData)) {
            setData((prevData) => [...prevData, ...newData]);
          } else {
            setData((prevData) => [...prevData, newData]);
          }
        } catch (error) {
          console.error('Error parsing event data:', error);
        }
      };
  
      eventSource.onerror = (error) => {
        eventSource.close();
      };
  
      const handleBeforeUnload = () => {
        eventSource.close();
      };
  
      window.addEventListener('beforeunload', handleBeforeUnload);
  
      return () => {
        eventSource.close();
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
