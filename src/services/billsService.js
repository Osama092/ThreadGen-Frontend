import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Replace with your actual backend URL


const getBills = async (user) => {
  try {
    const response = await axios.get(`${API_URL}/bills/${user}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default { getBills };

export const getSubscriptions = async () => {
  try {
    const response = await axios.get(`${API_URL}/subscriptions`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch subscriptions');
  }
};