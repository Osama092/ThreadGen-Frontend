import { useState, useEffect, useCallback } from 'react';
import { addCampaign, getCampaignsByUser } from 'services/campaignService';

/**
 * Hook for fetching user campaigns
 * 
 * @param {string} userId - The ID of the user
 * @returns {Object} State and actions for campaigns
 */
export const useUserCampaigns = (userId) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch campaigns for the user
   */
  const fetchCampaigns = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getCampaignsByUser(userId);
      setCampaigns(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch campaigns');
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch campaigns on mount and when userId changes
  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    campaigns,
    loading,
    error,
    refetch: fetchCampaigns
  };
};

/**
 * Hook for creating a new campaign
 * 
 * @returns {Object} State and actions for creating campaigns
 */
export const useAddCampaign = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [newCampaign, setNewCampaign] = useState(null);

  /**
   * Create a new campaign
   * 
   * @param {Object} campaignData - The campaign data
   * @param {Function} onSuccess - Optional callback on success
   */
  const createCampaign = async (campaignData, onSuccess) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setNewCampaign(null);
    
    try {
      // Transform file data for API if needed
      let tts_text_list = [];
      
      // If there's file data with names, use it for tts_text_list
      if (campaignData.fileData && campaignData.fileData.namesColumn) {
        tts_text_list = campaignData.fileData.names;
      }
      
      // Prepare data for API
      const apiData = {
        campaign_name: campaignData.name,
        campaign_description: campaignData.description,
        user_id: campaignData.user_id, // Fixed: use user_id instead of userId
        thread_name: campaignData.threadName,
        tts_text_list
      };
      
      const result = await addCampaign(apiData);
      setNewCampaign(result);
      setSuccess(true);
      
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to create campaign');
      console.error('Error creating campaign:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCampaign,
    loading,
    error,
    success,
    newCampaign,
    resetState: () => {
      setError(null);
      setSuccess(false);
      setNewCampaign(null);
    }
  };
};

export default {
  useUserCampaigns,
  useAddCampaign
};