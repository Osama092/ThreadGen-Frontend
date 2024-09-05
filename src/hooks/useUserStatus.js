import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const useUserStatus = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log("User is logged in:", user);
    } else {
      console.log("User is not logged in");
      navigate('/sign-in'); // Redirects to the sign-in page
    }
  }, [user, navigate]);
};

export default useUserStatus;
