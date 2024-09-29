import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from "react";

import { Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';

import Upload from "views/admin/flowsManagement/components/Upload";

import { Box, Button, Flex, Grid, Text, VStack, useColorModeValue, SimpleGrid, FormControl, FormLabel } from "@chakra-ui/react";


import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'
import { CloseButton } from '@chakra-ui/react';
import { Progress } from '@chakra-ui/react'

import { Card, CardBody, Image, Stack, Heading, Divider  } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';

import { AddIcon } from '@chakra-ui/icons'
import useGetFlows from 'hooks/flows/useGetFlows';


export default function FlowManagement() {  
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { flows, loading, error, refetch} = useGetFlows()
  const videoRef = useRef(null);

  const [file, setFile] = useState(null);

  const [showAlert, setShowAlert] = useState(false); 
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();
  const handleCardClick = (flow) => {
    navigate(`/admin/flow/${flow.id}`, { state: { flow } });
  };

  useEffect(() => {
    return () => {
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);



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
  

  const textColor = useColorModeValue("secondaryGray.900", "white");

  
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
                Current flows:
              </Text>

            </Flex>
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap='20px'>

            <Box as='button' onClick={onOpen} borderRadius='md'  color='blue' px={4} h={8} width='auto' height='auto' border='2px' borderColor='blue.600' maxW='sm'>
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
              
            {showAlert && (
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
              <Box  onClick={() => handleCardClick(flow)} cursor="pointer"> 
                <Card key={index} maxW='sm'  variant='unstyled'>
                  <CardBody>
                    <div
                      style={{
                        width: '100%',
                        borderTopLeftRadius: '10px',
                        borderTopRightRadius:'10px',
                        height: '300px', // Fixed height for all videos
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
                        background: '#000', // Background color for empty space
                      }}
                    >
                      <video  controls re= {videoRef} style={{
                        display: 'block', // Block-level to fill container width
                        width: '100%',
                        height: '100%',

                        objectFit: 'cover', // Maintain aspect ratio while filling the container
                      }}>
                        <source src={flow.video} type="video/mp4" />
                      </video>
                    </div>
                  </CardBody>
                </Card>
                <Card
                  maxW='sm'
                  pl={2}
                  variant='unstyled' 
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderBottomLeftRadius: '10px',
                    borderBottomRightRadius: '10px',
                    borderTopLeftRadius: '0px',
                    borderTopRightRadius: '0px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}
                >
                  <CardBody >
                    <Stack mt='2' mb='2' spacing='3'>
                      <Heading size='md'>{flow.name}</Heading>
                      <Text>{flow.description}</Text>
                      {flow.timeframe.map((tf, tfIndex) => (
                        <Text key={tfIndex}>
                          {`Start: ${tf.start_time} - End: ${tf.end_time}`}
                        </Text>
                      ))}
                      <Divider />
                      <Text as="sup">{flow.created_date}</Text>
                    </Stack>
                  </CardBody>
                </Card>
              </Box>
            ))}
            </SimpleGrid>
          </Flex>
        </Flex>
      </Grid>
    </Box>
  );
}