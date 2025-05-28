import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from "react";
import { useUser } from '@clerk/clerk-react';
import useThreadUpload from 'hooks/flows/useThreadUpload';
import useAddThread from 'hooks/flows/useAddThread'

import useGetUserThreads from 'hooks/flows/useGetUserThreads'

//------------------------------------------------
// CHAKRA UI IMPORTS
//------------------------------------------------
import { Circle, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Checkbox, Stack, CircularProgress, CircularProgressLabel, HStack, Badge, useToast, Box, Button, Flex, Grid, Text, VStack, useColorModeValue, SimpleGrid, FormControl, FormLabel, Center } from '@chakra-ui/react';


import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { CloseButton } from '@chakra-ui/react';
import { Progress } from '@chakra-ui/react';

import { Card, CardBody, Image, Stack as ChakraStack, Heading, Divider } from '@chakra-ui/react';
import { AddIcon, CheckIcon } from '@chakra-ui/icons';

//------------------------------------------------
// CUSTOM COMPONENTS & HOOKS
//------------------------------------------------
import Upload from "views/admin/flowsManagement/components/Upload";
import { useDropzone } from 'react-dropzone';

export default function FlowManagement() {  
  const navigate = useNavigate();
  const toast = useToast();
  const videoRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useUser();

  const { threads, userThreadsLoading, userThreadsError, Spinner } = useGetUserThreads(user.id);

  const totalSteps = 4;


  //------------------------------------------------
  // STATE MANAGEMENT
  //------------------------------------------------
  // Basic states
  const [file, setFile] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showAlert, setShowAlert] = useState(false); 
  const [progress, setProgress] = useState(0);
  const { uploadThread, loadingThread, errorThread, thread } = useThreadUpload();
  const { addThread, loading: addThreadLoading, error: addThreadError } = useAddThread();
  const [formIsValid, setFormIsValid] = useState(false);

  // Buffer states
  const [bufferProgress, setBufferProgress] = useState(0);
  const [showPersonalizations, setShowPersonalizations] = useState(false);
  const [selectedPersonalization, setSelectedPersonalization] = useState(null);
  const [isDuplicateError, setIsDuplicateError] = useState(false);


  // Form data states
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [enableSmartPause, setEnableSmartPause] = useState(false);
  const [enableFastProgress, setEnableFastProgress] = useState(false);
  const [enableSubtitle, setEnableSubtitle] = useState(true);
  const [playerColor, setPlayerColor] = useState("#3182CE");
  const [startThumbnail, setStartThumbnail] = useState(null);
  const [pauseThumbnail, setPauseThumbnail] = useState(null);
  const [exitThumbnail, setExitThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [stt_names, setSttNames] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [ThreadData, setThreadData] = useState(null);
  const [temporarySelection, setTemporarySelection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStepValid, setIsStepValid] = useState(false);
  const handelFileChange = (file) => {
    setVideoFile(file);
  };

  // Theme variables
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardBg = useColorModeValue("white", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.600");




  //------------------------------------------------
  // SAMPLE DATA
  //------------------------------------------------

  const submitThread = async () => {
    setIsLoading(true); // Set loading for the final submission
    setError(null); // Clear any previous general errors
    // addThreadError state is handled by the hook itself

    try {
      const completeUserData = {
        session_id: ThreadData.user_id || user.id,
        user_id: ThreadData.user_id || user.id,
        user_name: ThreadData.user_name || user.fullName,
        thread_name: ThreadData.title,
        description: ThreadData.description,
        ttsText: ThreadData.ttsText || "",
        color: ThreadData.color || "#3182CE",
        smart_pause: ThreadData.smart_pause,
        subtitle: ThreadData.subtitle ,
        fast_progress: ThreadData.fast_progress
      };


      if (startThumbnail?.file && pauseThumbnail?.file && exitThumbnail?.file) {
        const result = await addThread(
          startThumbnail.file,
          pauseThumbnail.file,
          exitThumbnail.file,
          completeUserData
        );

        if (result && !result.error) {
          // Handle success
          handleClose();
          setShowAlert(true);
          return true; // Indicate success
        } else {
          // Handle addThread errors with toast
          toast({
            title: "Error",
            description:  "Failed to add thread. Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          return false; // Indicate failure
        }

      } else {
        // This case should ideally be caught by isStepValid, but adding a safeguard
        setError("Thumbnail files are missing.");
        return false; // Indicate failure
      }
    } catch (error) {
      console.error("Error submitting thread:", error);
      // Handle unexpected errors during submission with toast
      toast({
        title: "Error",
        description: error?.message || "An unexpected error occurred while adding the thread.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false; // Indicate failure
    } finally {
      setIsLoading(false); // Ensure loading is false after submission attempt
    }
  };

  

  //------------------------------------------------
  // EVENT HANDLERS
  //------------------------------------------------
  const handleCardClick = (thread) => {
    navigate(`/admin/flow/${thread.thread_name}`, { state: { thread } });
  };

  const handleClose = () => {
    setCurrentStep(1);
    setTitle("");
    setDescription("");

    setEnableSmartPause(false);
    setEnableFastProgress(false);
    setEnableSubtitle(true);
    setPlayerColor("#3182CE");
    setStartThumbnail(null);
    setPauseThumbnail(null);
    setExitThumbnail(null);
    setShowPersonalizations(false);
    setBufferProgress(0);
    onClose();
  };
  useEffect(() => {
    validateCurrentStep();
  }, [
    // Dependencies for step 1
    currentStep, title, description, videoFile,
    // Dependencies for step 2
    temporarySelection,
    // Dependencies for step 3
    // (playerSettings are already state variables, no validation needed)
    // Dependencies for step 4
    startThumbnail, pauseThumbnail, exitThumbnail
  ]);
  
  const validateCurrentStep = () => {
    let valid = false;
    
    switch (currentStep) {
      case 1:
        valid = !!title && !!description && !!videoFile;
        break;
        
      case 2:
        valid = !!temporarySelection;
        break;
        
      case 3:
        valid = true;
        break;
        
      case 4:
        valid = !!startThumbnail?.file && !!pauseThumbnail?.file && !!exitThumbnail?.file;
        break;
        
      default:
        valid = false;
    }
    
    setIsStepValid(valid);
  };

  const nextStep = async () => {
    let canProceed = true; // Flag to determine if we can proceed to next step

    if (currentStep === 1) {
      if (videoFile) {
        setIsLoading(true);
        setIsDuplicateError(false); // Reset duplicate error flag
        setError(null); // Clear any previous general errors

        try {
          const userData = {
            user_id: user.id,
            user_name: user.fullName,
            flow_name: title
          };

          const result = await uploadThread(videoFile, userData);

          if (!result || result.error) {
            // Check if this is a duplicate thread error
            if (result?.error?.message?.includes('Thread name already exists') ||
                result?.error?.includes('Thread name already exists')) {
              // Use toast for duplicate name error
              toast({
                title: "Error",
                description: "Thread name already exists. Please choose a different name.",
                status: "error",
                duration: 5000,
                isClosable: true,
              });
              setIsDuplicateError(true); // Keep state if needed elsewhere, but won't trigger the removed Alert
              canProceed = false; // Prevent proceeding on duplicate error
            } else {
              // Handle other API error responses using the general error state and Alert
              setError(result?.error?.message || "Failed to upload video. Please try again.");
              setIsDuplicateError(false); // Ensure duplicate error flag is false for other errors
              canProceed = false; // Prevent proceeding on other errors
            }
          } else {
            // Success case
            setSttNames(result.stt_names || []);
            setThreadData({
              user_id: userData.user_id,
              user_name: userData.user_name,
              title: title,
              description: description
            });
            setError(null); // Clear any previous errors
            setIsDuplicateError(false); // Clear duplicate error flag
          }
        } catch (error) {
            console.error("Error uploading video:", error);
            // Check if this is a duplicate thread error
            if (error?.message?.includes('Thread name already exists')) {
              // Use toast for duplicate name error caught in catch
              toast({
                title: "Error",
                description: "Thread name already exists. Please choose a different name.",
                status: "error",
                duration: 5000,
                isClosable: true,
              });
              setIsDuplicateError(true); // Keep state if needed elsewhere
            } else {
              // Handle other errors caught in catch using the general error state and Alert
              setError(error?.message || "An unexpected error occurred while uploading the video.");
              setIsDuplicateError(false); // Ensure duplicate error flag is false for other errors
            }
            canProceed = false; // Prevent proceeding on any error
          } finally {
            setIsLoading(false);
          }

        // If there was an error, don't proceed
        if (!canProceed) return;
      }
    }
  
    if (currentStep === 2) {
      if (temporarySelection) {
        const { word, start, end } = temporarySelection;
        const formatted = `${word} ${start}-${end}`;
        setThreadData(prev => ({
          ...prev,
          ttsText: formatted
        }));
      } else {
        console.error("No text selection made");
        setError("Please select text before proceeding.");
        return;
      }
    }
    
    if (currentStep === 3) {
      setIsLoading(true);
      
      try {
        const playerSettings = {
          enableSmartPause,
          enableFastProgress,
          enableSubtitle,
          playerColor
        };
        
        setThreadData(prev => ({
          ...prev,
          fast_progress: playerSettings.enableFastProgress,
          subtitle: playerSettings.enableSubtitle,
          smart_pause: playerSettings.enableSmartPause,
          color: playerSettings.playerColor
        }));
        
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error("Error in step 3:", error);
        setError(error?.message || "An error occurred while saving player settings.");
        canProceed = false;
      } finally {
        setIsLoading(false);
      }
      
      // If there was an error, don't proceed
      if (!canProceed) return;
    }
  
    if (currentStep === 4) {
      if (!startThumbnail?.file || !pauseThumbnail?.file || !exitThumbnail?.file) {
        setError("Please upload all required thumbnails before proceeding.");
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Prepare the complete userData object with all collected information
        const completeUserData = {
          session_id: ThreadData.userData?.session_id,
          user_id: ThreadData.userData?.user_id,
          user_name: ThreadData.userData?.user_name,
          thread_name: ThreadData.title,
          description: ThreadData.description,
          smart_pause: ThreadData.smart_pause,
          subtitle: ThreadData.subtitle,
          fast_progress: ThreadData.fast_progress,
          ttsText: ThreadData.selectedSpeaker
        };
  
        // You would add your API call here
        // const response = await createThread(completeUserData, thumbnails);
        
        setError(null); // Clear any previous errors
  
      } catch (error) {
        console.error("Error creating thread:", error);
        setError(error?.message || "An error occurred while creating the thread.");
        canProceed = false;
      } finally {
        setIsLoading(false);
      }
      
      // If there was an error, don't proceed
      if (!canProceed) return;
    }
  
    // Only advance to the next step if:
    // 1. The current step is valid
    // 2. We're not currently loading data
    // 3. We're not on the final step
    // 4. No errors occurred during processing
    if (isStepValid && !isLoading && currentStep < totalSteps && canProceed) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep === 3) { 
      const playerSettings = {
        enableSmartPause,
        enableFastProgress,
        enableSubtitle,
        playerColor
      };
    }
    setError(null); // Clear errors when going back a step
    setCurrentStep(prev => prev - 1);
  };


  //------------------------------------------------
  // IMAGE UPLOAD HANDLERS
  //------------------------------------------------
  const handleImageUpload = (acceptedFiles, setter) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const preview = URL.createObjectURL(file);
      setter({
        file,
        preview
      });
    }
  };

  // Call useDropzone directly for each thumbnail
  const { getRootProps: getStartRootProps, getInputProps: getStartInputProps } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: (acceptedFiles) => handleImageUpload(acceptedFiles, setStartThumbnail)
  });

  const { getRootProps: getPauseRootProps, getInputProps: getPauseInputProps } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: (acceptedFiles) => handleImageUpload(acceptedFiles, setPauseThumbnail)
  });

  const { getRootProps: getExitRootProps, getInputProps: getExitInputProps } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: (acceptedFiles) => handleImageUpload(acceptedFiles, setExitThumbnail)
  });

  const handleSpeakerSelect = (item) => {
    // Toggle selection if clicking the same name
    if (selectedName?.word === item.word) {
      setSelectedName(null);
    } else {
      setSelectedName(item);
    }
    setTemporarySelection(temporarySelection?.word === item.word ? null : item);
  };

  //------------------------------------------------
  // EFFECTS
  //------------------------------------------------
  // Buffer effect for transcription step
  useEffect(() => {
  }, [ThreadData]);


  
  useEffect(() => {
    let bufferTimer;
    if (currentStep === 2 && !showPersonalizations) {
      setBufferProgress(0);
      bufferTimer = setInterval(() => {
        setBufferProgress(prev => {
          if (prev >= 100) {
            clearInterval(bufferTimer);
            setShowPersonalizations(true);
            return 100;
          }
          return prev + 4;
        });
      }, 200);
    }

    return () => {
      clearInterval(bufferTimer);
    };
  }, [currentStep, showPersonalizations]);

  useEffect(() => {
    return () => {
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      if (startThumbnail) URL.revokeObjectURL(startThumbnail.preview);
      if (pauseThumbnail) URL.revokeObjectURL(pauseThumbnail.preview);
      if (exitThumbnail) URL.revokeObjectURL(exitThumbnail.preview);
    };
  }, [file, startThumbnail, pauseThumbnail, exitThumbnail]);

  useEffect(() => {
    let timer;
    if (showAlert) {
      setProgress(0);
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + (0.25);
        });
      }, 7.5);
  
      setTimeout(() => {
        setShowAlert(false); 
        clearInterval(timer); 
      }, 3000);
    }
    return () => {
      clearInterval(timer); 
    };
  }, [showAlert]);

  //------------------------------------------------
  // STEP CONTENT RENDERING
  //------------------------------------------------
  // Render step content based on current step
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return renderBasicInfoStep();
      case 2:
        return renderTranscriptionStep();
      case 3:
        return renderPlayerSettingsStep();
      case 4:
        return renderThumbnailsStep();
      default:
        return null;
    }
  };

  // Step 1: Basic Information
  const renderBasicInfoStep = () => {
    return (
      <VStack spacing={4} align="stretch">
        {/* Keep this Alert for other errors in Step 1 */}
        {error && !isDuplicateError && ( // Only show general error if not a duplicate error
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
          </Alert>
        )}

        <FormControl>
          <Grid templateColumns="repeat(2, 1fr)" gap={8}>
            <FormControl>
              <FormLabel htmlFor='title'>Title</FormLabel>
              <Input
                id='title'
                type='text'
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  // Clear duplicate error and general error when user changes the title
                  if (isDuplicateError) setIsDuplicateError(false);
                  if (error) setError(null);
                }}
                isInvalid={isDuplicateError} // Keep isInvalid for visual feedback on the input
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor='description'>Description</FormLabel>
              <Input
                id='description'
                type='text'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
          </Grid>
        </FormControl>

        <Grid align="center" justify="center">
          <Upload
            minH={{ base: "auto", lg: "420px", "2xl": "365px" }}
            pe='20px'
            pb={{ base: "100px", lg: "20px" }}
            onFileChange={handelFileChange}
          />
        </Grid>
      </VStack>
    );
  };


  // Step 2: Transcription Settings
  const renderTranscriptionStep = () => {
    return (
      <VStack spacing={6} align="stretch">
        <Heading size="md">Transcription Settings</Heading>
  
        <Box textAlign="center" py={6}>
          <VStack spacing={6}>
            {/* Speakers Section */}
            <Box width="100%">
              <Text fontSize="lg" fontWeight="medium" mb={3}>Identified Names:</Text>
              
              {/* Scrollable container for names */}
              <Box 
                width="100%" 
                overflowX="auto" 
                pb={2} 
                css={{
                  '&::-webkit-scrollbar': {
                    height: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#CBD5E0',
                    borderRadius: '4px',
                  },
                }}
              >
                <Flex gap={2} pb={1} wrap="nowrap">
                  {stt_names.length > 0 ? (
                    stt_names.map((item, index) => {
                      const colors = ["#4299E1", "#48BB78", "#F6AD55", "#F56565", "#9F7AEA", "#ED64A6"];
                      const colorIndex = index % colors.length;
                      const bgColor = colors[colorIndex];
                      const softColor = `${bgColor}33`;
                      const isSelected = selectedName?.word === item.word;
                      
                      return (
                        <Badge
                          key={index}
                          px={3}
                          py={2}
                          borderRadius="full"
                          bg={isSelected ? softColor : "gray.100"}
                          color={isSelected ? `${bgColor.replace('#', 'gray.')}` : "gray.700"}
                          borderWidth="1px"
                          borderColor={isSelected ? bgColor : "transparent"}
                          cursor="pointer"
                          onClick={() => handleSpeakerSelect(item)}
                          _hover={{ 
                            bg: isSelected ? softColor : "gray.200",
                            transform: "translateY(-1px)"
                          }}
                          transition="all 0.2s"
                          display="flex"
                          alignItems="center"
                          flexShrink={0}
                        >
                          {item.word}
                        </Badge>
                      );
                    })
                  ) : (
                    <Text>No names identified</Text>
                  )}
                </Flex>
              </Box>
              
              {/* Add validation message */}
              {currentStep === 2 && !temporarySelection && (
                <Text color="red.500" mt={2}>Please select a speaker before continuing</Text>
              )}
            </Box>
          </VStack>
        </Box>
      </VStack>
    );
  };

  // Step 3: Player Settings
  const renderPlayerSettingsStep = () => {
    return (
      <VStack spacing={4} align="stretch">
        <Heading size="md">Player Settings</Heading>
        <FormControl>
          <Checkbox 
            isChecked={enableSmartPause}
            onChange={(e) => setEnableSmartPause(e.target.checked)}
          >
            Enable Smart Pause
          </Checkbox>
        </FormControl>
        <FormControl>
          <Checkbox 
            isChecked={enableFastProgress}
            onChange={(e) => setEnableFastProgress(e.target.checked)}
          >
            Enable Fast Progress Bar
          </Checkbox>
        </FormControl>
        <FormControl>
          <Checkbox 
            isChecked={enableSubtitle}
            onChange={(e) => setEnableSubtitle(e.target.checked)}
          >
            Enable Subtitle
          </Checkbox>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor='playerColor'>Player Color</FormLabel>
          <Flex align="center">
            <Input 
              id='playerColor' 
              type='color' 
              value={playerColor}
              onChange={(e) => setPlayerColor(e.target.value)}
              width="100px"
            />
            <Text ml={4}>{playerColor}</Text>
          </Flex>
        </FormControl>
        
        <Box mt={4} p={4} borderRadius="md" bg={playerColor + "20"}>
          <Text fontWeight="medium">Preview:</Text>
          <Flex mt={3} align="center" justify="center">
            <Box 
              w="200px" 
              h="120px" 
              bg="gray.200" 
              borderRadius="md" 
              position="relative"
              overflow="hidden"
              border="2px solid"
              borderColor={playerColor}
            >
              <Center position="absolute" top={0} left={0} right={0} bottom={0}>
                <Box as="button" 
                  w="40px" 
                  h="40px" 
                  borderRadius="full" 
                  bg={playerColor} 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                >
                  <Box 
                    borderLeft="15px solid white" 
                    borderTop="8px solid transparent" 
                    borderBottom="8px solid transparent" 
                    ml={1}
                  />
                </Box>
              </Center>
              <Box position="absolute" bottom={0} left={0} right={0} h="24px" bg={playerColor} >
                <Box w="30%" h="4px" mt="10px" ml="10px" bg="white" borderRadius="full" />
              </Box>

            </Box>
          </Flex>
        </Box>
      </VStack>
    );
  };

  // Step 4: Thumbnails
  // Step 4: Thumbnails
  const renderThumbnailsStep = () => {
  return (
    <VStack spacing={6} align="stretch">
      <Heading size="md">Thumbnail Images</Heading>

      {/* Remove the Alert for addThreadError here */}
      {/* addThreadError is now handled by a toast in submitThread */}

      <FormControl>
        <FormLabel>Start Thumbnail</FormLabel>
        <Box
          {...getStartRootProps()}
          p={4}
          border="2px dashed"
          borderColor="gray.300"
          borderRadius="md"
          height="150px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor={isLoading ? "not-allowed" : "pointer"} // Use isLoading here as submitThread sets it
          bg={startThumbnail ? "transparent" : "gray.50"}
          opacity={isLoading ? 0.6 : 1}
        >
          <input {...getStartInputProps()} disabled={isLoading} />
          {startThumbnail ? (
            <Image
              src={startThumbnail.preview}
              alt="Start thumbnail"
              maxHeight="140px"
              objectFit="contain"
            />
          ) : (
            <Text>Drag and drop or click to upload start thumbnail</Text>
          )}
        </Box>
      </FormControl>

      <FormControl>
        <FormLabel>Pause Thumbnail</FormLabel>
        <Box
          {...getPauseRootProps()}
          p={4}
          border="2px dashed"
          borderColor="gray.300"
          borderRadius="md"
          height="150px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor={isLoading ? "not-allowed" : "pointer"} // Use isLoading
          bg={pauseThumbnail ? "transparent" : "gray.50"}
          opacity={isLoading ? 0.6 : 1}
        >
          <input {...getPauseInputProps()} disabled={isLoading} />
          {pauseThumbnail ? (
            <Image
              src={pauseThumbnail.preview}
              alt="Pause thumbnail"
              maxHeight="140px"
              objectFit="contain"
            />
          ) : (
            <Text>Drag and drop or click to upload pause thumbnail</Text>
          )}
        </Box>
      </FormControl>

      <FormControl>
        <FormLabel>Exit Thumbnail</FormLabel>
        <Box
          {...getExitRootProps()}
          p={4}
          border="2px dashed"
          borderColor="gray.300"
          borderRadius="md"
          height="150px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor={isLoading ? "not-allowed" : "pointer"} // Use isLoading
          bg={exitThumbnail ? "transparent" : "gray.50"}
          opacity={isLoading ? 0.6 : 1}
        >
          <input {...getExitInputProps()} disabled={isLoading} />
          {exitThumbnail ? (
            <Image
              src={exitThumbnail.preview}
              alt="Exit thumbnail"
              maxHeight="140px"
              objectFit="contain"
            />
          ) : (
            <Text>Drag and drop or click to upload exit thumbnail</Text>
          )}
        </Box>
      </FormControl>

    </VStack>
  );
};

  //------------------------------------------------
  // STEP INDICATOR RENDERING
  //------------------------------------------------
  const renderStepIndicator = () => {
    return (
      <Flex justify="center" mb={6}>
        {[1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
            <Box
              w="30px"
              h="30px"
              borderRadius="50%"
              bg={currentStep >= step ? "blue.500" : "gray.200"}
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontWeight="bold"
            >
              {step}
            </Box>
            {step < 4 && (
              <Box
                w="60px"
                h="2px"
                bg={currentStep > step ? "blue.500" : "gray.200"}
                alignSelf="center"
              />
            )}
          </React.Fragment>
        ))}
      </Flex>
    );
  };

  //------------------------------------------------
  // MAIN COMPONENT RENDER
  //------------------------------------------------


  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Grid
        mb='20px'
        gridTemplateColumns={{ base: "1fr", md: "1fr", xl: "1fr" }}
        gap={{ base: "20px", xl: "20px" }}
        display={{ base: "block", xl: "grid" }}
      >
        <Flex
          flexDirection='column'
          gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}
        >
          <Flex direction='column'>
            <Flex
              mt='45px'
              mb='20px'
              justifyContent='space-between'
              direction={{ base: "column", md: "row" }}
              align={{ base: "start", md: "center" }}
            >
              <Text color={textColor} fontSize='2xl' ms='24px' fontWeight='700'>
                Current Threads:
              </Text>
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap='20px'>

            <Box
              as='button'
              onClick={onOpen}
              borderRadius='xl'
              border='2px dashed'
              borderColor='gray.300'
              p={6}
              minH='300px'
              display='flex'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              cursor='pointer'
              _hover={{
                borderColor: 'blue.500',
                bg: 'blue.50'
              }}
            >
              <AddIcon boxSize={8} color='blue.500' mb={3} />
              <Text fontSize='md' color='blue.500'>
                Add New Thread
              </Text>
            </Box>

            <Modal isOpen={isOpen} size={'xl'} onClose={handleClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>
                  {currentStep === 1 && "Add New Thread - Step 1: Basic Information"}
                  {currentStep === 2 && "Add New Thread - Step 2: Transcription"}
                  {currentStep === 3 && "Add New Thread - Step 3: Player Settings"}
                  {currentStep === 4 && "Add New Thread - Step 4: Thumbnails"}
                </ModalHeader>
                <ModalCloseButton />
                
                <ModalBody>
                  {renderStepIndicator()}
                  {renderStepContent()}
                </ModalBody>
                
                <ModalFooter>
                  {currentStep > 1 && (
                    <Button mr={3} onClick={prevStep}>
                      Back
                    </Button>
                  )}
                  
                  {currentStep < 4 ? (
                    <Button 
                      colorScheme="blue" 
                      onClick={nextStep}
                      isDisabled={!isStepValid || isLoading || !!error} 
                      isLoading={isLoading}
                      loadingText="Processing"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button 
                      colorScheme="teal" 
                      isLoading={addThreadLoading}
                      loadingText="Creating thread..."
                      isDisabled={!isStepValid || addThreadLoading}
                      onClick={async () => {
                        if (currentStep === 4) {
                          const success = await submitThread();
                          if (success) {
                            handleClose();
                            setShowAlert(true);
                          }
                        } else {
                          handleClose();
                        }
                      }}
                    >
                      Finish
                    </Button>
                  )}
                </ModalFooter>
              </ModalContent>
            </Modal>
              
            {/* Success Alert Modal */}
            {showAlert && (
              <Modal isOpen={showAlert} onClose={() => setShowAlert(false)} isCentered>
                <ModalOverlay backdropFilter='blur(5px)' />
                <ModalContent bg='transparent' boxShadow='none'>
                  <ModalBody>
                    <Progress colorScheme='green' size='sm' width='100%' value={progress} borderRadius='none' />

                    <Alert
                      status='success'
                      variant='subtle'
                      flexDirection='column'
                      alignItems='center'
                      justifyContent='center'
                      textAlign='center'
                      height='200px'
                    >
                      <AlertIcon boxSize='40px' mr={0} />
                      <AlertTitle mt={4} mb={1} fontSize='lg'>
                        Thread created successfully!
                      </AlertTitle>
                      <AlertDescription maxWidth='sm'>
                        Your new Thread has been created and saved. You can now manage it from the dashboard.
                      </AlertDescription>
                      <CloseButton
                        alignSelf='flex-start'
                        position='absolute'
                        right={2}
                        top={2}
                        onClick={() => setShowAlert(false)}
                      />
                    </Alert>
                  </ModalBody>
                </ModalContent>
              </Modal>
            )}
              
            {userThreadsLoading && (
              <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="400px"
                width="100%"
                gridColumn={{ base: "1", md: "1 / -1", xl: "2" }}
              >
                <Spinner size="xl" color="blue.500" thickness="4px" />
              </Box>
            )}        
            {userThreadsError && <Text>Error: {userThreadsError.message}</Text>}
            {threads && threads.length > 0 ? (
                threads.map((thread) => (

                  <Box 
                  key={thread._id} 
                  onClick={thread.status !== 'pending' ? () => handleCardClick(thread) : undefined} 
                  cursor={thread.status !== 'pending' ? "pointer" : "not-allowed"}
                  opacity={thread.status === 'pending' ? 0.6 : 1}
                >
                  <Card maxW='sm' variant='unstyled'>
                    <CardBody>
                      <div style={{ width: '100%', height: '300px', background: '#000', position: 'relative' }}>
                        {thread.status === 'pending' && (
                          <Badge 
                            position="absolute" 
                            top="10px" 
                            right="10px" 
                            zIndex="1" 
                            colorScheme="red" 
                            fontSize="md" 
                            px={3} 
                            py={1}
                            borderRadius="md"
                          >
                            PENDING
                          </Badge>
                        )}
                        <video 
                          controls={thread.status !== 'pending'} 
                          ref={videoRef} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        >
                          {(() => {
                            const videoUrl = `http://localhost:5000/userData/temp/${user.fullName}_${user.id}/${thread.thread_name}/${thread.thread_name}.mp4`;
                            return (
                              <source 
                                src={videoUrl}
                                type="video/mp4" 
                              />
                            );
                          })()}
                        </video>
                      </div>
                    </CardBody>
                  </Card>
                  <Card maxW='sm' pl={2} variant='unstyled'>
                    <CardBody>
                      <ChakraStack mt='2' mb='2' spacing='3'>
                        <Heading size='md'>{thread.thread_name}</Heading>
                        <Flex justifyContent="space-between" align="center">
                          <Text>{thread.description}</Text>
                          <Text as="sup" fontSize="sm" color="gray.500" whiteSpace="nowrap">
                            {new Date(thread.created_at).toLocaleString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </Text>
                        </Flex>
                        <Divider />
                      </ChakraStack>
                    </CardBody>
                  </Card>
                </Box>
              ))
) : (
  !userThreadsLoading && (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={12}
      textAlign="center"
      gridColumn={{ base: "1", md: "2", xl: "2" }}
    >
      <Circle size="80px" bg="gray.100" mb={4}>
        <Box
          w="40px"
          h="40px"
          bg="gray.300"
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            w="20px"
            h="15px"
            border="2px solid"
            borderColor="gray.500"
            borderRadius="2px"
            position="relative"
          >
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              w="0"
              h="0"
              borderLeft="6px solid gray.500"
              borderTop="4px solid transparent"
              borderBottom="4px solid transparent"
            />
          </Box>
        </Box>
      </Circle>
      <Text fontSize="xl" fontWeight="semibold" color="gray.600" mb={2}>
        No threads yet
      </Text>
      <Text fontSize="md" color="gray.500" maxW="300px">
        Get started by creating your first video thread using the add button above
      </Text>
    </Box>
  )
)}
            </SimpleGrid>
          </Flex>
        </Flex>
      </Grid>
    </Box>
  );
}