import { useState, useEffect } from 'react';
import { getUserById } from 'services/userServices';

const useGetUser = (user_id) => {
  const [logedUser, setUser] = useState(null);
  const [logedUserLoading, setLoading] = useState(false);
  const [logedUserError, setError] = useState(null);

  useEffect(() => {
    if (!user_id) return;

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserById(user_id);
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user_id]);

  return { logedUser, logedUserLoading, logedUserError};
};

export default useGetUser;
