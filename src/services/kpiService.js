import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Fetches user KPIs for a specific thread
 * @param {string} userId - The user ID
 * @param {string} threadName - The thread name to fetch KPIs for
 * @returns {Promise<Object>} - KPI data including average watch time and various rates
 */
export const fetchUserKPIs = async (userId, threadName) => {
  try {
    const response = await axios.post(`${API_URL}/player-kpi/get-user-kpis`, {
      user_id: userId,
      thread_name: threadName
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching user KPIs:', error);
    
    // Handle different error cases
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 404) {
        return {
          average_watch_time_seconds: "0.00",
          play_rate_percent: "0.00",
          completion_rate_percent: "0.00",
          replay_rate_percent: "0.00"
        };
      }
    }
    
    throw error;
  }
};