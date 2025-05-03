import { Box, Button, Grid, Flex, SimpleGrid, useColorModeValue, Card, CardBody, VStack, Input, FormLabel, FormControl, CardHeader, Text, Icon } from "@chakra-ui/react";
import { MdVideoLibrary } from "react-icons/md";
import React, { useState } from "react";
import ComplexTable from "views/admin/apiManagement/components/ComplexTable";
import useGenerateVideo from "hooks/apiKeys/useGenVid";

export default function ApiManagement() {
  const [apiKey, setApiKey] = useState('');
  const [threadName, setThreadName] = useState('');
  const [ttsText, setTtsText] = useState('');
  const [iframeUrl, setIframeUrl] = useState('');
  const [showIframe, setShowIframe] = useState(false);
  const { generate, loading, error, videoUrl, configPath } = useGenerateVideo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Generate the video first
    const result = await generate(apiKey, threadName, ttsText);
    console.log("Result from generate:", result);
    // Only proceed if we have a video URL
    if (videoUrl) {
      // Create and set the iframe URL with the form parameters and the video URL
      const timestamp = new Date().getTime();
      const url = `http://localhost:5000/player/index.html?apiKey=${encodeURIComponent(apiKey)}&threadName=${encodeURIComponent(threadName)}&ttsText=${encodeURIComponent(ttsText)}&video=${encodeURIComponent(videoUrl)}&_t=${timestamp}`;
      
      // Force iframe refresh by temporarily hiding it
      setShowIframe(false);
      
      // Use setTimeout to ensure React has time to process the state change
      setTimeout(() => {
        setIframeUrl(url);
        setShowIframe(true);
      }, 100);
    }
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
              SANDBOX
            </CardHeader>
            <CardBody>
              <Box>
                <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                  <FormControl>
                    <FormLabel htmlFor='apiKey'>API key</FormLabel>
                    <Input id='apiKey' type='text' value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor='threadName'>Thread Name</FormLabel>
                    <Input id='threadName' type='text' value={threadName} onChange={(e) => setThreadName(e.target.value)} />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor='ttsText'>TTS Text</FormLabel>
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
            {!showIframe ? (
              <Flex textAlign="center" py={10} px={6} alignItems="center" justifyContent="center" height="100%">
                <Box>
                  <Icon as={MdVideoLibrary} w={20} h={20} color="gray.500" />
                  <Text mt={3} fontSize="xl" color="gray.500">
                    No video available - Submit form to load video
                  </Text>
                </Box>
              </Flex>
            ) : (
              <Box>
                <iframe
                  id="dynamicIframe"
                  src={iframeUrl}
                  width="640"
                  height="360"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  key={iframeUrl} 
                ></iframe>
              </Box>
            )}
          </CardBody>
        </Card> 
      </Grid>
    </Box>
  );
}