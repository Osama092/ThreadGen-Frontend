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
import { ItemContent } from 'components/menu/ItemContent';
import { SidebarResponsive } from 'components/sidebar/Sidebar';
import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';
import { Alert, AlertIcon, AlertTitle, AlertDescription, VStack } from '@chakra-ui/react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { ClerkProvider } from '@clerk/clerk-react';
import Upload from 'components/dropzone/Upload';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';
import navImage from 'assets/img/layout/Navbar.png';
import { MdNotificationsNone, MdInfoOutline } from 'react-icons/md';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { FaEthereum } from 'react-icons/fa';
import routes from 'routes';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { useModal } from 'contexts/ModalContext';
import useUserStatus from 'hooks/useUserStatus';
import { motion } from 'framer-motion';
import { css, keyframes } from '@emotion/react';

const PUBLISHABLE_KEY = process.env.REACT_APP_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

export default function HeaderLinks(props) {
  useUserStatus();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [file, setFile] = useState(null);
  const [showButtons, setShowButtons] = useState(false);

  const { secondary } = props;

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
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSave = () => {
    // Implement save functionality here
    console.log('Audio saved:', audioUrl);
  };

  const handleDiscard = () => {
    setAudioUrl('');
    setFile(null);
    setShowButtons(false);
    console.log('Audio discarded');
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
      gap={{ base: '10px', md: '20px' }}
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
            <Box
              borderRadius="md"
              p={2}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="auto"
              cursor="pointer"
            >
              {audioUrl ? (
                <>
                  <Box mt={4}>
                    <audio controls src={audioUrl} />
                  </Box>
                  <Box display="flex" justifyContent="space-between" mt={4} width="100%">
                    <Button colorScheme="teal" onClick={handleSave}>
                      Save
                    </Button>
                    <Button colorScheme="teal" onClick={handleDiscard}>
                      Discard
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Upload
                    minH={{ base: "auto", lg: "420px", "2xl": "365px" }}
                    pe='20px'
                    pb={{ base: "100px", lg: "20px" }}
                  />
                  {showButtons && (
                    <Box display="flex" justifyContent="space-between" mt={4} width="100%">
                      <Button colorScheme="green" onClick={handleSave}>
                        Save
                      </Button>
                      <Button colorScheme="red" onClick={handleDiscard}>
                        Discard
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </Box>
            <Box display='flex' justifyContent='center' mt={4}> 
              <Button onClick={handleRecordClick}>
                <Box
                  as="div"
                  width="12px"
                  height="12px"
                  borderRadius="50%"
                  backgroundColor="red"
                  marginRight="8px"
                  animation={isRecording ? `${pulse} 1.5s infinite` : 'none'}
                />
                {isRecording ? 'Recording' : 'Record'}
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>

      </Modal>
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};