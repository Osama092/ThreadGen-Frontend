import React, { useState, useEffect, useRef } from "react";
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
  VStack
} from '@chakra-ui/react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

// CampaignRow Component
function CampaignRow(props) {
  const { name, description, threadName, totalRequests } = props;
  const textColor = useColorModeValue("gray.700", "white");
  const bgColor = useColorModeValue("#F8F9FA", "gray.800");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

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

// File Upload Component
function FileUploadArea({ onFileUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };
  
  const processFile = (file) => {
    setSelectedFile(file);
    onFileUpload(file);
  };
  
  const handleClick = () => {
    inputRef.current.click();
  };
  
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const bgActiveColor = useColorModeValue("gray.200", "gray.600");
  const borderColor = useColorModeValue("gray.300", "gray.500");
  
  return (
    <Box
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
      bg={dragActive ? bgActiveColor : bgColor}
      borderRadius="md"
      border="2px dashed"
      borderColor={borderColor}
      p={6}
      textAlign="center"
      cursor="pointer"
      transition="all 0.2s"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleChange}
        style={{ display: "none" }}
      />
      {selectedFile ? (
        <VStack>
          <Text>File selected: {selectedFile.name}</Text>
          <Text fontSize="sm" color="green.500">Click or drag to change file</Text>
        </VStack>
      ) : (
        <VStack>
          <Text>Upload CSV or Excel file</Text>
          <Text fontSize="sm">Click or drag and drop</Text>
        </VStack>
      )}
    </Box>
  );
}

// Add Campaign Modal Component
function AddCampaignModal({ isOpen, onClose, onAddCampaign }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    threadName: "",
    apiKey: "",
    file: null
  });
  
  const [fileData, setFileData] = useState(null);
  const [availableThreads] = useState(["summer_2025", "reactivate_q2", "newproduct_2025", "holiday_2025", "custom_thread"]);
  const [availableApiKeys] = useState(["API_KEY_1", "API_KEY_2", "API_KEY_3", "API_KEY_4"]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileUpload = (file) => {
    setFormData(prev => ({ ...prev, file }));
    
    // Process file content
    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        complete: (results) => {
          // Check if "names" column exists
          const hasNamesColumn = results.meta.fields && results.meta.fields.includes('names');
          const namesData = hasNamesColumn 
            ? results.data.map(row => row.names).filter(Boolean)
            : [];
            
          setFileData({
            type: 'csv',
            records: results.data.length,
            preview: results.data.slice(0, 3),
            namesColumn: hasNamesColumn,
            names: namesData
          });
        },
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
      });
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
        
        // Find "names" column in the first row
        const headerRow = json[0];
        let namesColumnIndex = null;
        
        // Look for "names" column (case insensitive)
        for (const key in headerRow) {
          if (typeof headerRow[key] === 'string' && headerRow[key].toLowerCase() === 'names') {
            namesColumnIndex = key;
            break;
          }
        }
        
        // Extract names if the column exists
        const namesData = [];
        if (namesColumnIndex) {
          for (let i = 1; i < json.length; i++) {
            const row = json[i];
            if (row[namesColumnIndex]) {
              namesData.push(row[namesColumnIndex]);
            }
          }
        }
        
        // Convert to standard format with headers for preview
        const jsonWithHeaders = XLSX.utils.sheet_to_json(worksheet);
        
        setFileData({
          type: 'excel',
          records: jsonWithHeaders.length,
          preview: jsonWithHeaders.slice(0, 3),
          namesColumn: !!namesColumnIndex,
          names: namesData
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };
  
  const handleSubmit = () => {
    // Calculate total requests based on file data
    const totalRequests = fileData ? fileData.records : 0;
    
    onAddCampaign({
      ...formData,
      totalRequests
    });
    
    // Reset form and close modal
    setFormData({
      name: "",
      description: "",
      threadName: "",
      apiKey: "",
      file: null
    });
    setFileData(null);
    onClose();
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
              <FormLabel>Thread Name</FormLabel>
              <Select 
                name="threadName" 
                value={formData.threadName} 
                onChange={handleInputChange} 
                placeholder="Select thread"
              >
                {availableThreads.map((thread) => (
                  <option key={thread} value={thread}>{thread}</option>
                ))}
              </Select>
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>API Key</FormLabel>
              <Select 
                name="apiKey" 
                value={formData.apiKey} 
                onChange={handleInputChange} 
                placeholder="Select API key"
              >
                {availableApiKeys.map((key) => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </Select>
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Upload File</FormLabel>
              <FileUploadArea onFileUpload={handleFileUpload} />
              {fileData && (
                <Box mt={2}>
                  <Text fontSize="sm" color="green.500">
                    {fileData.records} records found in the {fileData.type} file
                  </Text>
                  
                  {fileData.namesColumn ? (
                    <Box mt={3} maxH="200px" overflowY="auto" borderWidth="1px" borderRadius="md" p={3}>
                      <Text fontWeight="bold" mb={2}>Names Column Found ({fileData.names.length} entries):</Text>
                      {fileData.names.map((name, index) => (
                        <Text key={index} fontSize="sm">{name}</Text>
                      ))}
                    </Box>
                  ) : (
                    <Text mt={2} fontSize="sm" color="orange.500">
                      No column named "names" found in the file.
                    </Text>
                  )}
                </Box>
              )}
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
            isDisabled={!formData.name || !formData.threadName || !formData.apiKey || !formData.file}
          >
            Create Campaign
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// Main CampaignsManagement Component
export default function CampaignsManagement() {  
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const tableTextColor = useColorModeValue("gray.700", "white");
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Campaigns state
  const [campaigns, setCampaigns] = useState([
    {
      name: "Summer Promotion",
      description: "Seasonal discount campaign for summer products",
      threadName: "summer_2025",
      totalRequests: 5000
    },
    {
      name: "Customer Reactivation",
      description: "Campaign targeting inactive customers with special offers",
      threadName: "reactivate_q2",
      totalRequests: 3000
    },
    {
      name: "Product Launch",
      description: "New product announcement campaign for loyal customers",
      threadName: "newproduct_2025",
      totalRequests: 10000
    },
    {
      name: "Holiday Special",
      description: "End of year holiday promotion with gift bundles",
      threadName: "holiday_2025",
      totalRequests: 7500
    }
  ]);
  
  const handleAddCampaign = (newCampaign) => {
    setCampaigns([...campaigns, newCampaign]);
  };

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
                  bg="brand.500"
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
                Used Thread
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
              {campaigns.map((campaign, index) => {
                return (
                  <CampaignRow
                    key={index}
                    name={campaign.name}
                    description={campaign.description}
                    threadName={campaign.threadName}
                    totalRequests={campaign.totalRequests}
                  />
                );
              })}
            </Flex>
          </Flex>
        </Flex>
      </Grid>
      
      {/* Add Campaign Modal */}
      <AddCampaignModal 
        isOpen={isOpen} 
        onClose={onClose} 
        onAddCampaign={handleAddCampaign} 
      />
    </Box>
  );
}