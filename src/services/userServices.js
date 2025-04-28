import axios from 'axios';

const API_URL = 'http://localhost:5000/users';

export const addUser = async (userData) => {
  try {
    // Format the user data to match what the backend expects
    const formattedUser = {
      user_id: userData.user_id, // Keep the typo to match existing backend
      full_name: userData.full_name
    };
    
    const response = await axios.post(API_URL, formattedUser);
    console.log("User added successfully:", response);
    return response.data;
    
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};