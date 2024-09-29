import { Box, Button, Grid, Flex, SimpleGrid, useColorModeValue, Card, CardBody, VStack, Input, FormLabel, FormControl, CardHeader, Text, Icon } from "@chakra-ui/react";
import { MdVideoLibrary } from "react-icons/md";
import React, { useState } from "react";
import ComplexTable from "views/admin/apiManagement/components/ComplexTable";
import useGenerateVideo from "hooks/apiKeys/useGenVid";

export default function ApiManagement() {
  const [apiKey, setApiKey] = useState('');
  const [flowId, setFlowId] = useState('');
  const [ttsText, setTtsText] = useState('');
  const { generate, loading, error, videoUrl } = useGenerateVideo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await generate(apiKey, flowId, ttsText);
  };

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
                <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                  <FormControl>
                    <FormLabel htmlFor='apiKey'>API key</FormLabel>
                    <Input id='apiKey' type='text' value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor='flowId'>Flow id</FormLabel>
                    <Input id='flowId' type='text' value={flowId} onChange={(e) => setFlowId(e.target.value)} />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor='ttsText'>TTS text</FormLabel>
                    <Input id='ttsText' type='text' value={ttsText} onChange={(e) => setTtsText(e.target.value)} />
                  </FormControl>
                  <Button mt={4} type="submit" isLoading={loading}>Submit</Button>
                </VStack>
                {error && <p>Error: {error.message}</p>}

              </Box>
            </CardBody>
          </Card>
        </SimpleGrid>
        
        <Card>
          <CardBody>
            {videoUrl ? (
              <video controls style={{ width: '100%', height: 'auto' }}>
                <source src={videoUrl} type="video/mp4" />
              </video>
            ) : (
              <Flex textAlign="center" py={10} px={6} alignItems="center" justifyContent="center" height="100%">
                <Box>
                  <Icon as={MdVideoLibrary} w={20} h={20} color="gray.500" />
                  <Text mt={3} fontSize="xl" color="gray.500">
                    No video available
                  </Text>
                </Box>
              </Flex>
            )}
          </CardBody>
        </Card>  
      </Grid>
    </Box>
  );
}