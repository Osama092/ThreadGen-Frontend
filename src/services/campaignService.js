/**
 * Service for handling campaign-related API calls
 */
import axios from 'axios';

// Create a base axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds
});

/**
 * Add a new campaign
 * 
 * @param {Object} campaignData - The campaign data to add
 * @param {string} campaignData.campaign_name - Name of the campaign
 * @param {string} campaignData.campaign_description - Description of the campaign
 * @param {string} campaignData.user_id - ID of the user creating the campaign
 * @param {string} campaignData.thread_name - Name of the thread to use
 * @param {Array} campaignData.tts_text_list - List of text items for text-to-speech
 * @returns {Promise<Object>} The created campaign data
 */
export const addCampaign = async (campaignData) => {
  try {
    const response = await api.post('/campaigns/add-campaign', campaignData);
    return response.data;
  } catch (error) {
    console.error('Error in addCampaign service:', error);
    
    // Extract error message from axios error response
    const errorMessage = error.response?.data || error.message || 'Failed to add campaign';
    throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
  }
};

/**
 * Get all campaigns for a specific user
 * 
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} List of campaigns for the user
 */
export const getCampaignsByUser = async (userId) => {
  try {
    const response = await api.get(`/campaigns/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error in getCampaignsByUser service:', error);
    
    // Extract error message from axios error response
    const errorMessage = error.response?.data || error.message || 'Failed to get campaigns';
    throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
  }
};

export default {
  addCampaign,
  getCampaignsByUser,
};