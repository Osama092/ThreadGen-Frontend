import { Button, Flex, Input, useColorModeValue, Image, Box } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import React, { useState } from 'react';

function Dropzone(props) {
  const { content, onFileChange, ...rest } = props;
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const bg = useColorModeValue("gray.100", "navy.700");
  const borderColor = useColorModeValue("secondaryGray.100", "whiteAlpha.100");

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    const fileWithPreview = Object.assign(uploadedFile, {
      preview: URL.createObjectURL(uploadedFile)
    });
    setFile(fileWithPreview);
    
    // Generate thumbnail
    generateThumbnail(uploadedFile);
    
    // Call the callback with the file
    if (onFileChange) {
      onFileChange(fileWithPreview);
    }
  };

  // Simple function to generate a thumbnail from the video
  const generateThumbnail = (videoFile) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(videoFile);
    
    video.addEventListener('loadeddata', () => {
      video.currentTime = 0;
      
      video.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataURL = canvas.toDataURL('image/jpeg');
        setThumbnail(dataURL);
        
        URL.revokeObjectURL(video.src);
      }, { once: true });
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'video/*': ['.mp4', '.mkv', '.avi', '.mov', '.wmv'] // Accept only video files
    }
  });

  const removeFile = () => {
    if (file && file.preview) {
      URL.revokeObjectURL(file.preview);
    }
    setFile(null);
    setThumbnail(null);
    
    if (onFileChange) {
      onFileChange(null);
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      bg={bg}
      border="1px dashed"
      borderColor={borderColor}
      borderRadius="16px"
      w="100%"
      minH="100%"
      direction="column"
      p={4}
    >
      {!file && (
        <Flex
          align="center"
          justify="center"
          w="100%"
          h="100%"
          cursor="pointer"
          {...getRootProps({ className: "dropzone" })}
        >
          <Input variant="main" {...getInputProps()} />
          <Button variant="no-effects">{content}</Button>
        </Flex>
      )}
      
      {file && (
        <Flex direction="column" align="center" justify="center" w="100%">
          {thumbnail ? (
            <Box maxW="100%" mb={4}>
              <Image 
                src={thumbnail} 
                alt="Video thumbnail" 
                maxW="100%" 
                borderRadius="md"
              />
            </Box>
          ) : (
            <Flex 
              w="100%" 
              h="200px" 
              bg="gray.200" 
              color="gray.500" 
              justifyContent="center" 
              alignItems="center"
              borderRadius="md"
              mb={4}
            >
              Loading thumbnail...
            </Flex>
          )}
          
          <Button onClick={removeFile} size="sm">Remove File</Button>
        </Flex>
      )}
    </Flex>
  );
}

export default Dropzone;