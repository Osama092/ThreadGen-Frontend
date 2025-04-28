// components/ProtectedRoute.jsx
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Center } from '@chakra-ui/react';

export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <Center h="100vh">
        <CircularProgress isIndeterminate />
      </Center>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  return children;
}