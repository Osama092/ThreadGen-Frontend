import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const cancelSubscription = async (subscriptionId) => {
  try {
    const response = await axios.post(`${API_URL}/subscriptions/${subscriptionId}/cancel`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to cancel subscription');
  }
};
