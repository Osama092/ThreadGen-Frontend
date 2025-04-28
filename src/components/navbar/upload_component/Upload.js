// Chakra imports
import {
  Box,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import React from "react";
// Assets
import { MdUpload } from "react-icons/md";

import Dropzone from "components/navbar/upload_component/Dropzone.js"
export default function Upload(props) {
  const { used, total, onFileChange, ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const brandColor = useColorModeValue("brand.500", "white");
  const textColorSecondary = "gray.400";
  return (
    <Flex
    align="center"
    justify="center"
    m="0 auto"
    p={5}
    width="auto"
    height="auto"
    border= "1px dashed #ccc"
    mb={-1}
    {...rest}
  >
    <Dropzone
      style={{
        width: "auto",
        height: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding : '10px',
        backgroundColor: useColorModeValue("gray.50", "gray.700"),
      }}
      onFileChange={onFileChange}

      content={
        <Box textAlign="center"  >
          <Icon as={MdUpload} w="40px" h="40px" color={brandColor} />
          <Flex justify="center" mx="auto" mb="6px">
            <Text fontSize="md" fontWeight="700" color={brandColor}>
              Upload Files
            </Text>
          </Flex>
          <Text fontSize="sm" fontWeight="500" color="secondaryGray.500">
            Drag and drop files here, or click to select files
          </Text>
        </Box>
      }
    />
  </Flex>
  );
}
