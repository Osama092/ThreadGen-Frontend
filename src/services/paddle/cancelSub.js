import axios from 'axios';

const PADDLE_API_URL_SUBSCRIPTION = 'http://localhost:5000/subscriptions';

export const cancelSubscription = async (subscriptionId) => {
  try {
    const response = await axios.post(`${PADDLE_API_URL_SUBSCRIPTION}/${subscriptionId}/cancel`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to cancel subscription');
  }
};