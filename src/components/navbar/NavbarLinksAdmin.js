import {
  Avatar,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  IconButton,
  Box,
  useColorModeValue,
  useColorMode,
  HStack,
} from '@chakra-ui/react';

import { Spinner } from '@chakra-ui/react'

import { CloseButton } from '@chakra-ui/react';
import { Progress } from '@chakra-ui/react'
import { useAddUser } from 'hooks/users/useAddUser';

import { ItemContent } from 'components/menu/ItemContent';
import { SidebarResponsive } from 'components/sidebar/Sidebar';
import PropTypes from 'prop-types';
import React, { useState, useRef, useEffect } from 'react';
import { Alert, AlertIcon, AlertTitle, AlertDescription, VStack } from '@chakra-ui/react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { ClerkProvider } from '@clerk/clerk-react';
import Upload from 'components/navbar/upload_component/Upload';

import routes from 'routes';
import { Modal, Container, Grid, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { useModal } from 'contexts/ModalContext';
import { motion } from 'framer-motion';
import { css, keyframes } from '@emotion/react';
import { CloseIcon, MicIcon } from '@chakra-ui/icons';
import { redirect } from 'react-router-dom';
import useAudioCloning from 'hooks/useClone';
import { useUser } from '@clerk/clerk-react';
import { useSubscription } from 'contexts/paddle/SubscriptionContext';
import useGetUser from 'hooks/users/useGetUser'

const PUBLISHABLE_KEY = process.env.REACT_APP_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

export default function HeaderLinks(props) {
  const { isSubbed, subscriptionData, transactionData } = useSubscription();
  const { user } = useUser();

  const { cloneAudio, loadingAudio, error, audio } = useAudioCloning();
  const [isLoading, setIsLoading] = useState(false);
  
  const [audioFile, setAudioFile] = useState(null);

  const handelFileChange = (file) => {
    setAudioFile(file);
  };

  const { postUser, loading, userError, data } = useAddUser();
  
  // Get user data from useGetUser hook
  const { logedUser, userLoading, logedUserError } = useGetUser(user?.id);
  
  // Get voice_cloned status from the logged user data
  const voice_cloned = logedUser?.voice_cloned ?? false;
  
  // Set modal state based on voice_cloned status
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  
  console.log("Voice cloned status:", voice_cloned);
  console.log("Logged User:", logedUser);
  console.log("cloned user status", logedUser?.voice_cloned);

  // Update modal state when user data loads or voice_cloned status changes
  useEffect(() => {
    if (!userLoading && logedUser) {
      setIsVoiceModalOpen(!voice_cloned);
    }
  }, [voice_cloned, userLoading, logedUser]);

  const handleClick = async () => {
    console.log(user.id)
    console.log(user.fullName)
    if (audioFile && audioFile instanceof File) {
      setIsLoading(true);
      try {
        const userData = {
          user_id: user.id,
          user_name: user.fullName,
        }
        console.log('Audio file details:', {
          name: audioFile.name,
          type: audioFile.type,
          size: audioFile.size
        });
        const result = await cloneAudio(audioFile, userData);
        console.log(result);
        // Close the modal after successful cloning
        setIsVoiceModalOpen(false);
      } catch (error) {
        console.error('Error during audio cloning:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('No audio file selected');
      console.log("audioFile", audioFile) 
    }
  };

  const { secondary } = props;
  const bg = useColorModeValue("gray.100", "navy.700");

  let menuBg = useColorModeValue('white', 'navy.800');

  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)'
  );

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleRecordClick = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Create a File object from the Blob that can be used with your upload service
        const recordedFile = new File([audioBlob], "recorded-audio.wav", {
          type: "audio/wav",
          lastModified: new Date().getTime()
        });
        
        // Set this file to be used by your cloning service
        setAudioFile(recordedFile);
        
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const handleDiscardAudio = () => {
    setAudioUrl('');
    setAudioFile(null); // Also clear the audioFile when discarding
  };

  const pulse = keyframes`
    0% {
      box-shadow: 0px 0px 3px 0px rgba(173,0,0,.3);
    }
    65% {
      box-shadow: 0px 0px 3px 7px rgba(173,0,0,.3);
    }
    90% {
      box-shadow: 0px 0px 3px 7px rgba(173,0,0,0);
    }
  `;
  const [progress, setProgress] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    let timer;
    if (showAlert) {
      setProgress(0); // Reset progress when alert is shown
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 0.1; // Increment progress by 0.1 every 10ms
        });
      }, 10); // Update every 10ms
  
      setTimeout(() => {
        setShowAlert(false); // Automatically close the alert after 10 seconds
        clearInterval(timer); // Clear interval on close
      }, 10000);
    }
    return () => {
      clearInterval(timer); // Cleanup timer on unmount
    };
  }, [showAlert]);

  // Don't render the modal if user data is still loading
  if (userLoading) {
    return (
      <Flex
        w={{ sm: '100%', md: 'auto' }}
        alignItems="center"
        flexDirection="row"
        flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
        p="10px"
        bg="transparent"
        borderRadius="30px"
        gap={{ base: '10px', md: '20px' }}
      >
        <SidebarResponsive routes={routes} />
        <Box display="flex" alignItems="center" bg="transparent">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Box>
      </Flex>
    );
  }
  
  return (
    <Flex
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      bg="transparent"
      borderRadius="30px"
      gap={{ base: '10px', md: '20px' }}
    >
      <SidebarResponsive routes={routes} />

      <Box display="flex" alignItems="center" bg="transparent">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </Box>

      {/* Only show modal if voice is not cloned */}
      {!voice_cloned && (
        <Modal isOpen={isVoiceModalOpen} onClose={() => setIsVoiceModalOpen(false)} size="md">
          <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.300" />
          <ModalContent maxW="450px" mx={4} borderRadius="2xl" shadow="2xl">
            <ModalHeader 
              textAlign="center" 
              fontSize="lg" 
              fontWeight="600" 
              pb={2}
              borderBottomWidth="1px"
              borderColor="gray.100"
            >
              🎤 Clone Your Voice
            </ModalHeader>
            
            <ModalBody px={6} py={4}>
              {/* Audio Upload/Recording Section */}
              <Box mb={4}>
                {audioUrl ? (
                  <Box 
                    bg="gray.50" 
                    borderRadius="lg" 
                    p={4} 
                    border="2px dashed" 
                    borderColor="green.200"
                    position="relative"
                  >
                    <IconButton
                      icon={<CloseIcon />}
                      size="xs"
                      position="absolute"
                      top={2}
                      right={2}
                      onClick={handleDiscardAudio}
                      bg="white"
                      shadow="sm"
                    />
                    <VStack spacing={2}>
                      <Text fontSize="sm" color="green.600" fontWeight="500">
                        ✅ Audio Ready
                      </Text>
                      <audio 
                        controls 
                        src={audioUrl} 
                        style={{ width: '100%', height: '35px' }}
                      />
                    </VStack>
                  </Box>
                ) : (
                  <Box>
                    <Upload
                      minH="120px"
                      onFileChange={handelFileChange}
                      borderRadius="lg"
                    />
                  </Box>
                )}
              </Box>

              {/* Record Button */}
              <Box display="flex" justifyContent="center" mb={4}>
                <Button
                  onClick={handleRecordClick}
                  size="sm"
                  variant="outline"
                  leftIcon={
                    <Box
                      w="8px"
                      h="8px"
                      borderRadius="50%"
                      bg="red.500"
                      animation={isRecording ? `${pulse} 1.5s infinite` : 'none'}
                    />
                  }
                  colorScheme={isRecording ? "red" : "gray"}
                  borderColor={isRecording ? "red.300" : "gray.300"}
                >
                  {isRecording ? 'Stop Recording' : 'Record Audio'}
                </Button>
              </Box>

              {/* Tips Section */}
              <Box 
                bg="blue.50" 
                borderRadius="lg" 
                p={3} 
                border="1px solid" 
                borderColor="blue.100"
                mb={4}
              >
                <HStack spacing={6} align="start">
                  <VStack align="start" spacing={1} flex={1}>
                    <Text fontSize="xs" fontWeight="600" color="green.700">
                      ✅ Best Practices
                    </Text>
                    <Text fontSize="xs" color="gray.600">• Clear, steady voice</Text>
                    <Text fontSize="xs" color="gray.600">• 30-60 seconds long</Text>
                    <Text fontSize="xs" color="gray.600">• Quiet environment</Text>
                  </VStack>
                  
                  <VStack align="start" spacing={1} flex={1}>
                    <Text fontSize="xs" fontWeight="600" color="red.600">
                      ❌ Avoid
                    </Text>
                    <Text fontSize="xs" color="gray.600">• Background noise</Text>
                    <Text fontSize="xs" color="gray.600">• Long pauses</Text>
                    <Text fontSize="xs" color="gray.600">• Multiple speakers</Text>
                  </VStack>
                </HStack>
              </Box>

              {/* Save Button */}
              <Button
                onClick={async () => {
                  handleClick();
                  setShowAlert(true);
                }}
                isLoading={isLoading}
                loadingText="Processing..."
                width="100%"
                colorScheme="blue"
                size="md"
                borderRadius="lg"
                isDisabled={!audioFile}
              >
                Clone My Voice
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

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
                {progress < 80 ? (
                  <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='green.500'
                    size='xl'
                  />
                ) : (
                  <AlertIcon boxSize='40px' mr={0} />
                )}

                <AlertTitle mt={4} mb={1} fontSize='lg'>
                  Application submitted!
                </AlertTitle>
                <AlertDescription maxWidth='sm'>
                  {progress < 80 
                    ? 'Submitting your application...'
                    : 'Thanks for submitting your application. Our team will get back to you soon.'
                  }
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
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};