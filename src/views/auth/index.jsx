import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Box, Spinner } from '@chakra-ui/react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

function SignInPage() {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // User is signed in; redirect to a different page, such as a dashboard
        navigate('/');
      }
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    // Show a loading spinner or any loading state while Clerk is checking authentication status
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
      <SignIn />
    </Box>
  );
}

export default SignInPage;
