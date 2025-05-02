import React, { useState, useRef } from "react";
import { 
  useColorModeValue, 
  Box, 
  Text, 
  VStack 
} from '@chakra-ui/react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * FileUpload component for handling CSV and Excel file uploads
 * 
 * @param {Object} props Component properties
 * @param {Function} props.onFileUpload Callback function when file is uploaded
 * @param {Function} props.onDataProcessed Callback function when file data is processed
 * @returns {JSX.Element} FileUpload component
 */
const FileUpload = ({ onFileUpload, onDataProcessed }) => {
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
        // Check if "names" column exists
        const hasNamesColumn = results.meta.fields && results.meta.fields.includes('names');
        const namesData = hasNamesColumn 
          ? results.data.map(row => row.names).filter(Boolean)
          : [];
          
        const fileData = {
          type: 'csv',
          records: results.data.length,
          preview: results.data.slice(0, 3),
          namesColumn: hasNamesColumn,
          names: namesData
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
      
      const fileData = {
        type: 'excel',
        records: jsonWithHeaders.length,
        preview: jsonWithHeaders.slice(0, 3),
        namesColumn: !!namesColumnIndex,
        names: namesData
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
 * FileUploadArea component with file data display
 * 
 * @param {Object} props Component properties
 * @param {Function} props.onFileUpload Callback function when file is uploaded
 * @returns {JSX.Element} FileUploadArea component
 */
const FileUploadArea = ({ onFileUpload, onDataProcessed  }) => {
  const [fileData, setFileData] = useState(null);
  
  const handleFileUpload = (file) => {
    if (onFileUpload) {
      onFileUpload(file);
    }
  };
  
  const handleDataProcessed = (data) => {
    setFileData(data);
    if (onDataProcessed) {
      onDataProcessed(data);
    }
  };
  
  return (
    <>
      <FileUpload 
        onFileUpload={handleFileUpload}
        onDataProcessed={handleDataProcessed}
      />
      
      {fileData && (
        <Box mt={2}>
          <Text fontSize="sm" color="green.500">
            {fileData.records} records found in the {fileData.type} file
          </Text>
          
          {fileData.namesColumn ? (
            <Box mt={3} maxH="200px" overflowY="auto" borderWidth="1px" borderRadius="md" p={3}>
              <Text fontWeight="bold" mb={2}>Names Column Found ({fileData.names.length} entries):</Text>
              {fileData.names.slice(0, 10).map((name, index) => (
                <Text key={index} fontSize="sm">{name}</Text>
              ))}
              {fileData.names.length > 10 && (
                <Text fontSize="sm" fontStyle="italic">
                  ...and {fileData.names.length - 10} more
                </Text>
              )}
            </Box>
          ) : (
            <Text mt={2} fontSize="sm" color="orange.500">
              No column named "names" found in the file.
            </Text>
          )}
        </Box>
      )}
    </>
  );
};

export default FileUploadArea;