import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const updateSubscription = async (subscriptionId, priceId) => {
  try {
    const response = await axios.patch(`${API_URL}/subscriptions/${subscriptionId}`, {
      price_id: priceId,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update subscription');
  }
};
