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

  const fetchCampaigns = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getCampaignsByUser(userId);
      setCampaigns(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  }, [userId]);

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
 */
export const useAddCampaign = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [newCampaign, setNewCampaign] = useState(null);

  const createCampaign = async (campaignData, onSuccess) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setNewCampaign(null);

    try {
      let tts_text_list = [];

      if (campaignData.fileData) {
        let textData = [];

        if (campaignData.fileData.columnData && Array.isArray(campaignData.fileData.columnData)) {
          textData = campaignData.fileData.columnData;
        } else if (
          campaignData.fileData.allData &&
          Array.isArray(campaignData.fileData.allData) &&
          campaignData.fileData.selectedColumn
        ) {
          textData = campaignData.fileData.allData
            .map(row => row[campaignData.fileData.selectedColumn])
            .filter(Boolean);
        } else if (campaignData.fileData.allData && Array.isArray(campaignData.fileData.allData)) {
          textData = campaignData.fileData.allData;
        } else if (campaignData.fileData.names && Array.isArray(campaignData.fileData.names)) {
          textData = campaignData.fileData.names;
        } else {
          throw new Error('No valid data source found in uploaded file. Please check your file format.');
        }

        if (!textData || textData.length === 0) {
          throw new Error('No text data found in uploaded file. Please check your file format and selected column.');
        }

        tts_text_list = textData.map((item, index) => {
          let textValue;

          if (typeof item === 'string') {
            textValue = item;
          } else if (typeof item === 'object' && item !== null) {
            textValue = item.text || item.name || item.value || Object.values(item)[0] || `Item ${index + 1}`;
          } else if (item !== null && item !== undefined) {
            textValue = String(item);
          } else {
            textValue = `Item ${index + 1}`;
          }

          const cleanTextValue = String(textValue).trim();

          if (typeof cleanTextValue !== 'string' || cleanTextValue.length === 0) {
            return null;
          }

          return cleanTextValue;
        }).filter(Boolean);

        if (tts_text_list.length === 0) {
          throw new Error('No valid text data found after processing. Please check your file content.');
        }

        const invalidItems = tts_text_list.filter(item => typeof item !== 'string');
        if (invalidItems.length > 0) {
          throw new Error(`Invalid text data: ${invalidItems.length} items have non-string values`);
        }
      } else {
        throw new Error('No file data provided. Please upload a file.');
      }

      const apiData = {
        campaign_name: campaignData.name,
        campaign_description: campaignData.description,
        user_id: campaignData.user_id,
        apikey: campaignData.apiKey,
        thread_name: campaignData.threadName,
        tts_text_list
      };

      const requiredFields = ['campaign_name', 'user_id', 'apikey', 'thread_name'];
      const missingFields = requiredFields.filter(field => !apiData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const result = await addCampaign(apiData);

      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response from server');
      }

      setNewCampaign(result);
      setSuccess(true);

      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      const errorMessage = err.message || 'Failed to create campaign';
      setError(errorMessage);
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
 */
export const useEditCampaign = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [updatedCampaign, setUpdatedCampaign] = useState(null);

  const updateCampaign = async (campaignId, campaignData, onSuccess) => {
    if (!campaignId) {
      const err = new Error('Campaign ID is required');
      return { success: false, error: err.message };
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setUpdatedCampaign(null);

    try {
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
      const errorMessage = err.message || 'Failed to update campaign';
      setError(errorMessage);
      return { success: false, error: errorMessage };
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
