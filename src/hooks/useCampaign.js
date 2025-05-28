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
      console.log('✅ Fetched campaigns from backend:', data);
      setCampaigns(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch campaigns');
      console.error('❌ Error fetching campaigns:', err);
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
    console.log('🚀 Starting campaign creation with data:', campaignData);

    setLoading(true);
    setError(null);
    setSuccess(false);
    setNewCampaign(null);

    try {
      // Debug: Log the incoming file data structure
      console.log('📁 File data received:', campaignData.fileData);

      let tts_text_list = [];

      if (campaignData.fileData) {
        console.log('🔍 Processing file data:', campaignData.fileData);
        console.log('🔍 Available properties:', Object.keys(campaignData.fileData));

        let textData = [];

        // FIXED: Use the correct data source priority
        // 1. First priority: Use columnData which contains all data from selected column
        if (campaignData.fileData.columnData && Array.isArray(campaignData.fileData.columnData)) {
          textData = campaignData.fileData.columnData;
          console.log('✅ Using fileData.columnData (all selected column data):', textData.length, 'items');
        }
        // 2. Second priority: Extract from allData using selectedColumn
        else if (campaignData.fileData.allData && Array.isArray(campaignData.fileData.allData) && campaignData.fileData.selectedColumn) {
          textData = campaignData.fileData.allData
            .map(row => row[campaignData.fileData.selectedColumn])
            .filter(Boolean);
          console.log('✅ Extracted from fileData.allData using selectedColumn:', textData.length, 'items');
        }
        // 3. Third priority: Use allData if it's an array of strings
        else if (campaignData.fileData.allData && Array.isArray(campaignData.fileData.allData)) {
          textData = campaignData.fileData.allData;
          console.log('✅ Using fileData.allData directly:', textData.length, 'items');
        }
        // 4. Fallback: Legacy support for other formats
        else if (campaignData.fileData.names && Array.isArray(campaignData.fileData.names)) {
          textData = campaignData.fileData.names;
          console.log('✅ Using fileData.names (legacy):', textData.length, 'items');
        }
        // 5. Last resort fallback
        else {
          console.warn('⚠️ No suitable data source found. Available keys:', Object.keys(campaignData.fileData));
          
          // Generate error instead of using preview data
          throw new Error('No valid data source found in uploaded file. Please check your file format.');
        }

        // Validate that we have data
        if (!textData || textData.length === 0) {
          throw new Error('No text data found in uploaded file. Please check your file format and selected column.');
        }

        console.log('📊 Total text items found:', textData.length);

        // Transform to tts_text_list structure - send the text as a string directly
        tts_text_list = textData.map((item, index) => {
          let textValue;

          if (typeof item === 'string') {
            textValue = item;
          } else if (typeof item === 'object' && item !== null) {
            // If it's an object, extract the text value
            textValue = item.text || item.name || item.value || Object.values(item)[0] || `Item ${index + 1}`;
          } else if (item !== null && item !== undefined) {
            textValue = String(item);
          } else {
            textValue = `Item ${index + 1}`;
          }

          const cleanTextValue = String(textValue).trim();

          // Validate that text is actually a string
          if (typeof cleanTextValue !== 'string' || cleanTextValue.length === 0) {
            console.warn(`⚠️ Skipping invalid item ${index + 1}:`, item);
            return null;
          }

          return cleanTextValue;
        }).filter(Boolean); // Remove null values

        console.log('📋 Final tts_text_list prepared:', tts_text_list.length, 'valid items');

        // Log first few and last few items for verification
        if (tts_text_list.length > 0) {
          console.log('📝 First 3 items:', tts_text_list.slice(0, 3));
          if (tts_text_list.length > 3) {
            console.log('📝 Last 3 items:', tts_text_list.slice(-3));
          }
        }

        // Final validation
        if (tts_text_list.length === 0) {
          throw new Error('No valid text data found after processing. Please check your file content.');
        }

        // Additional validation to ensure all items are strings
        const invalidItems = tts_text_list.filter(item => typeof item !== 'string');
        if (invalidItems.length > 0) {
          console.error('❌ Found invalid text items (non-string values):', invalidItems);
          throw new Error(`Invalid text data: ${invalidItems.length} items have non-string values`);
        }

      } else {
        console.warn('⚠️ No file data found in campaign data');
        throw new Error('No file data provided. Please upload a file.');
      }

      // Prepare data for API - match backend expectations exactly
      const apiData = {
        campaign_name: campaignData.name,
        campaign_description: campaignData.description,
        user_id: campaignData.user_id,
        apikey: campaignData.apiKey,
        thread_name: campaignData.threadName,
        tts_text_list // This should now be an array of strings with ALL data
      };

      console.log('📤 Sending API data with', tts_text_list.length, 'text items');
      console.log('🔢 Sample of first 5 items being sent:', tts_text_list.slice(0, 5));

      // Validate required fields before sending
      const requiredFields = ['campaign_name', 'user_id', 'apikey', 'thread_name'];
      const missingFields = requiredFields.filter(field => !apiData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const result = await addCampaign(apiData);
      console.log('✅ Campaign created successfully with', tts_text_list.length, 'items');

      // Validate the response structure
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response from server');
      }

      setNewCampaign(result);
      setSuccess(true);

      if (onSuccess && typeof onSuccess === 'function') {
        console.log('🎉 Calling success callback with result:', result);
        onSuccess(result);
      }

      return result;
    } catch (err) {
      const errorMessage = err.message || 'Failed to create campaign';
      console.error('❌ Error creating campaign:', err);
      console.error('❌ Error details:', {
        message: errorMessage,
        stack: err.stack,
        campaignData: campaignData
      });

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
      console.log('🔄 Resetting campaign creation state');
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
   * @param {string} campaignId - The ID of the campaign to edit (_id from MongoDB)
   * @param {Object} campaignData - The campaign data to update
   * @param {Function} onSuccess - Optional callback on success
   */
  const updateCampaign = async (campaignId, campaignData, onSuccess) => {
    if (!campaignId) {
      const err = new Error('Campaign ID is required');
      console.error('❌ Error updating campaign:', err);
      return { success: false, error: err.message };
    }

    console.log('🔄 Starting campaign update:', { campaignId, campaignData });

    setLoading(true);
    setError(null);
    setSuccess(false);
    setUpdatedCampaign(null);

    try {
      // Prepare data for API - match backend expectations
      const apiData = {
        user_id: campaignData.user_id,
        campaign_name: campaignData.campaign_name,
        campaign_description: campaignData.campaign_description
      };

      console.log('📤 Sending update data:', apiData);

      const result = await editCampaign(campaignId, apiData);
      console.log('✅ Campaign updated successfully:', result);

      setUpdatedCampaign(result);
      setSuccess(true);

      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(result);
      }

      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update campaign';
      console.error('❌ Error updating campaign:', err);
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
      console.log('🔄 Resetting campaign update state');
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