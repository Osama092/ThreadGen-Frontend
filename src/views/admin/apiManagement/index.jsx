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

// Chakra imports
import { Box, Button, Grid, SimpleGrid, useColorModeValue, Card, CardBody, VStack, Input, FormLabel, FormControl, CardHeader } from "@chakra-ui/react";
// Assets

import React, { useState, useRef } from "react";

import ComplexTable from "views/admin/apiManagement/components/ComplexTable";


export default function ApiManagement() {


  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} mt='1%'>
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "1fr",
        }}
        templateRows={{
          base: "1fr",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}>
        <SimpleGrid columns={{ base: 1, md: 1, xl:  1}} gap='20px' mb='20px'>
          <ComplexTable />
        </SimpleGrid>
      </Grid>
      
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "1.34fr 4.62fr",
        }}
        templateRows={{
          base: "repeat(2, 1fr)",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}>
        <SimpleGrid
        columns={{ base: 1, md: 1, lg: 1, "2xl": 1 }}
        gap='20px'
        mb='20px'>
        <Card>
          <CardHeader>
            lksdfjlsdjk
          </CardHeader>
          <CardBody>
              <Box>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel htmlFor='title'>API key</FormLabel>
                    <Input id='title' type='text' />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor='lastName'>Flow id</FormLabel>
                    <Input id='lastName' type='text' />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor='ttsText'>TTS text</FormLabel>
                    <Input id='ttsText' type='text' />
                  </FormControl>
                  <Button mt={4}>Submit</Button>
                </VStack>
            </Box>
          </CardBody>
        </Card>

        </SimpleGrid>
        <Card>
          <CardBody>
          <video controls style={{ width: '100%', height: 'auto' }}>
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            </video>
          </CardBody>
              </Card>

        
      </Grid>
    </Box>
  );
}
