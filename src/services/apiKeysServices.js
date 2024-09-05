// src/services/servicesApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api-keys'; // Update this URL based on your Express server setup

// Function to get all API keys
export const getApiKeys = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching API keys:', error);
    throw error;
  }
};

// Function to delete an API key by ID
export const deleteApiKey = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting API key with ID ${id}:`, error);
    throw error;
  }
};

// Function to add a new API key
export const addApiKey = async (key) => {
  try {
    const response = await axios.post(API_BASE_URL, { key });
    return response.data;
  } catch (error) {
    console.error('Error adding new API key:', error);
    throw error;
  }
};
