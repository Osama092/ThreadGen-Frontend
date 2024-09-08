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
import { useState, useRef } from 'react';

import React from "react";


import MiniStatistics from "components/card/MiniStatistics";



// Chakra imports
import {
  Box,
  Button,
  Input,
  Grid,

  Text,
  VStack,
  HStack,
  useColorModeValue,
  SimpleGrid,

} from "@chakra-ui/react";


import ComplexTable from "views/admin/singleFlow/components/ComplexTable";
import {

  columnsDataComplex,
} from "views/admin/singleFlow/variables/columnsData";
// Custom components

//import Card from "components/card/Card.js";
import { Card, CardBody, Heading  } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';


import tableDataComplex from "views/admin/singleFlow/variables/tableDataComplex.json";


import {
  Editable,
  EditableInput,
  EditablePreview,
} from '@chakra-ui/react'

export default function SingleFlow() {


  const [buttonText, setButtonText] = useState('Edit');
  const [isEditing, setIsEditing] = useState(false);
  const nameInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const [isReadOnly, setIsReadOnly] = useState(true);



  

  const handleButtonClick = () => {
    setButtonText(prevText => (prevText === 'Edit' ? 'Save' : 'Edit'));
    setIsEditing(prevState => !prevState);
    setIsReadOnly(!isReadOnly);
    nameInputRef.current.focus();
  };





  
  

  const textColor = useColorModeValue("secondaryGray.900", "white");

  const location = useLocation();
  const { flow } = location.state || {};


  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        mb='20px'
        gridTemplateColumns={{ base: "1fr", md: "1fr", xl: "1fr" }}
        gap={{ base: "20px", xl: "20px" }}
        display={{ base: "block", xl: "grid" }}>

        <Text color={textColor} fontSize='2xl' ms='24px' fontWeight='700'>
          Lorem Ipsum
        </Text>

        {/* First Row with Two Columns */}
        <SimpleGrid columns={{ base: 1, md: 2 }} gap='20px'>
          <Card maxW='xl'>
            <CardBody>
              <video controls borderRadius='xl'width='200%' >
                <source src={flow.video} type="video/mp4" />
              </video>        
              
            </CardBody>
          </Card>

          <Card height='auto'>
            <CardBody>
              <SimpleGrid columns={{ base:'2' }} spacing='20px'>
                <MiniStatistics growth='+23%' name='Sales' value='$574.34' width='sm' />

                <MiniStatistics growth='+23%' name='Sales' value='$574.34' width={{ base: "100%", md: "auto" }} />

              </SimpleGrid>

                        

              <SimpleGrid columns={2} spacing='20px' ml='5%' mt='5%'>
                
              <HStack align='start'>
                <VStack align='start'>
                  <Heading as='h4' size='md'>Title</Heading>
                    <Input focusBorderColor='lime' value={flow.description} ref={nameInputRef} isReadOnly={isReadOnly} />
                  </VStack>
              </HStack>
                
              <HStack align='start'>
                <Button variant="brand" size='lg' px={9} onClick={handleButtonClick} >
                  {buttonText}
                </Button>
              </HStack> 

              <HStack align='start'>
                <VStack align='start'>
                  <Heading as='h4' size='md'>Description</Heading>
                  <Input focusBorderColor='lime' value={flow.description} isReadOnly={isReadOnly} />
                </VStack>
              </HStack>

                <HStack>
                  <VStack align='start'>
                    <Heading as='h4' size='md'>Time frame</Heading>
                    {flow.timeframe.map((tf, tfIndex) => (
                      <Text key={tfIndex}>
                        {`Start: ${tf.start_time} - End: ${tf.end_time}`}
                      </Text>
                    ))}
                  </VStack>

                </HStack>

                <VStack align='start'>
                    <Heading as='h4' size='md'>Creation date</Heading>
                    <Text>{flow.created_date}</Text>
                </VStack>



                

              </SimpleGrid>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Second Row with One Column for the Last Card */}
        <Card>
          <CardBody>
          <ComplexTable
              columnsData={columnsDataComplex}
              tableData={tableDataComplex}
            />

          </CardBody>
        </Card>
      </Grid>
    </Box>
  );
}
