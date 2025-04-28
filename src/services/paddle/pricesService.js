import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const fetchPrices = async () => {
  try {
    const response = await axios.get(`${API_URL}/prices`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};