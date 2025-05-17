import React, { useState, useRef } from "react";
import { 
  useColorModeValue, 
  Box, 
  Text, 
  VStack,
  FormControl,
  FormLabel,
  Select,
  HStack
} from '@chakra-ui/react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * FileUpload component for handling CSV and Excel file uploads
 * 
 * @param {Object} props Component properties
 * @param {Function} props.onFileUpload Callback function when file is uploaded
 * @param {Function} props.onDataProcessed Callback function when file data is processed
 * @param {String} props.selectedColumn Selected column name
 * @param {Function} props.onColumnsFound Callback to parent when columns are discovered
 * @returns {JSX.Element} FileUpload component
 */
const FileUpload = ({ onFileUpload, onDataProcessed, selectedColumn, onColumnsFound }) => {
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
    
    // Call the onFileUpload callback
    if (onFileUpload) {
      onFileUpload(file);
    }
    
    // Process file content
    if (file.name.endsWith('.csv')) {
      processCsvFile(file);
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      processExcelFile(file);
    }
  };
  
  const processCsvFile = (file) => {
    Papa.parse(file, {
      complete: (results) => {
        // Get all column names
        const columns = results.meta.fields || [];
        
        // Notify parent about available columns
        if (onColumnsFound) {
          onColumnsFound(columns);
        }
        
        // Check if target column exists (use selected column or default to "names")
        const targetColumn = selectedColumn || 'names';
        const hasTargetColumn = columns.includes(targetColumn);
        
        // Extract data from the selected column or first column if target doesn't exist
        const columnToUse = hasTargetColumn ? targetColumn : (columns[0] || '');
        const columnData = columnToUse ? 
          results.data.map(row => row[columnToUse]).filter(Boolean) : [];
          
        const fileData = {
          type: 'csv',
          records: results.data.length,
          preview: results.data.slice(0, 3),
          columns: columns,
          selectedColumn: columnToUse,
          hasTargetColumn: hasTargetColumn,
          columnData: columnData,
          allData: results.data
        };
        
        // Call the onDataProcessed callback with the processed data
        if (onDataProcessed) {
          onDataProcessed(fileData);
        }
      },
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    });
  };
  
  const processExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to standard format with headers
      const jsonWithHeaders = XLSX.utils.sheet_to_json(worksheet);
      
      // Get all column names from the first row
      const columns = jsonWithHeaders.length > 0 ? Object.keys(jsonWithHeaders[0]) : [];
      
      // Notify parent about available columns
      if (onColumnsFound) {
        onColumnsFound(columns);
      }
      
      // Check if target column exists (use selected column or default to "names")
      const targetColumn = selectedColumn || 'names';
      const hasTargetColumn = columns.some(col => col === targetColumn);
      
      // Extract data from the selected column or first column if target doesn't exist
      const columnToUse = hasTargetColumn ? targetColumn : (columns[0] || '');
      const columnData = columnToUse ? 
        jsonWithHeaders.map(row => row[columnToUse]).filter(Boolean) : [];
      
      const fileData = {
        type: 'excel',
        records: jsonWithHeaders.length,
        preview: jsonWithHeaders.slice(0, 3),
        columns: columns,
        selectedColumn: columnToUse,
        hasTargetColumn: hasTargetColumn,
        columnData: columnData,
        allData: jsonWithHeaders
      };
      
      // Call the onDataProcessed callback with the processed data
      if (onDataProcessed) {
        onDataProcessed(fileData);
      }
    };
    reader.readAsArrayBuffer(file);
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
};

/**
 * FileUploadArea component with file data display and column selection
 * 
 * @param {Object} props Component properties
 * @param {Function} props.onFileUpload Callback function when file is uploaded
 * @param {Function} props.onDataProcessed Callback function when file data is processed
 * @returns {JSX.Element} FileUploadArea component
 */
const FileUploadArea = ({ onFileUpload, onDataProcessed }) => {
  const [fileData, setFileData] = useState(null);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState('');
  
  const handleFileUpload = (file) => {
    if (onFileUpload) {
      onFileUpload(file);
    }
  };
  
  const handleDataProcessed = (data) => {
    setFileData(data);
    
    // Prepare data to pass back to parent component
    const processedData = {
      ...data,
      selectedColumnData: data.columnData,
    };
    
    if (onDataProcessed) {
      onDataProcessed(processedData);
    }
  };
  
  const handleColumnsFound = (columns) => {
    setAvailableColumns(columns);
    
    // If "names" is available, select it by default
    if (columns.includes('names')) {
      setSelectedColumn('names');
    } else if (columns.length > 0) {
      // Otherwise select the first column
      setSelectedColumn(columns[0]);
    }
  };
  
  const handleColumnChange = (e) => {
    const newSelectedColumn = e.target.value;
    setSelectedColumn(newSelectedColumn);
    
    // Only reprocess if we have file data
    if (fileData && fileData.allData) {
      // Extract data for the newly selected column
      const newColumnData = fileData.allData
        .map(row => row[newSelectedColumn])
        .filter(Boolean);
      
      // Update file data with new column selection
      const updatedFileData = {
        ...fileData,
        selectedColumn: newSelectedColumn,
        columnData: newColumnData
      };
      
      setFileData(updatedFileData);
      
      // Pass updated data to parent
      if (onDataProcessed) {
        onDataProcessed({
          ...updatedFileData,
          selectedColumnData: newColumnData
        });
      }
    }
  };
  
  return (
    <>
      <FileUpload 
        onFileUpload={handleFileUpload}
        onDataProcessed={handleDataProcessed}
        selectedColumn={selectedColumn}
        onColumnsFound={handleColumnsFound}
      />
      
      {fileData && (
        <Box mt={4}>
          <HStack spacing={4} align="flex-start">
            <Box flex="1">
              <Text fontSize="sm" color="green.500" mb={2}>
                {fileData.records} records found in the {fileData.type} file
              </Text>
              
              {availableColumns.length > 0 && (
                <FormControl mt={2}>
                  <FormLabel fontSize="sm">Select Column for Names:</FormLabel>
                  <Select 
                    value={selectedColumn} 
                    onChange={handleColumnChange}
                    size="sm"
                  >
                    {availableColumns.map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
            
            {fileData.columnData && fileData.columnData.length > 0 && (
              <Box flex="1" maxH="200px" overflowY="auto" borderWidth="1px" borderRadius="md" p={3}>
                <Text fontWeight="bold" mb={2}>
                  Column "{selectedColumn}" ({fileData.columnData.length} entries):
                </Text>
                {fileData.columnData.slice(0, 10).map((value, index) => (
                  <Text key={index} fontSize="sm">{value}</Text>
                ))}
                {fileData.columnData.length > 10 && (
                  <Text fontSize="sm" fontStyle="italic">
                    ...and {fileData.columnData.length - 10} more
                  </Text>
                )}
              </Box>
            )}
          </HStack>
        </Box>
      )}
    </>
  );
};

export default FileUploadArea;