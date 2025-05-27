import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const getKeysService = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api-keys/get-user-api-keys?user_id=${userId}`);
    
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


export const patchApiKey = async (key) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/api/keys/${key}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Error marking API key as deleted');
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






