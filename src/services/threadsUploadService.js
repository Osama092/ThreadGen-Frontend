import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const uploadThread = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/threads/upload-thread`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error uploading thread');
  }
};