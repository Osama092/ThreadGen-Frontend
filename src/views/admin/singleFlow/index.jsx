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

import React, { useState, useRef } from "react";
import MiniStatistics from "components/card/MiniStatistics";

import { Box, Button, Input, Grid, GridItem, Text, useColorModeValue, SimpleGrid, Card, CardBody, Heading } from "@chakra-ui/react";

import ComplexTable from "views/admin/singleFlow/components/ComplexTable";
import { columnsDataComplex } from "views/admin/singleFlow/variables/columnsData";

//import Card from "components/card/Card.js";
import { useLocation } from 'react-router-dom';


import tableDataComplex from "views/admin/singleFlow/variables/tableDataComplex.json";

export default function SingleFlow() {


  const nameInputRef = useRef(null);
  const [isReadOnly, setIsReadOnly] = useState(true);


  const textColor = useColorModeValue("secondaryGray.900", "white");

  const location = useLocation();
  const { flow } = location.state || {};

  const [isEditing, setIsEditing] = useState(false);
  
  // Handler to toggle between edit and save modes
  const handleToggle = () => {
    setIsEditing(!isEditing);
    setIsReadOnly(!isReadOnly);
    if (!isEditing) {
      setTimeout(() => {
        nameInputRef.current.focus();
      }, 0);
    }
  };

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

          <Card>
        <CardBody>
          <Grid
            h="auto"
            templateRows="repeat(1, 1fr)"
            templateColumns="repeat(4, 1fr)"
            gap={4}
          >
            <GridItem colSpan={2} >
              <MiniStatistics growth='+23%' name='Sales' value='$574.34' width={{ base: "100%", md: "auto" }} />
            </GridItem>
            <GridItem colSpan={2} >
              <MiniStatistics growth='+23%' name='Sales' value='$574.34' width={{ base: "100%", md: "auto" }} />
            </GridItem>
                
            <GridItem colSpan={2} >
              <Heading as='h4' size='md'>Title</Heading>
              <Input focusBorderColor='lime' value={flow.name} ref={nameInputRef} isReadOnly={isReadOnly} />
              </GridItem>
            <GridItem colSpan={2} display="flex" justifyContent="flex-end" alignItems="flex-end">
            <Button w='50%' size="lg" variant="brand" onClick={handleToggle}>
                    {isEditing ? 'Save' : 'Edit'}
                  </Button>
            </GridItem>
                


            <GridItem colSpan={4} >
              <Heading as='h4' size='md'>Description</Heading>
              <Input focusBorderColor='lime' value={flow.description} ref={nameInputRef} isReadOnly={isReadOnly} />
            </GridItem>

            <GridItem colSpan={2}>
              <Heading as='h4' size='md'>Creation date</Heading>
              <Text>{flow.created_date}</Text>
            </GridItem>
            <GridItem colSpan={2} >
            <Heading as='h4' size='md'>Time frame</Heading>
                  {flow.timeframe.map((tf, tfIndex) => (
                    <Text key={tfIndex}>
                      {`Start: ${tf.start_time} - End: ${tf.end_time}`}
                    </Text>
                  ))}
            </GridItem>

          </Grid>
        </CardBody>
      </Card>
        </SimpleGrid>

        {/* Second Row with One Column for the Last Card */}
        <Card mt='20px'>
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
