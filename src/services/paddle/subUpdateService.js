import axios from 'axios';

const PADDLE_API_URL_SUBSCRIPTION = 'http://localhost:5000/subscriptions';

export const updateSubscription = async (subscriptionId, priceId) => {
  try {
    const response = await axios.patch(`${PADDLE_API_URL_SUBSCRIPTION}/${subscriptionId}`, {
      price_id: priceId,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update subscription');
  }
};
