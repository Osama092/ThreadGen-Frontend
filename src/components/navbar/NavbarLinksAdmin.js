// Chakra Imports
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
} from '@chakra-ui/react';
// Custom Components
import { ItemContent } from 'components/menu/ItemContent';
import { SidebarResponsive } from 'components/sidebar/Sidebar';
import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { ClerkProvider } from '@clerk/clerk-react'
import Upload from "components/dropzone/Upload";

// Assets
import navImage from 'assets/img/layout/Navbar.png';
import { MdNotificationsNone, MdInfoOutline } from 'react-icons/md';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { FaEthereum } from 'react-icons/fa';
import routes from 'routes';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { useModal } from 'contexts/ModalContext'
import useUserStatus from 'hooks/useUserStatus'; // Import the custom hook
import { MdMic } from 'react-icons/md';
import { motion } from 'framer-motion';
const pulseVariants = {
  initial: { scale: 1 },
  recording: { scale: [1, 1.2, 1], transition: { duration: 0.6, repeat: Infinity, repeatType: 'loop' } },
};

const PUBLISHABLE_KEY = process.env.REACT_APP_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}




export default function HeaderLinks(props) {
  useUserStatus(); // Use the hook here
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true); // Set initial state to true


  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);



  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  // Chakra Color Mode
  const navbarIcon = useColorModeValue('gray.400', 'white');
  let menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorBrand = useColorModeValue('brand.700', 'brand.400');
  const ethColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const ethBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const ethBox = useColorModeValue('white', 'navy.800');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
  );
  const borderButton = useColorModeValue('secondaryGray.500', 'whiteAlpha.200');

  //record stuff
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      const audioChunks = [];
      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };


  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleRecordingToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleFileUpload = (file) => {
    setUploadedFile(file);
  };

  const handleFileRemove = () => {
    setUploadedFile(null);
  };





  return (
    <Flex
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
      gap={{ base: '10px', md: '20px' }} // Add gap for responsive spacing

    >
      <SidebarResponsive routes={routes} />

      <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>


      
      <Box display="flex" alignItems="center">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </Box>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="xl" fontWeight="bold">
            Record Your Voice
          </ModalHeader>
          <ModalBody>
            <Flex direction="column" alignItems="center" gap={4}>

            <Upload
              gridArea={{
                base: "3 / 1 / 4 / 2",
                lg: "1 / 3 / 2 / 4",
              }}
              minH={{ base: "auto", lg: "420px", "2xl": "365px" }}
              pe='20px'
              pb={{ base: "100px", lg: "20px" }}
              />
              
              {/* Microphone Icon with Red Pulse Animation */}
              <Box
                as="button"
                aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
                onClick={handleRecordingToggle}
                display="flex"
                justifyContent="center"
                alignItems="center"
                w="80px"
                h="80px"
                borderRadius="full"
                bg="white"
                boxShadow="0px 0px 5px 0px rgba(173,0,0,0.3)"
                position="relative"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: 'full',
                  animation: isRecording ? 'pulse 1.5s infinite' : 'none',
                }}
              >
                <Icon as={ MdMic} w="50px" h="50px" color="red.500" />
              </Box>

              {/* Audio Player */}
              
            </Flex>
          </ModalBody>
          
          <ModalFooter>
            {audioUrl && (
              <Box textAlign="center" mt={4} w="100%">
                <audio controls src={audioUrl} style={{ width: '100%', borderRadius: '12px' }} />
                <Flex justifyContent="space-between" width="100%" mt={4}>
                  <Button colorScheme="green" onClick={() => alert("Saved!")}>
                    Save
                  </Button>
                  <Button colorScheme="red" onClick={() => setAudioUrl(null)}>
                    Discard
                  </Button>
                </Flex>
              </Box>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* CSS for Red Pulse Animation */}
      <style>{`
        @keyframes pulse {
          0% {
            box-shadow: 0px 0px 5px 0px rgba(173, 0, 0, 0.3);
          }
          65% {
            box-shadow: 0px 0px 5px 13px rgba(173, 0, 0, 0.3);
          }
          90% {
            box-shadow: 0px 0px 5px 13px rgba(173, 0, 0, 0);
          }
        }
      `}</style>

    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};
