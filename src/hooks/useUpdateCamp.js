// hooks/useCampaign.js
import { useState, useCallback } from 'react';
import { 
  fetchCampaignByName, 
  updateCampaignById, 
  fetchUserCampaigns 
} from 'services/campaignService';

/**
 * Custom hook for campaign operations
 * @returns {Object} - Campaign methods and state
 */
export const useCampaign = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Get a campaign by name
   * @param {string} userId - The user ID
   * @param {string} campaignName - The campaign name
   * @returns {Object|null} - The campaign data or null
   */
  const getCampaignByName = useCallback(async (userId, campaignName) => {
    try {
      setLoading(true);
      setError(null);
      const campaign = await fetchCampaignByName(userId, campaignName);
      return campaign;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update a campaign
   * @param {string} campaignId - The campaign ID
   * @param {string} userId - The user ID
   * @param {object} campaignData - The campaign data to update
   * @returns {Object} - Response with success status and message/error
   */
  const updateCampaign = useCallback(async (campaignId, userId, campaignData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateCampaignById(campaignId, userId, campaignData);
      
      if (!result.success) {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get all campaigns for a user
   * @param {string} userId - The user ID
   * @returns {Array|null} - The campaigns or null
   */
  const getUserCampaigns = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const campaigns = await fetchUserCampaigns(userId);
      return campaigns;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getCampaignByName,
    updateCampaign,
    getUserCampaigns
  };
};