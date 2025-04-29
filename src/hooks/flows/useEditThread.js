// hooks/flows/useEditThread.js
import { useState } from 'react';
import { threadApi } from 'services/editThreadService';
import { useUser } from '@clerk/clerk-react';
import { useToast } from '@chakra-ui/react';

export const useUpdateThread = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const toast = useToast();

  const update = async ({ threadId, thread_name, description }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (!threadId || !thread_name || !description) {
        throw new Error('Missing required fields');
      }
      
      // Prepare the request data
      const requestData = {
        _id: threadId,
        user_id: user?.id,
        thread_name,
        description
      };
      
      // Make the API call
      const result = await threadApi.updateThread(requestData);
      
      // Show success toast with additional info if thread name was changed
      const wasThreadNameChanged = result.old_thread_name && result.old_thread_name !== thread_name;
      toast({
        title: 'Thread updated',
        description: wasThreadNameChanged 
          ? `Your flow details have been updated successfully. Thread name changed from "${result.old_thread_name}" to "${thread_name}".`
          : 'Your flow details have been updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      return result;
    } catch (err) {
      // Handle error
      const errorMessage = err.details || err.message || 'Failed to update thread';
      setError(errorMessage);
      
      // Show error toast
      toast({
        title: 'Update failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { update, isLoading, error };
};