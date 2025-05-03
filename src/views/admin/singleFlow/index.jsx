import React, { useState, useEffect } from "react";
import MiniStatistics from "components/card/MiniStatistics";
import { 
  Box, 
  Grid, 
  GridItem, 
  Text, 
  useColorModeValue, 
  SimpleGrid, 
  Card, 
  CardBody,
  Flex
} from "@chakra-ui/react";
import ComplexTable from "views/admin/singleFlow/components/ComplexTable";
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

export default function SingleFlow() {
  const [threadData, setThreadData] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const bgCard = useColorModeValue("white", "navy.700");
  const borderColor = useColorModeValue("secondaryGray.100", "whiteAlpha.100");

  const location = useLocation();
  const { thread } = location.state || {};
  
  // Handle case when thread data is not available
  useEffect(() => {
    if (!thread) {
      // Redirect to flows management if no thread data
      navigate('/admin/flowsManagement');
      return;
    }
    
    setThreadData(thread);
  }, [thread, navigate]);

  // If thread data isn't available yet, show loading
  if (!threadData) {
    return (
      <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
        <Text>Loading thread data...</Text>
      </Box>
    );
  }

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Text color={textColor} fontSize='2xl' ms='24px' fontWeight='700' mb="20px">
        Thread Details
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap='20px' mb="20px">
        <Card
          bg={bgCard}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="20px"
        >
          <CardBody>
            <video controls borderRadius='xl' width='100%'>
              <source 
                src={`http://localhost:5000/userData/temp/${user.fullName}_${threadData.user_id}/${threadData.thread_name}/${threadData.thread_name}.mp4`} 
                type="video/mp4" 
              />
            </video>        
          </CardBody>
        </Card>

        <Card
          bg={bgCard}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="20px"
        >
          <CardBody>
            <Grid
              h="auto"
              templateRows="repeat(auto-fill, minmax(auto, 1fr))"
              templateColumns="repeat(4, 1fr)"
              gap={6}
            >
              <GridItem colSpan={2}>
                <MiniStatistics growth='+23%' name='Sales' value='$574.34' width={{ base: "100%", md: "auto" }} />
              </GridItem>
              <GridItem colSpan={2}>
                <MiniStatistics growth='+23%' name='Sales' value='$574.34' width={{ base: "100%", md: "auto" }} />
              </GridItem>
                  
              <GridItem colSpan={4}>
                <Text color={textColor} fontSize="2xl" fontWeight="700" mb={3}>
                  {threadData.thread_name}
                </Text>
              </GridItem>
                  
              <GridItem colSpan={4}>
                <Text color="gray.500" mb={5} fontSize="md">
                  {threadData.description}
                </Text>
              </GridItem>

              <GridItem colSpan={4}>
                <Flex justifyContent="flex-end">
                  <Text color="gray.400" fontSize="sm" fontStyle="italic">
                    Created: {threadData.created_at ? new Date(threadData.created_at).toLocaleDateString() : threadData.created_date}
                  </Text>
                </Flex>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card
        bg={bgCard}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="20px"
        mt='20px'
      >
        <CardBody>
          <ComplexTable 
            thread_name={threadData.thread_name} 
          />
        </CardBody>
      </Card>
    </Box>
  );
}