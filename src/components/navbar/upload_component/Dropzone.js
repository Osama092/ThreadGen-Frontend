import { Button, Flex, Input, useColorModeValue } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import React, { useState } from 'react';

function Dropzone(props) {
  const { content, onFileChange, ...rest } = props;
  const [file, setFile] = useState(null);

  const bg = useColorModeValue("gray.100", "navy.700");
  const borderColor = useColorModeValue("secondaryGray.100", "whiteAlpha.100");

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    const fileWithPreview = Object.assign(uploadedFile, {
      preview: URL.createObjectURL(uploadedFile)
    });
    setFile(fileWithPreview);
    
    // Call the callback with the file
    if (onFileChange) {
      onFileChange(fileWithPreview);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg', '.m4a', '.flac'] // Accept only audio files
    }
  });

  const removeFile = () => {
    setFile(null);
    // Also notify parent component
    if (onFileChange) {
      onFileChange(null);
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
          <audio controls>
            <source src={file.preview} type={file.type} />
            Your browser does not support the audio element.
          </audio>
          <Button mt='10px' onClick={removeFile}>Remove File</Button>
        </Flex>
      )}
    </>
  );
}

export default Dropzone;