import React, { useState, useEffect } from "react";
import {
  useColorModeValue,
  Box,
  Flex,
  Grid,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  VStack,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import FileUploadArea from 'views/admin/CampaignsManagement/components/Upload';
import { useUserCampaigns, useAddCampaign } from 'hooks/useCampaign';
import { useUser } from '@clerk/clerk-react';
import useGetUserThreads from 'hooks/flows/useGetUserThreads';
import useGetUserApiKeys from 'hooks/apiKeys/useGetUserApiKeys';

// CampaignRow Component
function CampaignRow(props) {
  const { name, description, threadName, totalRequests, onClick } = props;
  const textColor = useColorModeValue("gray.700", "white");
  const bgColor = useColorModeValue("#F8F9FA", "gray.800");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Flex
      my="1rem"
      justifyContent="space-between"
      borderRadius="16px"
      bg={bgColor}
      p="24px"
      boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
      border="1px solid"
      borderColor={borderColor}
      _hover={{
        bg: hoverBgColor,
        cursor: "pointer",
        boxShadow: "lg",
        transition: "all 0.3s ease"
      }}
      onClick={onClick}
      transition="all 0.2s ease"
    >
      <Flex direction="column" width="50%">
        <Text color={textColor} fontSize="md" fontWeight="700">
          {name}
        </Text>
        <Text color={textColor} fontSize="sm" fontWeight="400" mt="6px">
          {description}
        </Text>
      </Flex>
      <Flex direction="column" width="25%" justifyContent="center">
        <Text color={textColor} fontSize="md" fontWeight="500">
          {threadName}
        </Text>
      </Flex>
      <Flex direction="column" width="25%" justifyContent="center" alignItems="center">
        <Text color={textColor} fontSize="md" fontWeight="500">
          {totalRequests.toLocaleString()}
        </Text>
      </Flex>
    </Flex>
  );
}

