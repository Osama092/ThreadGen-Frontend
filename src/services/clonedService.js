// src/services/audioCloningService.js
import axios from 'axios';

export const cloneAudio = async (email, text) => {
  try {
    const response = await axios.post(`/audio-cloning/${email}`, { text });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};
