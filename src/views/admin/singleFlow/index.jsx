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
import { useState } from 'react';

import React from "react";


import MiniStatistics from "components/card/MiniStatistics";



// Chakra imports
import {
  Box,
  Button,

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


import tableDataComplex from "views/admin/singleFlow/variables/tableDataComplex.json";


import {
  Editable,
  EditableInput,
  EditablePreview,
} from '@chakra-ui/react'

export default function Marketplace() {

  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };
  
  

  const [selectedOption, setSelectedOption] = useState("+234");

  // Function to handle menu item selection
  const handleSelect = (option) => {
    setSelectedOption(option);
  };
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

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
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              </video>        
              
            </CardBody>
          </Card>

          <Card height='auto'>
            <CardBody>
              <SimpleGrid columns={{ base:'3' }} spacing='20px'>
                <MiniStatistics growth='+23%' name='Sales' value='$574.34' width='sm' />

                <MiniStatistics growth='+23%' name='Sales' value='$574.34' width={{ base: "100%", md: "auto" }} />

                <MiniStatistics growth='+23%' name='Sales' value='$574.34' width={{ base: "100%", md: "auto" }} />
              </SimpleGrid>

                        

              <SimpleGrid columns={3} spacing='20px' ml='5%' mt='5%'>
                <HStack align='start'>
                  <VStack align='start'>
                    <Heading as='h4' size='md'>Title</Heading>
                    <Editable defaultValue='Take some chakra'>
                      <EditablePreview />
                      <EditableInput />
                    </Editable>
                  </VStack>
                </HStack>


                
                <HStack align='start'>
                  <VStack align='start'>
                    <Heading as='h4' size='md'>Description</Heading>
                    <Editable defaultValue='Take some chakra'>
                      <EditablePreview />
                      <EditableInput />
                    </Editable>
                  </VStack>
                </HStack>

                <HStack align='start'>
                  <VStack align='start'>
                    <Heading as='h4' size='md'>Created at</Heading>
                    <Editable defaultValue='Take some chakra' >
                      <EditablePreview />
                      <EditableInput />
                    </Editable>
                  </VStack>
                </HStack>
                
                <HStack>
                  <VStack align='start'>
                    <Heading as='h4' size='md'>Time frame</Heading>
                    <Editable defaultValue='Take some chakra' >
                      <EditablePreview />
                      <EditableInput />
                    </Editable>
                  </VStack>
                </HStack>

                <HStack align='start'>
                  <Button variant="brand" size='lg' px={9}>Save</Button>
                </HStack>
                <HStack align='start'>
                  <Button variant="brand" size='lg' px={9}>Delete</Button>

                </HStack>

                

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
