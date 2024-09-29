import { Button, Flex, Input, useColorModeValue, Box, Image, Text } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import React, { useState, useRef, useEffect } from 'react';
import { Fade, IconButton} from '@chakra-ui/react'; // Add this import
import { FaPlay, FaPause } from 'react-icons/fa';

import { RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb } from '@chakra-ui/react'

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

  
  const [videoSrc, setVideoSrc] = useState(null);
  const [videoDuration, setVideoDuration] = useState(100);
  const [range, setRange] = useState([0, 100]);
  const videoPlayerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);



  const togglePlayPause = () => {
    if (videoPlayerRef.current.paused) {
      videoPlayerRef.current.play();
      setIsPlaying(true);
    } else {
      videoPlayerRef.current.pause();
      setIsPlaying(false);
    }
  };


  useEffect(() => {
    const videoPlayer = videoPlayerRef.current;

    const handleTimeUpdate = () => {
      const [start, end] = range;
      if (videoPlayer.currentTime > end) {
        videoPlayer.pause();
      }
    };

    videoPlayer?.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoPlayer?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [range]);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  const handleLoadedMetadata = () => {
    const duration = videoPlayerRef.current.duration;
    setVideoDuration(duration);
    setRange([0, duration]);
  };

  const handleRangeChange = (values) => {
    setRange(values);
    const [start, end] = values;
  
    // Update video currentTime based on the new range
    if (videoPlayerRef.current) {
      const videoPlayer = videoPlayerRef.current;
      if (videoPlayer.currentTime < start || videoPlayer.currentTime > end) {
        videoPlayer.currentTime = start;
      } else {
        videoPlayer.currentTime = end;
      }
    }
  };

  const handleRangeChangeEnd = () => {
    // Sync video currentTime to start when slider movement ends
    if (videoPlayerRef.current) {
      videoPlayerRef.current.currentTime = range[0];
    }
  };


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
            <video
              ref={videoPlayerRef}
              width="640"
              onLoadedMetadata={handleLoadedMetadata}
            >
              <source src={file.preview} type={file.type} />
              Your browser does not support the video tag.
            </video>

            <Fade in={isHovered || !isPlaying}>
              <IconButton
                onClick={togglePlayPause}
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                backgroundColor="rgba(0, 0, 0, 0.5)"
                color="white"
                borderRadius="50%"
                _hover={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                icon={isPlaying ? <FaPause /> : <FaPlay />}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              />
            </Fade>
              
            <Text>{file.name}</Text>

            <RangeSlider
              min={0}
              max={videoDuration}
              step={0.1}
              value={range}
              onChange={handleRangeChange}
              onChangeEnd={handleRangeChangeEnd}
              aria-label={["Start time", "End time"]}
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
              <RangeSliderThumb index={1} />
            </RangeSlider>
            
            <Button mt='10px' onClick={removeFile}>Remove File</Button>
        </Flex>
      )}
    </>
    
  );
}

export default Dropzone;
