// Chakra imports
import { Button, Flex, Input, useColorModeValue, IconButton , Box} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
// Assets
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

function Dropzone(props) {
  const { content, ...rest } = props;
  const [audioSrc, setAudioSrc] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const audioURL = URL.createObjectURL(file);
      setAudioSrc(audioURL);
    }
  };

  const handleDiscardAudio = () => {
    setAudioSrc(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg', '.flac'] // Accept only audio files
    }
  });

  const bg = useColorModeValue("gray.100", "navy.700");
  const borderColor = useColorModeValue("secondaryGray.100", "whiteAlpha.100");

  return (
    <Flex
      align='center'
      justify='center'
      bg={bg}
      w='20%'
      h={audioSrc ? 'auto' : 'max-content'}
      minH={audioSrc ? 'auto' : '100%'}
      cursor='pointer'
      p={audioSrc ? 4 : 0}
      position='relative' // Add relative positioning to the Flex container
      {...rest}>
      {!audioSrc && (
        <div {...getRootProps({ className: "dropzone" })}>
          <Input variant='main' {...getInputProps()} />
          <Button variant='no-effects'>{content}</Button>
        </div>
      )}
      {audioSrc && (
        <>
          

          <Box position="relative" display="inline-block">
  <IconButton
    icon={<CloseIcon />}
    size="sm"
    onClick={handleDiscardAudio}
    position="absolute"
    top="50%"
    left="50%"
    transform="translate(-50%, -200%)" // Adjust to place it above the audio
    zIndex="1"
  />
  <audio controls src={audioSrc} style={{ position: 'relative', display: 'block' }} />
</Box>

      </>
      )}
    </Flex>
  );
}

export default Dropzone;