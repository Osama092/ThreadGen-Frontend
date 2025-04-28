import React from "react";

// Chakra imports
import { Flex, useColorModeValue, Heading, Box, Text } from "@chakra-ui/react";

// Custom components
import { HorizonLogo } from "components/icons/Icons";
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      <Text fontSize="35px" my="32px">
        
        <Text as="span" fontWeight="extrabold">FLOW</Text> <Text as="span">GEN</Text>
      </Text>
    <HSeparator mb='20px' />
    </Flex>
  );
}
//      <HorizonLogo h='26px' w='175px' my='32px' color={logoColor} />

export default SidebarBrand;
