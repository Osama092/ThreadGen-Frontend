/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                      
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import React from "react";

import {
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@chakra-ui/react';
import { IconButton, Icon } from '@chakra-ui/react';
import { FiUpload } from 'react-icons/fi';
import { BsMic } from 'react-icons/bs';

import Upload from "views/admin/marketplace/components/Upload";

// Chakra imports
import {
  Box,
  Button,
  Flex,
  Grid,

  Text,
  VStack,

  useColorModeValue,
  SimpleGrid,
  FormControl,
  FormLabel

} from "@chakra-ui/react";


import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { CloseButton } from '@chakra-ui/react'; // Add this import
import { Progress } from '@chakra-ui/react'
// Custom components

//import Card from "components/card/Card.js";
import { Card, CardBody, Image, Stack, Heading, Divider  } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
// Assets

import { AddIcon } from '@chakra-ui/icons'
import useGetFlows from 'hooks/flows/useGetFlows';






export default function FlowManagement() {  
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { flows, loading, error, refetch} = useGetFlows()

  const [file, setFile] = useState(null);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'video/*': [] // Accept all video file types
    },
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        // Only accept one file
        const newFile = acceptedFiles[0];
        setFile(Object.assign(newFile, {
          preview: URL.createObjectURL(newFile)
        }));
      }
    }
  });
  const [showAlert, setShowAlert] = useState(false); // New state for alert visibility
  const [progress, setProgress] = useState(0); // New state for progress

  const navigate = useNavigate();
  const handleCardClick = (flow) => {
    navigate(`/admin/flow/${flow.id}`, { state: { flow } });
  };

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => {
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);



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
          return prev + (0.25); // Increment progress over 6 seconds
        });
      }, 7.5); // Update every 100ms
  
      setTimeout(() => {
        setShowAlert(false); // Automatically close the alert after 6 seconds
        clearInterval(timer); // Clear interval on close
      }, 3000);
    }
    return () => {
      clearInterval(timer); // Cleanup timer on unmount
    };
  }, [showAlert]);
  

  console.log(flows)


  // Chakra Color Mode

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.500", "white");


  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log('Uploaded file:', file);
  };

  const handleRecordClick = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      // Start recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        audioChunksRef.current = []; // Clear the chunks
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        mb='20px'
        gridTemplateColumns={{ base: "1fr", md: "1fr", xl: "1fr" }} // Changed to one column
        gap={{ base: "20px", xl: "20px" }}
        display={{ base: "block", xl: "grid" }}>
        <Flex
          flexDirection='column'
          gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}>
          <Flex direction='column'>
            <Flex
              mt='45px'
              mb='20px'
              justifyContent='space-between'
              direction={{ base: "column", md: "row" }}
              align={{ base: "start", md: "center" }}>
              <Text color={textColor} fontSize='2xl' ms='24px' fontWeight='700'>
                Current flows:
              </Text>

            </Flex>
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap='20px'>

            <Box as='button' onClick={onOpen} borderRadius='md'  color='blue' px={4} h={8} width='auto' height='auto' border='2px' borderColor='blue.600'>
              <AddIcon boxSize={20} />
            </Box>

              <Modal isOpen={isOpen} size={'xl'} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>
                    Modal Title
                    <ModalBody>
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <Grid templateColumns="repeat(2, 1fr)" gap={8}> {/* Adjust gap as needed */}

                            <FormControl>
                              <FormLabel htmlFor='title'>Title</FormLabel>
                              <Input id='title' type='text' />
                            </FormControl>

                            <FormControl>
                              <FormLabel htmlFor='lastName'>Category</FormLabel>
                              <Input id='lastName' type='text' />
                            </FormControl>

                          </Grid>
                        </FormControl>

                        <Grid align="center"justify="center">
                        <Upload
                          minH={{ base: "auto", lg: "420px", "2xl": "365px" }}
                          pe='20px'
                          pb={{ base: "100px", lg: "20px" }}
                        />
                        </Grid>


                      </VStack>   
                    </ModalBody>
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                  </ModalBody>
                  <ModalFooter>
                    

                    <Button colorScheme="teal" onClick={() => {
                      onClose();
                      setShowAlert(true);
                  }}>
                    Done
                  </Button>
                    
                  </ModalFooter>
                </ModalContent>
              </Modal>
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
                        <AlertIcon boxSize='40px' mr={0} />
                        <AlertTitle mt={4} mb={1} fontSize='lg'>

                          Application submitted!
                        </AlertTitle>
                        <AlertDescription maxWidth='sm'>
                          Thanks for submitting your application. Our team will get back to you soon.
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

       
              
            {loading && <Text>Loading...</Text>}
              {error && <Text>Error: {error.message}</Text>}
              {flows && flows.map((flow, index) => (
                <Card key={index} maxW='sm' onClick={() => handleCardClick(flow)} cursor="pointer">
                  <CardBody>
                    <video borderRadius='lg' controls>
                      <source src={flow.video} type="video/mp4" />
                    </video>
                    <Stack mt='6' spacing='3'>
                      <Heading size='md'>{flow.name}</Heading>
                      <Text color='blue.600'>{flow.category}</Text>
                      <Text>{flow.description}</Text>
                      {flow.timeframe.map((tf, tfIndex) => (
                        <Text key={tfIndex}>
                          {`Start: ${tf.start_time} - End: ${tf.end_time}`}
                        </Text>
                      ))}
                      <Divider />
                      <Text as="sub">{flow.created_date}</Text>
                    </Stack>
                  </CardBody>
                </Card>
              ))}


              



            </SimpleGrid>
          </Flex>
        </Flex>


        
      </Grid>
      <Box
      bg="gray.800"
      borderRadius="md"
      p={6}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      borderWidth={2}
      borderColor="gray.600"
      height="300px"
      cursor="pointer"
      _hover={{ borderColor: 'gray.500' }}
      onClick={() => document.getElementById('audio-upload-input').click()}
    >
      <input
        id="audio-upload-input"
        type="file"
        accept="audio/*"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <VStack spacing={3}>
        <Icon as={FiUpload} boxSize={8} color="whiteAlpha.800" />
        <Text color="whiteAlpha.800" fontSize="lg" fontWeight="bold">
          Drop Audio Here
        </Text>
        <Text color="gray.400">- or -</Text>
        <Text color="blue.400" fontSize="lg" fontWeight="bold">
          Click to Upload
        </Text>
      </VStack>
      <Box display="flex" justifyContent="center" mt={6}>

        <IconButton
          aria-label="Record"
          icon={<BsMic />}
          colorScheme="pink"
          onClick={handleRecordClick}
          isRound
          variant={isRecording ? 'solid' : 'outline'}
        />
      </Box>
      {/* Playback of recorded audio */}
      {audioUrl && (
        <Box mt={4}>
          <audio controls src={audioUrl} />
        </Box>
      )}
      </Box>
      
    </Box>
    
  );
}