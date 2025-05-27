const getUserThreads = async (user_id) => {
  const API_URL = process.env.REACT_APP_API_URL;

  try {
    const response = await fetch(`${API_URL}/threads/get-user-threads?user_id=${user_id}`); 
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
};

export default getUserThreads;