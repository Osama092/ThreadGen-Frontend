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

import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';


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
import { Modal,Container, Grid, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { useModal } from 'contexts/ModalContext';
import useUserStatus from 'hooks/useUserStatus';
import { motion } from 'framer-motion';
import { css, keyframes } from '@emotion/react';
import { CloseIcon } from '@chakra-ui/icons';
import { redirect } from 'react-router-dom';

const PUBLISHABLE_KEY = process.env.REACT_APP_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

export default function HeaderLinks(props) {
  useUserStatus();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [file, setFile] = useState(null);

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
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const handleDiscardAudio = () => {
    setAudioUrl('');
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
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