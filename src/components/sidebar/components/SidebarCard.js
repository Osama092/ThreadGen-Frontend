import {
  Button,
  Flex,
  Image,
  Link,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import logoWhite from "assets/img/layout/logoWhite.png";
import React, { useEffect, useRef } from "react";
import PricingPage from "components/pricingPage/pricing";
import { useSubscription } from 'contexts/paddle/SubscriptionContext';

export default function SidebarDocs() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isSubbed, subscriptionData, transactionData } = useSubscription();
  const upgradeButtonRef = useRef(null);

  // Function to get upgrade text based on product ID
  const getUpgradeText = () => {
    if (!subscriptionData?.data?.items?.[0]?.product?.id) {
      return "Upgrade to PRO"; // Default fallback
    }

    const productId = subscriptionData.data.items[0].product.id;
    console.log('Product ID:', productId); // Debugging log
    switch (productId) {
      case 'pro_01j82nweft36pcrgwt9zcek5g2':
        return "Upgrade to PRO";
      case 'pro_01j82nzbtjmtzpyv2yp5b36stz':
        return "Upgrade to Ultimate";
      case 'pro_01j83fwqv84197bhntf28ts527':
        return "All Set";
      default:
        return "Upgrade to PRO";
    }
  };

  useEffect(() => {
    if (isSubbed !== null) { // Check if it's not null (i.e., data has been fetched)
      if (!isSubbed) {
        console.log('User is not subscribed');
        onOpen(); // Open the modal if isSubbed is true
      }
    }
  }, [isSubbed, onOpen]);

  console.log('SidebarDocs rendered with isSubbed:', isSubbed, 'subscriptionData:', subscriptionData, 'transactionData:', transactionData);
  
  // Handle modal closure properly
  const handleModalClose = () => {
    onClose();
    // Return focus to the upgrade button after modal closes
    setTimeout(() => {
      if (upgradeButtonRef.current) {
        upgradeButtonRef.current.focus();
      }
    }, 0);
  };

  const bgColor = "linear-gradient(135deg, #868CFF 0%, #4318FF 100%)";
  const borderColor = useColorModeValue("white", "navy.800");
  const upgradeText = getUpgradeText();

  return (
    <Flex
      justify='center'
      direction='column'
      align='center'
      bg={bgColor}
      borderRadius='30px'
      position='relative'>
      <Flex
        border='5px solid'
        borderColor={borderColor}
        bg='linear-gradient(135deg, #868CFF 0%, #4318FF 100%)'
        borderRadius='50%'
        w='94px'
        h='94px'
        align='center'
        justify='center'
        mx='auto'
        position='absolute'
        left='50%'
        top='-47px'
        transform='translate(-50%, 0%)'>
        <Image src={logoWhite} w='40px' h='40px' />
      </Flex>
      <Flex
        direction='column'
        mb='12px'
        align='center'
        justify='center'
        px='15px'
        pt='55px'>
        <Text
          fontSize={{ base: "lg", xl: "18px" }}
          color='white'
          fontWeight='bold'
          lineHeight='150%'
          textAlign='center'
          px='10px'
          mt="10px"
          mb='6px'>
          {upgradeText}
        </Text>
        <Text
          fontSize='14px'
          color={"white"}
          fontWeight='500'
          px='10px'
          mb='6px'
          textAlign='center'>
          {upgradeText === "All Set" 
            ? "You're enjoying all premium features!" 
            : "Improve your work process and start doing more with PRO!"
          }
        </Text>
      </Flex>
      <Button
        ref={upgradeButtonRef}
        bg='whiteAlpha.300'
        _hover={{ bg: "whiteAlpha.200" }}
        _active={{ bg: "whiteAlpha.100" }}
        mb={{ sm: "16px", xl: "24px" }}
        color={"white"}
        fontWeight='regular'
        fontSize='sm'
        minW='185px'
        mx='auto'
        onClick={onOpen}
        isDisabled={upgradeText === "All Set"}>
        {upgradeText}
      </Button>

      <Modal 
        isOpen={isOpen} 
        onClose={handleModalClose}
        closeOnOverlayClick={false}
        closeOnEsc={isSubbed} // Only allow ESC key if user is subscribed
        returnFocusOnClose={true}
        autoFocus={true}
      >
        <ModalOverlay />
        <ModalContent maxW="100%" width="70%">
          {isSubbed && <ModalCloseButton />} {/* Only show close button if user is subscribed */}
          <ModalBody>
            <PricingPage onActionComplete={handleModalClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}