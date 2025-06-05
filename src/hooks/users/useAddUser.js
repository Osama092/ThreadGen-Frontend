import { useState } from 'react';
import { addUser } from 'services/userServices';

export const useAddUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const postUser = async (user) => {
    setLoading(true);
    setError(null);
    try {
      const response = await addUser(user);
      setData(response); 
      return response;
    } catch (err) {
      if (err.response) {
        // Server responded with an error
        const errorData = {
          message: err.response.data.message,
          voice_cloned: err.response.data.voice_cloned
        };
        setError(errorData);
      } else {
        setError({ message: err.message });
      }
    } finally {
      setLoading(false);
    }
  };
  
  

  return { postUser, loading, error, data };
};
