import {  MdPieChart } from 'react-icons/md';
import { Box, Icon, Grid, SimpleGrid, useColorModeValue, Button } from "@chakra-ui/react";

import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React from "react";
import { MdAttachMoney, MdBarChart } from "react-icons/md";
import ComplexTable from "views/admin/mainDashboard/components/ComplexTable";
import TotalSpent from "views/admin/mainDashboard/components/TotalSpent";

export default function Dashboard() {

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
        gap={{ base: "20px", xl: "20px" }}
      >
        <SimpleGrid
          columns={{ base: 1, md: 1, lg: 1, "2xl": 1 }}
          gap='20px'
          mb='20px'
        >
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
        gap={{ base: "20px", xl: "20px" }}
      >
        <SimpleGrid columns={{ base: 1, md: 1, xl:  1}} gap='20px' mb='20px'>
          <ComplexTable />
        </SimpleGrid>

      </Grid>
      
    </Box>
  );
}
