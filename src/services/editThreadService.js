// services/api/threadApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const threadApi = {
  /**
   * Update an existing thread
   * @param {Object} threadData - Thread data to update
   * @param {string} threadData._id - Thread ID
   * @param {string} threadData.user_id - User ID
   * @param {string} threadData.thread_name - Thread name
   * @param {string} threadData.description - Thread description
   * @returns {Promise} - Response from the API
   */
  updateThread: async (threadData) => {
    try {
      const response = await axios.put(`${API_URL}/threads/edit-thread`, threadData);
      return response.data;
    } catch (error) {
      console.error('Error updating thread:', error);
      throw error.response?.data || error.message;
    }
  }
};