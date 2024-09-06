// src/services/servicesApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/flows'; // Update this URL based on your Express server setup

// Function to get all API keys
export const getFlows = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching flows:', error);
    throw error;
  }
};

export const getFlowById = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
};
  