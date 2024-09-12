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
import { Box, SimpleGrid, Grid } from "@chakra-ui/react";
import { Link, HStack} from "@chakra-ui/react"



import ComplexTable from "views/admin/dataTables/components/ComplexTable";
import {

  columnsDataComplex,
} from "views/admin/dataTables/variables/columnsData";

import tableDataComplex from "views/admin/dataTables/variables/tableDataComplex.json";
import React ,{ useContext } from "react";

import { Card, CardBody, Button, Heading, Text, Badge, } from '@chakra-ui/react'
import { SubscriptionsContext } from 'contexts/SubscriptionContext';


export default function Billing() {

  
  const { subscriptions, loading, error } = useContext(SubscriptionsContext);

  
  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Grid
        mb='20px'
        templateColumns={{
          base: "1fr",
        }}
        templateRows={{
          base: "repeat(1, 1fr)",
          lg: "1fr",
        }}
        spacing={{ base: "20px", xl: "20px" }}>
        
        <Heading mb={5}>Plan overview</Heading>


        <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline'
          borderRadius="xl"

          mb={5}
        >
          <CardBody>

          <SimpleGrid minChildWidth='120px' spacing='40px'>
            <Box height='auto' display="flex" alignItems="center">
              <Badge colorScheme="blue" fontSize="lg" px={4} py={2}>Current plan</Badge> 

            </Box>
            <Box height='auto' display="flex" alignItems="center">
              <Text mr="30%"> 
                <Text>Plan description</Text>
                <Text whiteSpace="nowrap">Lorem ipsum solor sit amet</Text>
              </Text>
            </Box>
            <Box height='auto' width="100%" display="flex" alignItems="center"></Box>

            <Box height='auto' display="flex" alignItems="center" justifyContent="flex-end">
              <Button variant='solid' colorScheme='blue'>Change Plan</Button> 
            </Box>

          </SimpleGrid>
          </CardBody>
        </Card>


        <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline'
          borderRadius="xl"

  
        >
          <CardBody>

          <SimpleGrid minChildWidth='120px' spacing='40px'>
            <Box height='auto' display="flex" alignItems="center">
              <Badge colorScheme="blue" fontSize="lg" px={4} py={2}>Renewal</Badge> 

            </Box>
            <Box height='auto' display="flex" alignItems="center">
              <HStack spacing={2}> {/* Added HStack for spacing */}
                <label>Date</label>
                <Text type="date"> 2024-08-24 </Text> 
              </HStack>
            </Box>
            <Box height='auto' display="flex" alignItems="center" >
              <HStack spacing={2}>
                <label>Amount</label>
                <Text>199.00 <Text as="span">$</Text></Text>
              </HStack>
            </Box>
            <Box height='auto' display="flex" alignItems="center" ></Box>

          </SimpleGrid>
          </CardBody>
        </Card>

        <SimpleGrid minChildWidth='120px' >
          <Box height='auto'>
            <Text>
            Need unlimited api usage on a bigger scale?  {" "}
              <Link color="brand.500" href="#">
                Contact Sales
              </Link>
            </Text>
          </Box>
        </SimpleGrid>
        

        <Heading mb={5}>Payment method</Heading>
        <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline'
          borderRadius="xl"

          mb={5}
        >
          <CardBody>

          <SimpleGrid minChildWidth='120px' spacing='40px'>
            <Box height='auto' display="flex" alignItems="center">
              <Badge colorScheme="blue" fontSize="lg" px={4} py={2}>Card details</Badge> 

            </Box>
              <Box height='auto' display="flex" alignItems="center">
                <HStack>
                  <svg viewBox="0 0 24 24"  width="35" height="35" focusable="false" className="chakra-icon css-m94y6i">
                    <path fill="currentColor" d="M1.406 17.023a2.461 2.461 0 002.461 2.46h14.766a2.461 2.461 0 002.46-2.46v-6.768H1.407v6.768zm2.9-3.34a1.318 1.318 0 011.319-1.318h2.11a1.318 1.318 0 011.318 1.318v.879a1.318 1.318 0 01-1.319 1.318H5.625a1.318 1.318 0 01-1.318-1.318v-.879zM18.633 4.014H3.867a2.46 2.46 0 00-2.46 2.461v1.143h19.687V6.475a2.46 2.46 0 00-2.461-2.46z"></path>
                  </svg>
                  <Text>*** **** **** 555</Text>
                </HStack>
            </Box>
            <Box height='auto' display="flex" alignItems="center" >
              <HStack spacing={2}>
                  <label>Expires</label>
                  <Text>60/70</Text>
              </HStack>
            </Box>

            <Box height='auto' width="100%" display="flex" alignItems="center" justifyContent="flex-end">
              <Button variant='solid' colorScheme='blue'>Change Payment method</Button> 

            </Box>
          </SimpleGrid>
          </CardBody>
        </Card>
        

        <Heading mb={5}>History</Heading>

        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />

      </Grid>
      <div>
      <h1>Subscriptions</h1>
      <ul>
        {subscriptions.map(subscription => (
          <li key={subscription.id}>{subscription.name}</li>
        ))}
      </ul>
    </div>
    </Box>
  );
}
