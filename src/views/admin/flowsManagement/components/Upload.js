import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { MdUpload } from "react-icons/md";
import Dropzone from "views/admin/flowsManagement/components/Dropzone";

export default function Upload(props) {
  const { used, total, onFileChange, ...rest } = props;
  const brandColor = useColorModeValue("brand.500", "white");
  const textColorSecondary = "gray.400";
  return (
    <Flex
      align="center"
      justify="center"
      m="0 auto "
      p={4}
      border="1px solid"
      borderColor={textColorSecondary}
      borderRadius="md"
      width="100%"
      height="100%"
      {...rest}
    >
    <Dropzone
      style={{
        width: "100%",
        height: "100%",
        borderColor: brandColor,
        borderRadius: "md",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: useColorModeValue("gray.50", "gray.700"),

        }}
      onFileChange={onFileChange}
      content={
        <Box textAlign="center"  >
          <Icon as={MdUpload} w="80px" h="80px" color={brandColor} />
          <Flex justify="center" mx="auto" mb="12px">
            <Text fontSize="xl" fontWeight="700" color={brandColor}>
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
