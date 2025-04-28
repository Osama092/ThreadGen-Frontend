const API_URL = 'http://localhost:3000';

// Register user with the server
export const registerUser = async (userName) => {
  try {
    const response = await fetch(`${API_URL}/sse-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_name: userName }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to register user');
    }
    
    return true;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Fetch historical messages for a user
export const fetchUserMessages = async (userName) => {
  try {
    const response = await fetch(`${API_URL}/messages/${userName}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// Create and setup SSE connection
export const createSSEConnection = (userName, onMessage, onOpen, onError) => {
  const eventSource = new EventSource(`${API_URL}/register-user?user_name=${userName}`);
  
  if (onOpen) {
    eventSource.onopen = onOpen;
  }
  
  if (onMessage) {
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };
  }
  
  if (onError) {
    eventSource.onerror = onError;
  }
  
  return eventSource;
};