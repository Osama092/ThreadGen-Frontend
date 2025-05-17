import { useState, useEffect } from 'react';
import { fetchUserKPIs } from 'services/kpiService';

/**
 * Custom hook to fetch and manage thread KPI data
 * @param {string} userId - The user ID
 * @param {string} threadName - The thread name to fetch KPIs for
 * @returns {Object} - KPI data and loading/error states
 */
export const useKPIs = (userId, threadName) => {
  const [kpiData, setKpiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadKPIs = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchUserKPIs(userId, threadName); // threadName might be undefined
        setKpiData(data);
      } catch (err) {
        console.error('Error in useKPIs hook:', err);
        setError(err.message || 'Failed to load KPI data');
      } finally {
        setIsLoading(false);
      }
    };

    loadKPIs();
  }, [userId, threadName]);


  /**
   * Format seconds to MM:SS format
   * @param {string|number} seconds - Seconds as string or number
   * @returns {string} - Formatted time string
   */
  const formatWatchTime = (seconds) => {
    if (!seconds) return '0:00';
    
    const totalSeconds = parseFloat(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = Math.floor(totalSeconds % 60);
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    kpiData,
    isLoading,
    error,
    formattedWatchTime: kpiData ? formatWatchTime(kpiData.average_watch_time_seconds) : '0:00'
  };
};