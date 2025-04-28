import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { Box, Spinner } from '@chakra-ui/react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useAddUser } from 'hooks/users/useAddUser';

function SignUpPage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const navigate = useNavigate();
  const { postUser, loading, error } = useAddUser();

  React.useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {

        // Check if the user is new by comparing createdAt and lastSignInAt
        const timeDifference = Math.abs(user.createdAt - user.lastSignInAt);
        const isNewUser = timeDifference < 5000; // 5 seconds
        
        console.log("isNewUser", isNewUser);  
        if (isNewUser) {
          const newUserData = {
            user_id: user.id,
            full_name: user.fullName
          };

          postUser(newUserData);
        }
        // Redirect to dashboard after sign-up
        navigate('/admin/main-dashboard');
      }
    }
  }, [isLoaded, isSignedIn, navigate, user]);

  if (!isLoaded) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100vw"
      bg="#f0f0f0"
    >
      <SignUp />
    </Box>
  );
}

export default SignUpPage;
