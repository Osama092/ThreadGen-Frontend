import { useState, useEffect, useCallback } from 'react';
import { addCampaign, getCampaignsByUser, editCampaign } from 'services/campaignService';

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
        user_id: campaignData.user_id,
        apikey: campaignData.apiKey,
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

/**
 * Hook for editing an existing campaign
 * 
 * @returns {Object} State and actions for editing campaigns
 */
export const useEditCampaign = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [updatedCampaign, setUpdatedCampaign] = useState(null);

  /**
   * Edit an existing campaign
   * 
   * @param {string} campaignId - The ID of the campaign to edit
   * @param {Object} campaignData - The campaign data to update
   * @param {Function} onSuccess - Optional callback on success
   */
  const updateCampaign = async (campaignId, campaignData, onSuccess) => {
    if (!campaignId) {
      const err = new Error('Campaign ID is required');
      console.error('Error updating campaign:', err);
      return { success: false, error: err.message };
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setUpdatedCampaign(null);
    
    try {
      // Prepare data for API
      const apiData = {
        user_id: campaignData.user_id,
        campaign_name: campaignData.campaign_name,
        campaign_description: campaignData.campaign_description
      };
      
      const result = await editCampaign(campaignId, apiData);
      setUpdatedCampaign(result);
      setSuccess(true);
      
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(result);
      }
      
      return { success: true, data: result };
    } catch (err) {
      setError(err.message || 'Failed to update campaign');
      console.error('Error updating campaign:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateCampaign,
    loading,
    error,
    success,
    updatedCampaign,
    resetState: () => {
      setError(null);
      setSuccess(false);
      setUpdatedCampaign(null);
    }
  };
};

export default {
  useUserCampaigns,
  useAddCampaign,
  useEditCampaign
};