// Add Campaign Modal Component
function AddCampaignModal({ isOpen, onClose, onAddCampaign, user_id }) {
  const { user } = useUser();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    threadName: "",
    apiKey: "",
    file: null,
    user_id: user_id // Use the prop passed from parent
  });

  const [fileData, setFileData] = useState(null);
  const toast = useToast();
  const { createCampaign, loading, error, success } = useAddCampaign();

  // Use hooks to fetch threads and API keys
  const { threads, loading: threadsLoading, error: threadsError } = useGetUserThreads(user_id);
  const { keys, loading: keysLoading, error: keysError } = useGetUserApiKeys(user_id);

  // Handle API error notifications
  useEffect(() => {
    if (error) {
      toast({
        title: "Error creating campaign",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    if (threadsError) {
      toast({
        title: "Error loading flows",
        description: "Could not load available flows",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    if (keysError) {
      toast({
        title: "Error loading API keys",
        description: "Could not load available API keys",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [error, threadsError, keysError, toast]);

  // Handle API success notifications
  useEffect(() => {
    if (success) {
      toast({
        title: "Campaign created",
        description: "Your campaign was successfully created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [success, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (file) => {
    setFormData(prev => ({ ...prev, file }));
  };

  const handleDataProcessed = (data) => {
    setFileData(data);
    setFormData(prev => ({ ...prev, fileData: data }));
  };

  const handleSubmit = async () => {
    try {
      // Calculate total requests based on file data
      const totalRequests = fileData ? fileData.records : 0;

      const campaignData = {
        ...formData,
        totalRequests
      };

      await createCampaign(campaignData, (newCampaign) => {
        // Pass new campaign to parent component
        onAddCampaign({
          name: newCampaign.campaign_name,
          description: newCampaign.campaign_description,
          threadName: newCampaign.used_thread,
          totalRequests: newCampaign.tts_text_list?.length || 0,
          status: newCampaign.status || "pending",
          tts_text_list: newCampaign.tts_text_list || []
        });
        onClose();
      });
    } catch (err) {
      console.error("Error creating campaign:", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Campaign</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Campaign Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter campaign name"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter campaign description"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Flow Name</FormLabel>
              {threadsLoading ? (
                <Spinner size="sm" />
              ) : (
                <Select
                  name="threadName"
                  value={formData.threadName}
                  onChange={handleInputChange}
                  placeholder="Select flow"
                  isDisabled={threadsLoading || threads.length === 0}
                >
                  {threads.filter((thread) => thread.status === "ready").map((thread) => (
                      <option key={thread.thread_id} value={thread.thread_name}>
                        {thread.thread_name}
                      </option>
                  ))}
                </Select>
              )}
              {threads.length === 0 && !threadsLoading && (
                <Text fontSize="sm" color="red.500" mt={1}>
                  No flows available
                </Text>
              )}
            </FormControl>

            <FormControl isRequired>
              <FormLabel>API Key</FormLabel>
              {keysLoading ? (
                <Spinner size="sm" />
              ) : (
                <Select
                  name="apiKey"
                  value={formData.apiKey}
                  onChange={handleInputChange}
                  placeholder="Select API key"
                  isDisabled={keysLoading || keys.length === 0}
                >
                  {keys.map((key) => (
                    <option key={key.key_id} value={key.api_key}>{key.api_key}</option>
                  ))}
                </Select>
              )}
              {keys.length === 0 && !keysLoading && (
                <Text fontSize="sm" color="red.500" mt={1}>
                  No API keys available
                </Text>
              )}
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Upload File</FormLabel>
              <FileUploadArea
                onFileUpload={handleFileUpload}
                onDataProcessed={handleDataProcessed}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isDisabled={
              !formData.name ||
              !formData.threadName ||
              !formData.apiKey ||
              !formData.file ||
              loading ||
              threadsLoading ||
              keysLoading
            }
            isLoading={loading}
            loadingText="Creating..."
          >
            {error ? "Retry" : "Create Campaign"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// Main CampaignsManagement Component
export default function CampaignsManagement() {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const bgColor = useColorModeValue("#F8F9FA", "gray.800");
  const tableTextColor = useColorModeValue("gray.700", "white");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { user, isLoaded: isUserLoaded } = useUser();
  const navigate = useNavigate();

  // Local state for campaigns (combine backend data with any local additions)
  const [campaigns, setCampaigns] = useState([]);

  // Use the custom hook to fetch campaigns, but only if user is loaded
  const { campaigns: fetchedCampaigns, loading, error, refetch } =
    useUserCampaigns(isUserLoaded && user ? user.id : null);

  // Update local campaigns state when fetched data changes
  useEffect(() => {
    if (fetchedCampaigns && fetchedCampaigns.length > 0) {
      // Transform the API data format to component format but preserve all original data
      const formattedCampaigns = fetchedCampaigns.map(campaign => ({
        name: campaign.campaign_name,
        description: campaign.campaign_description,
        threadName: campaign.used_thread,
        totalRequests: campaign.tts_text_list?.length || 0,
        status: campaign.status || "pending",
        id: campaign.campaign_id,
        // Store the complete original data for passing to single campaign view
        raw: campaign
      }));

      setCampaigns(formattedCampaigns);
    }
  }, [fetchedCampaigns]);

  // Show error toast if API fetch fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading campaigns",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  // Navigate to campaign details page with campaign data
  const handleCampaignClick = (campaignName) => {
    // Find the clicked campaign in our local state
    const campaign = campaigns.find(c => c.name === campaignName);

    if (campaign) {
      // URL-encode the campaign name to handle special characters in the URL
      const encodedName = encodeURIComponent(campaignName);

      // Navigate with state containing the full campaign data
      navigate(`/admin/single-campaign/${encodedName}`, {
        state: { campaignData: campaign.raw }
      });
    }
  };

  const handleAddCampaign = (newCampaign) => {
    setCampaigns([...campaigns, newCampaign]);
    // Refetch from backend to ensure we have the latest data
    refetch();
  };

  // Show loading state if user data is not yet loaded
  if (!isUserLoaded) {
    return (
      <Box pt={{ base: "180px", md: "80px", xl: "80px" }} textAlign="center">
        <Spinner size="xl" color="brand.500" thickness="4px" />
        <Text mt={4}>Loading user data...</Text>
      </Box>
    );
  }

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Grid
        mb="20px"
        gridTemplateColumns={{ base: "1fr", md: "1fr", xl: "1fr" }}
        gap={{ base: "20px", xl: "20px" }}
        display={{ base: "block", xl: "grid" }}
      >
        <Flex
          flexDirection="column"
          gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}
        >
          <Flex direction="column">
            <Flex
              mt="45px"
              mb="20px"
              justifyContent="space-between"
              direction={{ base: "column", md: "row" }}
              align={{ base: "start", md: "center" }}
            >
              <Text color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
                Current Campaigns:
              </Text>
              <Flex me="24px">
                <Box
                  as="button"
                  bg="blue.500"
                  color="white"
                  py="10px"
                  px="20px"
                  borderRadius="12px"
                  fontSize="sm"
                  fontWeight="600"
                  _hover={{ bg: "brand.600" }}
                  _active={{ bg: "brand.700" }}
                  transition="all .3s ease"
                  onClick={onOpen}
                >
                  + Add Campaign
                </Box>
              </Flex>
            </Flex>

            {/* Campaign Table Header */}
            <Flex
              px="24px"
              justify="space-between"
              mb="10px"
              align="center"
            >
              <Text
                color={tableTextColor}
                fontSize="md"
                fontWeight="700"
                width="50%"
              >
                Campaign
              </Text>
              <Text
                color={tableTextColor}
                fontSize="md"
                fontWeight="700"
                width="25%"
              >
                Used Flow
              </Text>
              <Text
                color={tableTextColor}
                fontSize="md"
                fontWeight="700"
                width="25%"
                textAlign="center"
              >
                Total Records
              </Text>
            </Flex>

            {/* Campaign Data Rows */}
            <Flex direction="column">
              {loading ? (
                <Flex justify="center" align="center" p={8}>
                  <Spinner size="xl" color="brand.500" thickness="4px" />
                </Flex>
              ) : campaigns.length > 0 ? (
                campaigns.map((campaign, index) => {
                  return (
                    <CampaignRow
                      key={index}
                      name={campaign.name}
                      description={campaign.description}
                      threadName={campaign.threadName}
                      totalRequests={campaign.totalRequests}
                      onClick={() => handleCampaignClick(campaign.name)}
                    />
                  );
                })
              ) : (
                <Flex
                  justify="center"
                  align="center"
                  p={8}
                  borderRadius="md"
                  bg={bgColor}
                  color={textColor}
                >
                  <Text fontSize="lg">No campaigns found. Create your first campaign using the "Add Campaign" button.</Text>
                </Flex>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Grid>

      {/* Add Campaign Modal - Only pass user_id if user is loaded */}
      {user && (
        <AddCampaignModal
          isOpen={isOpen}
          onClose={onClose}
          onAddCampaign={handleAddCampaign}
          user_id={user.id}
        />
      )}
    </Box>
  );
}