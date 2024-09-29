// apiService.js
import axios from 'axios';

export const generateVideo = async (apiKey, flowId, ttsText) => {
    try {

    const response = await axios.post('/generate-video', { apiKey, flowId, ttsText });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};