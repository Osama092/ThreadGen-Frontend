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
import axios from 'axios';
import  { useEffect, useState } from 'react';
import { ChakraProvider, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Heading, Spinner, Center } from '@chakra-ui/react';

// Chakra imports
import {
  Box,
  Icon,
  Grid,
  SimpleGrid,
  useColorModeValue,
  Flex,
  Text
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
import ComplexTable from "views/admin/default/components/ComplexTable";
import TotalSpent from "views/admin/default/components/TotalSpent";
import {
  columnsDataComplex,
} from "views/admin/default/variables/columnsData";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";
export default function Dashboard() {

  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");




  

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
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
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
              }
            />
          }
          name='Earnings'
          value='$350.4'
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdPieChart} color={brandColor} />
              }
            />
          }
          name='Usage'
          value='100/50'
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name='Ovreage fee'
          value='$642.39'
        />

        </SimpleGrid>
              
      <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap='20px' mb='20px'>
          <TotalSpent />
        </SimpleGrid>
        
      </Grid>


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
            <ComplexTable columnsData={columnsDataComplex} tableData={tableDataComplex} />
          </SimpleGrid>
        
          
      </Grid>

      

      
    </Box>
  );
}
