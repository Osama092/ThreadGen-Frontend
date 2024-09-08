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
import {  MdPieChart } from 'react-icons/md';


// Chakra imports
import {
  Box,
  Icon,
  Button,
  Grid,
  HStack,
  SimpleGrid,
  useColorModeValue,
  Flex,
  Text,
  Card,
  CardBody,
  VStack,
  Input,
  FormLabel,
  FormControl,
  CardHeader
} from "@chakra-ui/react";
// Assets
// Custom components
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React from "react";
import {
  MdAttachMoney,
  MdBarChart,
} from "react-icons/md";
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
    

      <Box>
        <Card>
          <CardHeader>
            lksdfjlsdjk
          </CardHeader>
          <CardBody>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
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
              <Box display='flex' justifyContent="flex-end">
                
                  <video controls style={{ width: '100%', height: 'auto' }}>
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                  </video>
              </Box>

            </Grid>
          </CardBody>
        </Card>
      </Box>

    </Box>
  );
}
