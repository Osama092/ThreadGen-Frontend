import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchPrices = async () => {
  try {
    const response = await axios.get(`${API_URL}/prices`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};