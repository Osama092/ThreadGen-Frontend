import React, { useState } from "react";
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
  Button
} from "@chakra-ui/react";
import { EditIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";

export default function SingleCampaign() {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const bgCard = useColorModeValue("white", "navy.700");
  const borderColor = useColorModeValue("secondaryGray.100", "whiteAlpha.100");
  
  // Hardcoded campaign data with state for editing
  const [campaignData, setCampaignData] = useState({
    name: "Summer Marketing Campaign 2025",
    description: "Digital marketing campaign targeting millennials and Gen Z for our new product line",
    usedThread: "Marketing-Thread-2025-04",
    status: "processing", // "pending", "processing", or "done"
    completionPercentage: 60 // Hardcoded percentage of completion
  });
  
  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(campaignData.name);
  const [editedDescription, setEditedDescription] = useState(campaignData.description);

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "red";
      case "processing": return "yellow";
      case "done": return "green";
      default: return "gray";
    }
  };
  
  // Hardcoded table data
  const tableData = [
    { name: "Email Sequence", status: "done" },
    { name: "Social Media Posts", status: "pending" },
    { name: "Influencer Outreach", status: "pending" },
    { name: "Content Creation", status: "done" },
    { name: "PPC Ads", status: "pending" },
    { name: "Analytics Setup", status: "done" },
    { name: "Landing Page", status: "done" },
    { name: "SEO Optimization", status: "pending" },
    { name: "Video Production", status: "pending" },
    { name: "Market Research", status: "done" }
  ];
  
  // Hardcoded video URL
  const videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";

  // Handle edit click
  const handleEditClick = () => {
    if (isEditing) {
      // Save changes
      setCampaignData({
        ...campaignData,
        name: editedName,
        description: editedDescription
      });
      setIsEditing(false);
    } else {
      // Enter edit mode
      setIsEditing(true);
      setEditedName(campaignData.name);
      setEditedDescription(campaignData.description);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedName(campaignData.name);
    setEditedDescription(campaignData.description);
  };

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      {/* Campaign Title */}
      <Text color={textColor} fontSize="2xl" ms="24px" fontWeight="700" mb="20px">
        Campaign Details
      </Text>
      
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
            />
            <IconButton
              aria-label="Cancel edit"
              icon={<CloseIcon />}
              size="sm"
              colorScheme="red"
              onClick={handleCancelEdit}
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
          colorScheme={getStatusColor(campaignData.status)}
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
          {campaignData.status.charAt(0).toUpperCase() + campaignData.status.slice(1)}
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
                {campaignData.name}
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
                {campaignData.description}
              </Text>
            )}
            
            <Text color="gray.600" fontSize="sm" mb="2">
              <Text as="span" fontWeight="600">Thread: </Text>
              {campaignData.usedThread}
            </Text>
            
            <Flex align="center" mt="2" mb="2">
              <Text color="gray.600" fontSize="sm" fontWeight="600" mr="2">
                Completion:
              </Text>
              <Text color="gray.600" fontSize="sm" mr="3">
                {campaignData.completionPercentage}%
              </Text>
              <Progress 
                value={campaignData.completionPercentage} 
                size="sm" 
                colorScheme={campaignData.completionPercentage === 100 ? "green" : "blue"} 
                borderRadius="md"
                flex="1"
              />
            </Flex>
          </Flex>
        </CardBody>
      </Card>
      
      {/* Two Columns: Table and Video */}
      <Grid
        templateColumns={{ base: "1fr", md: "30% 70%" }}
        gap="20px"
        mb="20px"
      >
        {/* Left Column - Table */}
        <Card
          bg={bgCard}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="20px"
          p="0"
          h="100%"
        >
          <CardBody p="0" overflow="auto" maxH="400px">
            <TableContainer>
              <Table variant="simple" size="sm">
                <Thead bg="gray.50">
                  <Tr>
                    <Th>Name</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tableData.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.name}</Td>
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
            <AspectRatio ratio={16/9}>
              <iframe
                title="campaign video"
                src={videoUrl}
                allowFullScreen
              />
            </AspectRatio>
          </CardBody>
        </Card>
      </Grid>
    </Box>
  );
}