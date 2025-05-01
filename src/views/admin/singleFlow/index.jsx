import React, { useState, useRef, useEffect, useCallback } from "react";
import MiniStatistics from "components/card/MiniStatistics";
import { 
  Box, 
  Button, 
  Input, 
  Grid, 
  GridItem, 
  Text, 
  useColorModeValue, 
  SimpleGrid, 
  Card, 
  CardBody, 
  Heading, 
  useToast,
  IconButton,
  Flex,
  Textarea
} from "@chakra-ui/react";
import { EditIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import ComplexTable from "views/admin/singleFlow/components/ComplexTable";
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useUpdateThread } from 'hooks/flows/useEditThread';

export default function SingleFlow() {
  const nameInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [threadData, setThreadData] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const bgCard = useColorModeValue("white", "navy.700");
  const borderColor = useColorModeValue("secondaryGray.100", "whiteAlpha.100");
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
  
  // Handle case when thread data is not available
  useEffect(() => {
    if (!thread) {
      // Redirect to flows management if no thread data
      navigate('/admin/flowsManagement');
      return;
    }
    
    setThreadData(thread);
  }, [thread, navigate]);

  const handleEditClick = async () => {
    if (isEditing) {
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
        
        // Check if thread name was changed and refresh the table
        if (result.old_thread_name && result.old_thread_name !== threadData.thread_name) {
          console.log("Thread name changed - refreshing ComplexTable");
          refreshTable();
        }
      } catch (err) {
        console.error("Update failed:", err);
        // Error handling is managed in the hook with toast notifications
      }
    } else {
      // Enter edit mode
      setIsEditing(true);
      setTimeout(() => {
        nameInputRef.current.focus();
      }, 0);
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
  const handleCancelEdit = () => {
    // Revert to original thread data
    setThreadData(thread);
    setIsEditing(false);
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
      <Text color={textColor} fontSize='2xl' ms='24px' fontWeight='700' mb="20px">
        Flow Details
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap='20px' mb="20px">
        <Card
          bg={bgCard}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="20px"
        >
          <CardBody>
            <video controls borderRadius='xl' width='100%'>
              <source 
                src={`http://localhost:5000/userData/temp/${user.fullName}_${threadData.user_id}/${threadData.thread_name}/${threadData.thread_name}.mp4`} 
                type="video/mp4" 
              />
            </video>        
          </CardBody>
        </Card>

        <Card
          bg={bgCard}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="20px"
          position="relative"
        >
          {isEditing ? (
            <Flex position="absolute" top="10px" right="10px" gap="2">
              <IconButton
                aria-label="Save changes"
                icon={<CheckIcon />}
                size="sm"
                colorScheme="green"
                onClick={handleEditClick}
                isLoading={isLoading}
              />
              <IconButton
                aria-label="Cancel edit"
                icon={<CloseIcon />}
                size="sm"
                colorScheme="red"
                onClick={handleCancelEdit}
              />
            </Flex>
          ) : (
            <IconButton
              aria-label="Edit flow"
              icon={<EditIcon />}
              size="sm"
              position="absolute"
              top="10px"
              right="10px"
              colorScheme="blue"
              variant="ghost"
              onClick={handleEditClick}
            />
          )}
          <CardBody pt="50px">
            <Grid
              h="auto"
              templateRows="repeat(auto-fill, minmax(auto, 1fr))"
              templateColumns="repeat(4, 1fr)"
              gap={4}
            >
              <GridItem colSpan={2}>
                <MiniStatistics growth='+23%' name='Sales' value='$574.34' width={{ base: "100%", md: "auto" }} />
              </GridItem>
              <GridItem colSpan={2}>
                <MiniStatistics growth='+23%' name='Sales' value='$574.34' width={{ base: "100%", md: "auto" }} />
              </GridItem>
                  
              <GridItem colSpan={4}>
                <Heading as='h4' size='md' mb={2}>Title</Heading>
                <Box h="40px"> {/* Fixed height container */}
                  {isEditing ? (
                    <Input 
                      value={threadData.thread_name} 
                      onChange={handleNameChange}
                      ref={nameInputRef}
                      focusBorderColor='blue.400'
                      placeholder="Flow title"
                      h="40px"
                      fontSize="xl"
                    />
                  ) : (
                    <Text color={textColor} fontSize="xl" fontWeight="700" h="40px" lineHeight="40px">
                      {threadData.thread_name}
                    </Text>
                  )}
                </Box>
              </GridItem>
                  
              <GridItem colSpan={4}>
                <Heading as='h4' size='md' mb={2}>Description</Heading>
                <Box h="80px"> {/* Fixed height container */}
                  {isEditing ? (
                    <Textarea
                      value={threadData.description} 
                      onChange={handleDescriptionChange}
                      ref={descriptionInputRef}
                      focusBorderColor='blue.400'
                      placeholder="Flow description"
                      size="md"
                      h="80px"
                      resize="none"
                      fontSize="md"
                    />
                  ) : (
                    <Text color="gray.500" h="80px" overflowY="auto">
                      {threadData.description}
                    </Text>
                  )}
                </Box>
              </GridItem>

              <GridItem colSpan={2}>
                <Heading as='h4' size='md' mb={2}>Creation date</Heading>
                <Text>{threadData.created_at ? new Date(threadData.created_at).toLocaleDateString() : threadData.created_date}</Text>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card
        bg={bgCard}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="20px"
        mt='20px'
      >
        <CardBody>
          <ComplexTable 
            key={tableKey}
            thread_name={threadData.thread_name} 
          />
        </CardBody>
      </Card>
    </Box>
  );
}