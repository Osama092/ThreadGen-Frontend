import axios from 'axios';

const PADDLE_API_URL_SUBSCRIPTION = 'http://localhost:5000/subscriptions'; // Backend API URL

export const updateSubscription = async (subscriptionId, priceId) => {
  try {
    const response = await axios.patch(`${PADDLE_API_URL_SUBSCRIPTION}/${subscriptionId}`, {
      price_id: priceId, // Send priceId in the request body
    });
    return response.data; // Return the response from your backend
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw new Error('Failed to update subscription');
  }
};
