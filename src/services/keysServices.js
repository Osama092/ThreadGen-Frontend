import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Function to get all API keys for a specific user
export const getKeysService = async (userId) => {
  try {
    const response = await fetch(`/api-keys/get-user-api-keys?user_id=${userId}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};



export const addApiKey = async (user_id) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api-keys/add-key`, { user_id });
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data || 'Error adding API key'); 
  }
};

export const deleteApiKey = async (key) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api-keys/delete-key/${key}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Error deleting API key');
  }
};






