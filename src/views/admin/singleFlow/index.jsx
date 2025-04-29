import React, { useState, useRef, useEffect, useCallback } from "react";
import MiniStatistics from "components/card/MiniStatistics";
import { Box, Button, Input, Grid, GridItem, Text, useColorModeValue, SimpleGrid, Card, CardBody, Heading, useToast } from "@chakra-ui/react";
import ComplexTable from "views/admin/singleFlow/components/ComplexTable";
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useUpdateThread } from 'hooks/flows/useEditThread';

export default function SingleFlow() {
  const nameInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [threadData, setThreadData] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const toast = useToast();

  // Key to force ComplexTable re-render
  const [tableKey, setTableKey] = useState(0);
  
  // Function to refresh the ComplexTable
  const refreshTable = useCallback(() => {
    setTableKey(prevKey => prevKey + 1);
  }, []);

  const location = useLocation();
  const { thread } = location.state || {};
  const { update, isLoading, error } = useUpdateThread();

  const [isEditing, setIsEditing] = useState(false);
  
  // Handle case when thread data is not available
  useEffect(() => {
    if (!thread) {
      // Redirect to flows management if no thread data
      navigate('/admin/flowsManagement');
      return;
    }
    
    setThreadData(thread);
  }, [thread, navigate]);

  const handleToggle = async () => {
    if (!isEditing) {
      // Enter edit mode
      setIsEditing(true);
      setIsReadOnly(false);
      setTimeout(() => {
        nameInputRef.current.focus();
      }, 0);
    } else {
      // Save changes
      if (!threadData.thread_name.trim()) {
        toast({
          title: "Error",
          description: "Thread name cannot be empty",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      try {
        const result = await update({
          threadId: threadData._id,
          thread_name: threadData.thread_name,
          description: threadData.description,
        });
        
        console.log("Update successful:", result);
        
        // Exit edit mode
        setIsEditing(false);
        setIsReadOnly(true);
        
        // Check if thread name was changed and refresh the table
        if (result.old_thread_name && result.old_thread_name !== threadData.thread_name) {
          console.log("Thread name changed - refreshing ComplexTable");
          refreshTable();
        }
      } catch (err) {
        console.error("Update failed:", err);
        // Error handling is managed in the hook with toast notifications
      }
    }
  };
  
  const handleNameChange = (e) => {
    setThreadData(prev => ({
      ...prev,
      thread_name: e.target.value
    }));
  };

  const handleDescriptionChange = (e) => {
    setThreadData(prev => ({
      ...prev,
      description: e.target.value
    }));
  };

  // Handle cancel edit
  const handleCancel = () => {
    // Revert to original thread data
    setThreadData(thread);
    setIsEditing(false);
    setIsReadOnly(true);
  };

  // If thread data isn't available yet, show loading
  if (!threadData) {
    return (
      <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
        <Text>Loading flow data...</Text>
      </Box>
    );
  }

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Grid
        mb='20px'
        gridTemplateColumns={{ base: "1fr", md: "1fr", xl: "1fr" }}
        gap={{ base: "20px", xl: "20px" }}
        display={{ base: "block", xl: "grid" }}>

        <Text color={textColor} fontSize='2xl' ms='24px' fontWeight='700'>
          Flow Details
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap='20px'>
          <Card maxW='xl'>
            <CardBody>
              <video controls borderRadius='xl' width='100%'>
                <source 
                  src={`http://localhost:5000/userData/temp/${user.fullName}_${threadData.user_id}/${threadData.thread_name}/${threadData.thread_name}.mp4`} 
                  type="video/mp4" 
                />
              </video>        
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Grid
                h="auto"
                templateRows="repeat(1, 1fr)"
                templateColumns="repeat(4, 1fr)"
                gap={4}
              >
                <GridItem colSpan={2}>
                  <MiniStatistics growth='+23%' name='Sales' value='$574.34' width={{ base: "100%", md: "auto" }} />
                </GridItem>
                <GridItem colSpan={2}>
                  <MiniStatistics growth='+23%' name='Sales' value='$574.34' width={{ base: "100%", md: "auto" }} />
                </GridItem>
                    
                <GridItem colSpan={2}>
                  <Heading as='h4' size='md'>Title</Heading>
                  <Input 
                    focusBorderColor='lime' 
                    value={threadData.thread_name} 
                    ref={nameInputRef} 
                    isReadOnly={isReadOnly}
                    onChange={handleNameChange}
                  />
                </GridItem>
                <GridItem colSpan={2} display="flex" justifyContent="flex-end" alignItems="flex-end" gap={2}>
                  {isEditing ? (
                    <>
                      <Button 
                        w='40%' 
                        size="lg" 
                        variant="outline" 
                        onClick={handleCancel}
                        mr={2}
                      >
                        Cancel
                      </Button>
                      <Button 
                        w='40%' 
                        size="lg" 
                        variant="brand" 
                        onClick={handleToggle}
                        isLoading={isLoading}
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button 
                      w='50%' 
                      size="lg" 
                      variant="brand" 
                      onClick={handleToggle}
                    >
                      Edit
                    </Button>
                  )}
                </GridItem>
                    
                <GridItem colSpan={4}>
                  <Heading as='h4' size='md'>Description</Heading>
                  <Input 
                    focusBorderColor='lime' 
                    value={threadData.description} 
                    ref={descriptionInputRef} 
                    isReadOnly={isReadOnly}
                    onChange={handleDescriptionChange}
                  />
                </GridItem>

                <GridItem colSpan={2}>
                  <Heading as='h4' size='md'>Creation date</Heading>
                  <Text>{threadData.created_at ? new Date(threadData.created_at).toLocaleDateString() : threadData.created_date}</Text>
                </GridItem>
              </Grid>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Card mt='20px'>
          <CardBody>
            <ComplexTable 
              key={tableKey}
              thread_name={threadData.thread_name} 
            />
          </CardBody>
        </Card>
      </Grid>
    </Box>
  );
}