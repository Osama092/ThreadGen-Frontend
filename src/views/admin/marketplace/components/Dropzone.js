// Chakra imports
import { Button, Flex, Input, useColorModeValue, Box, Image, Text } from "@chakra-ui/react";
// Assets
import Upload from "views/admin/marketplace/components/Upload";
import { useDropzone } from "react-dropzone";
import React, { useState, useRef } from 'react';
import { MdGraphicEq } from 'react-icons/md';
//import { MdGraphicEq } from '@chakra-ui/icons';

import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from '@chakra-ui/react'

function Dropzone(props) {
  const { content, ...rest } = props;
  const [file, setFile] = useState(null);

  const bg = useColorModeValue("gray.100", "navy.700");
  const borderColor = useColorModeValue("secondaryGray.100", "whiteAlpha.100");

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(Object.assign(uploadedFile, {
      preview: URL.createObjectURL(uploadedFile)
    }));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'video/*': ['.mp4', '.mkv', '.avi', '.mov', '.wmv'] // Accept only video files
    }
  });

  const removeFile = () => {
    setFile(null);
  };

  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const handleChange = (values) => {
    const [min, max] = values;
    const range = max - min;
    const newTime = (range / 100) * videoDuration + (min / 100) * videoDuration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const videoRef = useRef(null);




  return (
    <>
      {!file && (
        <Flex
          align='center'
          justify='center'
          bg={bg}
          border='1px dashed'
          borderColor={borderColor}
          borderRadius='16px'
          w='100%'
          minH='100%'
          cursor='pointer'
          {...getRootProps({ className: "dropzone" })}
          {...rest}
        >
          <Input variant='main' {...getInputProps()} />
          <Button variant='no-effects'>{content}</Button>
        </Flex>
      )}
      {file && (
        <Flex direction='column' mt='20px'>
          <Box mb='10px'>
            <video
              ref={videoRef}
              controls
              width="100%"
              onTimeUpdate={() => setCurrentTime(videoRef.current.currentTime)}
              onLoadedMetadata={(e) => setVideoDuration(e.target.duration)}
            >
              <source src={file.preview} type={file.type} />
              Your browser does not support the video tag.
            </video>
            <Text>{file.name}</Text>

            <RangeSlider aria-label={['min', 'max']} defaultValue={[0, 100]} onChange={handleChange}>
              <RangeSliderTrack bg='red.100'>
                <RangeSliderFilledTrack bg='tomato' />
              </RangeSliderTrack>
              <RangeSliderThumb boxSize={6} index={0}>
                <Box color='tomato' as={MdGraphicEq} />
              </RangeSliderThumb>
              <RangeSliderThumb boxSize={6} index={1}>
                <Box color='tomato' as={MdGraphicEq} />
              </RangeSliderThumb>
            </RangeSlider>
            
            <Button mt='10px' onClick={removeFile}>Remove File</Button>
          </Box>
        </Flex>
      )}
    </>
    
  );
}

export default Dropzone;
