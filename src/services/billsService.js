import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;


export const getSubscriptions = async () => {
  try {
    const response = await axios.get(`${API_URL}/subscriptions`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch subscriptions');
  }
};