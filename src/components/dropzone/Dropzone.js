// Chakra imports
import { Button, Flex, Input, useColorModeValue } from "@chakra-ui/react";
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
      {...rest}>
      {!audioSrc && (
        <div {...getRootProps({ className: "dropzone" })}>
          <Input variant='main' {...getInputProps()} />
          <Button variant='no-effects'>{content}</Button>
        </div>
      )}
      {audioSrc && <audio controls src={audioSrc} />}
    </Flex>
  );
}

export default Dropzone;