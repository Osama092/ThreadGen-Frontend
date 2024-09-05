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
import { useState, useEffect } from 'react';

import React from "react";

import {
  Tag,
  TagLabel,

} from '@chakra-ui/react'

import {
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepSeparator,

  useDisclosure
} from '@chakra-ui/react';

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


const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: '100%',
  height: 'auto',
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const videoStyles = {
  display: 'block',
  width: '100%',
  height: 'auto'
};


export default function Marketplace() {

  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  // Split the value into two parts
  const firstRow = value.split('\n')[0];
  const secondRow = value.split('\n')[1] || '';


  
  const [activeStep, setActiveStep] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure()

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
  

  const [currentTime, setCurrentTime] = useState(0); // New state for current time

  

  const thumbElement = file ? (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <video
          src={file.preview}
          style={videoStyles}
          controls
          onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)} // Update current time
          onLoadedData={() => { URL.revokeObjectURL(file.preview) }}
        />
        <Text>Current Time: {currentTime.toFixed(2)} seconds</Text> {/* Display current time */}
      </div>
    </div>
  ) : null;





  const steps = [
    {
      title: 'Step 1',
      content: (
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

        </VStack>
      )
    },
    {
      title: 'Step 2',
      content: (


        <Grid align="center"justify="center">
          <Upload
            minH={{ base: "auto", lg: "420px", "2xl": "365px" }}
            pe='20px'
            pb={{ base: "100px", lg: "20px" }}
          />
          </Grid>


          
      )
    },
  ];

  // Chakra Color Mode

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.500", "white");
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
                    <Stepper size='md' index={activeStep}>
                      {steps.map((step, index) => (
                        <Step key={index} onClick={() => setActiveStep(index)}>
                          <StepIndicator>
                            <StepStatus
                              complete={<StepIcon />}
                              incomplete={<StepNumber />}
                              active={<StepNumber />}
                            />
                          </StepIndicator>

                          <Box flexShrink='0'>
                            <StepTitle>{step.title}</StepTitle>
                          </Box>

                          <StepSeparator />
                        </Step>
                      ))}
                    </Stepper>
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    {steps[activeStep].content}
                  </ModalBody>
                  <ModalFooter>
                    {activeStep > 0 && (
                      <Button variant="outline" onClick={() => setActiveStep(activeStep - 1)} mr={3}>
                        Back
                      </Button>
                    )}
                    {activeStep < steps.length - 1 ? (
                      <Button colorScheme="teal" onClick={() => setActiveStep(activeStep + 1)}>
                        Next
                      </Button>
                    ) : (
                        <Button colorScheme="teal" onClick={() => {
                          onClose();
                          setShowAlert(true);
                      }}>
                        Done
                      </Button>
                    )}
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

              

              <Card maxW='sm'>
                <CardBody>
                    <video borderRadius='lg'>
                      <source src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" type="video/mp4" />
                  </video>
                  

                    <Stack mt='6' spacing='3'>
                      <Heading size='md'>Flow A</Heading>
                        <Text color='blue.600'>
                          Info C
                        </Text>
                        <Divider />
                        <Text as="sub">02/11/2024</Text>
                    </Stack>
                </CardBody>
              </Card>
              <Card maxW='sm'>
                <CardBody>
                  <video borderRadius='lg'>
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                  </video>


                  <Stack mt='6' spacing='3'>
                    <Heading size='md'>Flow A</Heading>
                      <Text color='blue.600'>
                        Info C
                      </Text>
                      <Divider />
                      <Text as="sub">02/11/2024</Text>
                  </Stack>
                </CardBody>
              </Card>
              


              <Card maxW='sm'>
                <CardBody>
                  <video borderRadius='lg'>
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                  </video>

                  <Stack mt='6' spacing='3'>
                    <Heading size='md'>Flow A</Heading>
                      <Text color='blue.600'>
                        Info C
                      </Text>
                      <Divider />
                      <Text as="sub">02/11/2024</Text>
                  </Stack>
                </CardBody>
              </Card>

              <Card maxW='sm'>
                <CardBody>
                  <video borderRadius='lg'>
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                  </video>
                  <Stack mt='6' spacing='3'>
                    <Heading size='md'>Flow A</Heading>
                      <Text color='blue.600'>
                        Info C
                      </Text>
                      <Divider />
                      <Text as="sub">02/11/2024</Text>
                  </Stack>
                </CardBody>
              </Card>

              <Card maxW='sm'>
                <CardBody>
                  <video borderRadius='lg'>
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                  </video>

                  <Stack mt='6' spacing='3'>
                    <Heading size='md'>Flow A</Heading>
                      <Text color='blue.600'>
                        Info C
                      </Text>
                      <Divider />
                      <Text as="sub">02/11/2024</Text>
                  </Stack>
                </CardBody>
              </Card>
            </SimpleGrid>
          </Flex>
        </Flex>
      </Grid>
    </Box>
  );
}