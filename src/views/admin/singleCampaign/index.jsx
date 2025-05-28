// SingleCampaign.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Text,
  useColorModeValue,
  Card,
  CardBody,
  Flex,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  AspectRatio,
  IconButton,
  Progress,
  Input,
  Textarea,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
} from "@chakra-ui/react";
import { EditIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useEditCampaign } from "hooks/useCampaign";

export default function SingleCampaign() {
  const { campaignName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoaded: isUserLoaded } = useUser();
  const toast = useToast();
  
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const bgCard = useColorModeValue("white", "navy.700");
  const borderColor = useColorModeValue("secondaryGray.100", "whiteAlpha.100");
  
  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  
  // State for campaign data - initialize from location state if available
  const [campaign, setCampaign] = useState(location.state?.campaignData || null);
  const [loading, setLoading] = useState(!location.state?.campaignData);
  const [error, setError] = useState(null);
  const [isDuplicateError, setIsDuplicateError] = useState(false);
  
  // State for currently playing video
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

  // Get edit campaign hook
  const { 
    updateCampaign: editCampaignRequest, 
    loading: editLoading, 
    error: editError
  } = useEditCampaign();

  // If campaign data wasn't passed through navigation state, fetch it
  useEffect(() => {
    const fetchCampaign = async () => {
      if (location.state?.campaignData) {
        // We already have the data from navigation
        return;
      }
      
      if (!isUserLoaded || !user?.id || !campaignName) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Only fetch if we don't have data from navigation
        const response = await fetch(`/api/campaigns/${user.id}/${encodeURIComponent(campaignName)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch campaign: ${response.statusText}`);
        }
        
        const data = await response.json();
        setCampaign(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching campaign:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaign();
  }, [isUserLoaded, user, campaignName, location.state]);

  // Update campaign data in the API using the hook
  const handleUpdateCampaign = async () => {
    if (!isUserLoaded || !user?.id || !campaign?._id) {
      toast({
        title: "Error",
        description: "Missing campaign ID or user information",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    const campaignData = {
      user_id: user.id,
      campaign_name: editedName,
      campaign_description: editedDescription
    };

    try {
      const result = await editCampaignRequest(campaign._id, campaignData);
      
      if (result.success) {
        // Update local campaign state with the edited values
        setCampaign({
          ...campaign,
          campaign_name: editedName,
          campaign_description: editedDescription
        });
        
        return true;
      } else {
        throw new Error(result.error || "Failed to update campaign");
      }
    } catch (err) {
      toast({
        title: "Update failed",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  };

  // Handle item click to play video
  const handleItemClick = (item, index) => {
    // Only allow playing items with "ready" status and valid video_url
    if (item.status !== "ready" || !item.video_url) {
      toast({
        title: "Video unavailable",
        description: "This item is not ready for playback yet.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setCurrentVideoUrl(item.video_url);
    setSelectedItemIndex(index);
    
    toast({
      title: "Video loaded",
      description: `Now playing: ${item.text.substring(0, 30)}`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const baseUrl = process.env.REACT_APP_API_URL;

  
  // Update form state when campaign data loads
  useEffect(() => {
    if (campaign) {
      setEditedName(campaign.campaign_name);
      setEditedDescription(campaign.campaign_description);
      
      // Set initial video URL to consolidated video or first ready item
      const consolidatedVideoUrl = isUserLoaded && user && campaign?.used_thread
          ? `${baseUrl}/UserData/temp/${user.fullName}_${user.id}/${campaign.used_thread}/${campaign.used_thread}.mp4`
          : "";
      
      if (consolidatedVideoUrl) {
        setCurrentVideoUrl(consolidatedVideoUrl);
      } else {
        // Find first ready item with video_url
        const firstReadyItem = campaign.tts_text_list?.find(item => item.status === "ready" && item.video_url);
        if (firstReadyItem) {
          setCurrentVideoUrl(firstReadyItem.video_url);
        }
      }
    }
  }, [campaign, isUserLoaded, user]);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "yellow";
      case "ready": return "green";
      default: return "gray";
    }
  };
  
  // Calculate completion percentage based on tts_text_list status
  const calculateCompletionPercentage = () => {
    if (!campaign?.tts_text_list || campaign.tts_text_list.length === 0) return 0;
    
    const readyItems = campaign.tts_text_list.filter(item => item.status === "ready").length;
    return Math.round((readyItems / campaign.tts_text_list.length) * 100);
  };

  // Handle edit click
  const handleEditClick = async () => {
    if (isEditing) {
      // Save changes
      setLoading(true);
      const success = await handleUpdateCampaign();
      setLoading(false);
      
      if (success) {
        toast({
          title: "Campaign updated",
          description: "Your changes have been saved successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        
        setIsEditing(false);
      }
    } else {
      // Enter edit mode
      setIsEditing(true);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset to original values
    if (campaign) {
      setEditedName(campaign.campaign_name);
      setEditedDescription(campaign.campaign_description);
    }
  };

  // Loading state
  if (loading || !isUserLoaded || editLoading) {
    return (
      <Box pt={{ base: "180px", md: "80px", xl: "80px" }} textAlign="center">
        <Spinner size="xl" color="brand.500" thickness="4px" />
        <Text mt={4}>Loading campaign data...</Text>
      </Box>
    );
  }

  console.log("campaign", campaign);
  console.log("current video url", currentVideoUrl);
  
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      {/* Back button and Campaign Title */}
      <Flex justify="space-between" align="center" mb="20px">
        <Text color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
          Campaign Details
        </Text>
      </Flex>
      
      {/* Campaign Details Card */}
      <Card
        mb="20px"
        bg={bgCard}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="20px"
        position="relative"
      >
        {isEditing ? (
          <Flex position="absolute" top="10px" right="10px" gap="2">
            <IconButton
              aria-label="Save changes"
              icon={<CheckIcon />}
              size="sm"
              colorScheme="green"
              onClick={handleEditClick}
              isLoading={editLoading}
            />
            <IconButton
              aria-label="Cancel edit"
              icon={<CloseIcon />}
              size="sm"
              colorScheme="red"
              onClick={handleCancelEdit}
              isDisabled={editLoading}
            />
          </Flex>
        ) : (
          <IconButton
            aria-label="Edit campaign"
            icon={<EditIcon />}
            size="sm"
            position="absolute"
            top="10px"
            right="10px"
            colorScheme="blue"
            variant="ghost"
            onClick={handleEditClick}
          />
        )}
        <Badge
          colorScheme={getStatusColor(campaign.status)}
          variant="solid"
          px="3"
          py="1"
          borderRadius="8px"
          fontSize="sm"
          position="absolute"
          right="10px"
          top="50%"
          transform="translateY(-50%)"
        >
          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
        </Badge>
        <CardBody>
          <Flex direction="column" w="100%" pr="70px">
            {isEditing ? (
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                fontSize="xl"
                fontWeight="700"
                mb="10px"
                placeholder="Campaign name"
              />
            ) : (
              <Text color={textColor} fontSize="xl" fontWeight="700" mb="10px">
                {campaign.campaign_name}
              </Text>
            )}
            
            {isEditing ? (
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                mb="10px"
                placeholder="Campaign description"
                size="sm"
                resize="vertical"
                rows={2}
              />
            ) : (
              <Text color="gray.500" mb="10px">
                {campaign.campaign_description}
              </Text>
            )}
            
            <Text color="gray.600" fontSize="sm" mb="2">
              <Text as="span" fontWeight="600">Thread: </Text>
              {campaign.used_thread}
            </Text>
            
            <Flex align="center" mt="2" mb="2">
              <Text color="gray.600" fontSize="sm" fontWeight="600" mr="2">
                Completion:
              </Text>
              <Text color="gray.600" fontSize="sm" mr="3">
                {calculateCompletionPercentage()}%
              </Text>
              <Progress
                value={calculateCompletionPercentage()}
                size="sm"
                colorScheme={calculateCompletionPercentage() === 100 ? "green" : "blue"}
                borderRadius="md"
                flex="1"
              />
            </Flex>
          </Flex>
        </CardBody>
      </Card>
      
      {/* Two Columns: TTS Items and Video */}
      <Grid
        templateColumns={{ base: "1fr", md: "30% 70%" }}
        gap="20px"
        mb="20px"
      >
        {/* Left Column - TTS Text List - Fixed height to match video card */}
        <Card
          bg={bgCard}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="20px"
          p="0"
          display="flex"
          flexDirection="column"
        >
          <CardBody p="4">
            <Flex justify="space-between" align="center" mb="15px">
              <Text color={textColor} fontSize="lg" fontWeight="700">
                Campaign Items
              </Text>
              
              <Text color="gray.500" fontSize="sm">
                {campaign.tts_text_list?.length || 0} items
              </Text>
            </Flex>
            
            <TableContainer 
              maxH="450px" 
              overflowY="auto"
              css={{
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#F7FAFC',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#CBD5E0',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: '#A0AEC0',
                },
              }}
            >
              <Table variant="simple" size="sm">
                <Thead bg="gray.50" position="sticky" top="0" zIndex="1">
                  <Tr>
                    <Th width="85%">Text</Th>
                    <Th width="15%">Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {campaign.tts_text_list?.map((item, index) => (
                    <Tr 
                      key={index}
                      opacity={item.status === "ready" ? 1 : 0.6}
                      cursor={item.status === "ready" && item.video_url ? "pointer" : "default"}
                      _hover={item.status === "ready" && item.video_url ? { bg: "gray.50" } : {}}
                      bg={selectedItemIndex === index ? "blue.50" : "transparent"}
                      onClick={() => handleItemClick(item, index)}
                    >
                      <Td
                        height="40px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        maxW="200px"
                        title={item.text} // Tooltip for full text
                      >
                        {item.text}
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={getStatusColor(item.status)}
                          variant="subtle"
                          px="2"
                          py="1"
                          borderRadius="4px"
                        >
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            
            {/* Instructions text */}
            <Text color="gray.500" fontSize="xs" mt="2" textAlign="center">
              Click on ready items to play their videos
            </Text>
          </CardBody>
        </Card>
        
        {/* Right Column - Video Player */}
        <Card
          bg={bgCard}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="20px"
          overflow="hidden"
        >
          <CardBody p="4">
            <Flex direction="column" h="100%">
              <AspectRatio ratio={16 / 9}>
                {currentVideoUrl ? (
                  <video 
                    controls
                    key={currentVideoUrl}
                    src={currentVideoUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center" 
                    bg="gray.100"
                    flexDirection="column"
                  >
                    <Text color="gray.500" mb="2">No video available</Text>
                    <Text color="gray.400" fontSize="sm" textAlign="center">
                      Click on a ready item to load its video
                    </Text>
                  </Box>
                )}
              </AspectRatio>
            </Flex>
          </CardBody>
        </Card>
      </Grid>
    </Box>
  )
}