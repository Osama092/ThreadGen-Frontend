import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Update with your backend URL

export const fetchPrices = async () => {
  try {
    const response = await axios.get(`${API_URL}/prices`);
    return response.data.data; // Assuming data is under the 'data' key
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw error;
  }
};