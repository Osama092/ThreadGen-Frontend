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

import { CloseButton } from '@chakra-ui/react'; // Add this import
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
import { Modal,Container, Grid, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { useModal } from 'contexts/ModalContext';
import { motion } from 'framer-motion';
import { css, keyframes } from '@emotion/react';
import { CloseIcon } from '@chakra-ui/icons';
import { redirect } from 'react-router-dom';
import useAudioCloning from 'hooks/useClone';
import { useUser } from '@clerk/clerk-react';
import { useSubscription } from 'contexts/paddle/SubscriptionContext';
//      <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>

const PUBLISHABLE_KEY = process.env.REACT_APP_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

export default function HeaderLinks(props) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [file, setFile] = useState(null);
  const { isSubbed, subscriptionData, transactionData } = useSubscription();
  const { user } = useUser();
  
  const { cloneAudio, loadingAudio, error, audio } = useAudioCloning();
  const [isLoading, setIsLoading] = useState(false);
  
  const [audioFile, setAudioFile] = useState(null);

  const handelFileChange = (file) => {
    setAudioFile(file);
  };

  const { postUser, loading, userError, data } = useAddUser();
  const voice_cloned = error?.voice_cloned ?? false; // Save in a boolean variable
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  console.log("Voice cloned status:", voice_cloned);


  useEffect(() => {
    if (voice_cloned === false) {
      setIsModalOpen(true);
    }
  }, [voice_cloned]);

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
        const result = await cloneAudio( audioFile, userData );
        console.log(result);
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
  const [progress, setProgress] = useState(0); // New state for progress
  const [showAlert, setShowAlert] = useState(false); // New state for alert visibility
  const { isOpen, onOpen, onClose } = useDisclosure()


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
  
  

  return (
    <Flex
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      //bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      bg="transparent"
      borderRadius="30px"
      //boxShadow={shadow}
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

      { voice_cloned === false && (

      <Modal isOpen={isVoiceModalOpen} onClose={() => setIsVoiceModalOpen(false)}>
  <ModalOverlay backdropFilter="blur(10px)" />
  <ModalContent maxW="fit-content">
    <ModalHeader textAlign="center" fontSize="xl" fontWeight="bold">
      Record Your Voice
    </ModalHeader>
    <ModalBody>
      <Box
        borderRadius="md"
        p={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="auto"
        cursor="pointer"
        position="relative"
      >
        {audioUrl ? (
          <>
            <Flex 
              width="100%" 
              height="100%" 
              justify="center" 
                    align="center"
                    bottom={-4}
              position="relative"
            >
              <IconButton
                icon={<CloseIcon />}
                size="sm"
                position="absolute"
                onClick={handleDiscardAudio}
              />
            </Flex>
                  <Box  border= "1px dashed #ccc"     p={5}
                  >
                  <Box mt={4}       bg={bg}       p={audioUrl ? 2 : 0}    


>
  <audio controls src={audioUrl} />
</Box>
            </Box>
            
          </>
        ) : (
          <>
            <Upload
              minH={{ base: "auto", lg: "420px", "2xl": "365px" }}
              pe='20px'
              pb={{ base: "100px", lg: "20px" }}
              onFileChange={handelFileChange}
            />
          </>
        )}
      </Box>

      <Box display='flex' justifyContent='center' mb={7} size="xs"> 
        <Button onClick={handleRecordClick} size="xs">
          <Box
            as="div"
            width="12px"
            height="12px"
            borderRadius="50%"
            backgroundColor="red"
            marginRight="8px"
            animation={isRecording ? `${pulse} 1.5s infinite` : 'none'}
          />
          {audioUrl ? 'Save' : (isRecording ? 'Recording' : 'Record')}
        </Button>
      </Box>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px', width: 'fit-content', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
          <div style={{ padding: '10px', whiteSpace: 'normal', maxWidth: '200px' }}>
            <Text width="auto">✅ Recommended</Text>
            <Text>• Talking without pauses</Text>
            <Text>• Changing positions while</Text>
            <Text>• Talking without pauses</Text>
          </div>
          <div style={{ padding: '10px', whiteSpace: 'normal', maxWidth: '200px' }}>
            <Text width="auto">❌ Things to avoid</Text>
            <Text>• Talking without pauses</Text>
            <Text>• Changing positions</Text>
            <Text>• Changing positions</Text>
          </div>
        </div>
            </div>
            <Button
              onClick={async () => {
     handleClick();  // Run the cloning logic
    setShowAlert(true);    // Trigger the alert
    onClose();             // Close the modal/dialog
  }}
>
  Save
</Button>

{showAlert && ( // Conditional rendering of the alert
  <Modal isOpen={showAlert} onClose={() => setShowAlert(false)} isCentered>
    <ModalOverlay backdropFilter='blur(5px)' /> {/* Blur effect */}
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
          {progress < 80 ? ( // Show spinner for the first 8 seconds (80% progress)
            <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='green.500'
              size='xl'
            />
          ) : (
            <AlertIcon boxSize='40px' mr={0} /> // Show green check for the last 2 seconds
          )}

          <AlertTitle mt={4} mb={1} fontSize='lg'>
            Application submitted!
          </AlertTitle>
          <AlertDescription maxWidth='sm'>
            {progress < 80 
              ? 'Submitting your application...' // Show loading message while progress < 80%
              : 'Thanks for submitting your application. Our team will get back to you soon.' // Show final message when progress >= 80%
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



    </ModalBody>
  </ModalContent>
</Modal>)}







    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};