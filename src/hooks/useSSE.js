// src/hooks/useSSE.js
import { useState, useEffect } from 'react';

/**
 * Custom hook to handle Server-Sent Events (SSE) connections
 * @param {string} userId - The user ID to subscribe with
 * @param {string} baseUrl - Base API URL
 * @returns {Object} - Connection state and message data
 */
const useSSE = (userId, baseUrl = process.env.REACT_APP_API_URL) => {
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user and fetch historical data
  useEffect(() => {
    if (!userId) return;
    
    const initializeUser = async () => {
      setIsLoading(true);
      try {
        // Register the user for SSE
        const registerResponse = await fetch(`${baseUrl}/register-user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId }),
        });
        
        if (!registerResponse.ok) {
          throw new Error('Failed to register user');
        }
        
        // Fetch historical requests for this user
        const requestsResponse = await fetch(`${baseUrl}/requests/${userId}`);
        
        if (!requestsResponse.ok) {
          throw new Error('Failed to fetch requests');
        }
        
        const historicalRequests = await requestsResponse.json();
        setMessages(historicalRequests);
        console.log(`Loaded ${historicalRequests.length} historical requests`);
      } catch (error) {
        console.error('Initialization error:', error);
        setConnectionStatus('Failed to connect');
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, [userId, baseUrl]);

  // Subscribe to SSE updates
  useEffect(() => {
    if (!userId) return;

    const eventSource = new EventSource(`${baseUrl}/subscribe?user_id=${userId}`);

    eventSource.onopen = () => {
      setConnectionStatus('Connected ✅');
    };

    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newData]);
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      setConnectionStatus('Disconnected ❌');
      eventSource.close();
    };

    return () => {
      eventSource.close();
      setConnectionStatus('Disconnected ❌');
    };
  }, [userId, baseUrl]);

  return {
    messages,
    connectionStatus,
    isLoading
  };
};

export default useSSE;