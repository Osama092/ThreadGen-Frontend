import axios from 'axios';
const API_BASE_URL = 'http://localhost:5000';



export const cloneAudio = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/clone-audio`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error uploading thread');
  }
};