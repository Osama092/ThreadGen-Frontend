import {  MdPieChart } from 'react-icons/md';
import { Box, Icon, Grid, SimpleGrid, useColorModeValue, Button } from "@chakra-ui/react";
import { useUser } from '@clerk/clerk-react';
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, { useState, useEffect } from "react";
import { MdAttachMoney, MdBarChart, MdCalendarToday, MdMarkEmailUnread } from "react-icons/md";
import ComplexTable from "views/admin/mainDashboard/components/ComplexTable";
import TotalSpent from "views/admin/mainDashboard/components/TotalSpent";
import useSSE from 'hooks/useSSE'; // Import our custom hook
import { useKPIs } from "hooks/users/useKPI";



export default function Dashboard() {
  const { user } = useUser();
  const user_id = user?.id;

  // Use our custom SSE hook
  const { messages, connectionStatus, isLoading } = useSSE(user_id);
  
  // Calculate statistics from messages
  const totalRequests = messages.length;
  
  const { kpiData, isLoading: kpiLoading, formattedWatchTime } = useKPIs(user_id);

  useEffect(() => {
    if (kpiData) {
      console.log("number of KPIs:", kpiData.count);
    }
  }, [kpiData]);

  const unopenedRequests = kpiLoading || !kpiData ? 0 : totalRequests - kpiData.count;
  // Calculate average daily requests
  const calculateAvgDailyRequests = () => {
    if (messages.length === 0) return 0;
    
    // Get dates of all messages
    const dates = messages.map(msg => {
      const date = new Date(msg.created_at);
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    });
    
    // Count unique dates
    const uniqueDates = [...new Set(dates)];
    const uniqueDaysCount = uniqueDates.length;
    
    // Calculate average
    return uniqueDaysCount > 0 ? Math.round(messages.length / uniqueDaysCount) : 0;
  };
  
  const avgDailyRequests = calculateAvgDailyRequests();

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
            name='Total Requests'
            value={isLoading ? 'Loading...' : totalRequests.toString()}
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
            name='Avg Daily Requests'
            value={isLoading ? 'Loading...' : avgDailyRequests.toString()}
          />
          <MiniStatistics
            startContent={
              <IconBox
                w='56px'
                h='56px'
                bg={boxBg}
                icon={
                  <Icon w='32px' h='32px' as={MdMarkEmailUnread} color={brandColor} />
                }
              />
            }
            name='Unopened Requests'
            value={isLoading ? 'Loading...': unopenedRequests.toString()}
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

