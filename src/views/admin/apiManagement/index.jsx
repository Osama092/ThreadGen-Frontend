import { Box, Button, Spinner, Grid, Flex, SimpleGrid, useColorModeValue, Card, CardBody, VStack, Input, FormLabel, FormControl, CardHeader, Text, Icon, Select, Badge } from "@chakra-ui/react";
import { MdVideoLibrary } from "react-icons/md";
import React, { useState } from "react";
import ComplexTable from "views/admin/apiManagement/components/ComplexTable";
import useGenerateVideo from "hooks/apiKeys/useGenVid";
import useGetUserThreads from 'hooks/flows/useGetUserThreads';
import { useUser } from "@clerk/clerk-react"

export default function ApiManagement() {
  const [apiKey, setApiKey] = useState('');
  const [threadName, setThreadName] = useState('');
  const [ttsText, setTtsText] = useState('');
  const [iframeUrl, setIframeUrl] = useState('');
  const [showIframe, setShowIframe] = useState(false);
  const { generate, loading, error, videoUrl, remainingTries } = useGenerateVideo();
  const { user } = useUser();
  
  const { threads, loading: threadsLoading, error: threadsError } = useGetUserThreads(user.id);

  const handleInputChange = (e) => {
    setThreadName(e.target.value); // Update threadName directly
  };

  const baseUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Generate the video and get the result directly
    const result = await generate(apiKey, threadName, ttsText);
    
    // Use the result from the generate function instead of relying on the state
    if (result && result.video) {
      // Create and set the iframe URL with the form parameters and the video URL from the result
      const timestamp = new Date().getTime();
      const url = `${baseUrl}/player/index.html?apiKey=${encodeURIComponent(apiKey)}&threadName=${encodeURIComponent(threadName)}&ttsText=${encodeURIComponent(ttsText)}&video=${encodeURIComponent(result.video)}&_t=${timestamp}`;
      
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
              <Flex justify="space-between" align="center">
                <Text>SANDBOX</Text>
                {remainingTries !== null && (
                  <Badge 
                    colorScheme={remainingTries === 'unlimited' ? 'green' : remainingTries > 10 ? 'blue' : 'orange'}
                    variant="solid"
                  >
                    {remainingTries === 'unlimited' ? 'Unlimited' : `${remainingTries} tries left`}
                  </Badge>
                )}
              </Flex>
            </CardHeader>
            <CardBody>
              <Box>
                <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                  
                  <FormControl isRequired>
                    <FormLabel htmlFor='threadName'>Flow Name</FormLabel>

                    {
                      threadsLoading ? (
                        <Spinner size="sm" />

                      ) : (
                          <Select
                            name="threadName"
                            value={threadName}
                            onChange={handleInputChange}
                            placeholder="Select Thread"
                            isDisabled={threadsLoading || threads.length === 0}
                          >
                            {threads.filter((thread) => thread.status === "ready").map((thread) => (
                              <option key={thread.thread_id} value={thread.thread_name}>
                                {thread.thread_name}
                              </option>
                              ))}
                          </Select>
                      )
                    }
                    {threads.length === 0 && !threadsLoading && (
                      <Text fontSize="sm" color="red.500" mt={1}>
                        No Flows available
                      </Text>
                    )}
                     
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel htmlFor='apiKey'>API key</FormLabel>
                    <Input id='apiKey' type='text' value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor='ttsText'>TTS Text</FormLabel>
                    <Input id='ttsText' type='text' value={ttsText} onChange={(e) => setTtsText(e.target.value)} />
                  </FormControl>
                  <Button 
                    mt={4} 
                    type="submit" 
                    isLoading={loading}
                    loadingText="Generating..."
                  >
                    Submit
                  </Button>
                </VStack>
                {/* Removed the error display since we're now using toasts */}
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