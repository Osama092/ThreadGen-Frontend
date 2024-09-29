import {
  Box,
  Flex,
  HStack,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  List,
  ListItem,
  Wrap,
  ListIcon,
  Button,
  Switch,
} from '@chakra-ui/react'
import { FaCheckCircle } from 'react-icons/fa'
import usePrices from 'hooks/paddle/usePrices'; // Import the custom hook
import React, { useState, useEffect, useContext } from 'react';
import { initializePaddle } from '@paddle/paddle-js';
import { SSEContext } from 'contexts/SSEContext';
import { useUser } from '@clerk/clerk-react';
import { useUpdateSubscription } from 'hooks/paddle/useSubUpdate';
import { useSubscription } from 'contexts/paddle/SubscriptionContext';

const PriceWrapper = ({ children }) => {
  return (
    <Box
      mb={4}
      shadow="base"
      borderWidth="1px"
      alignSelf={{ base: 'center', lg: 'flex-start' }}
      borderColor='gray.200'
      borderRadius={'xl'}
      width={{ base: '100%', md: '25%' }} // Adjust width here
      mx={2} // Add horizontal margin for spacing
    >
      {children}
    </Box>
  )
}

const ThreeTierPricing = () => {
  const { loading, error, data, handleUpdateSubscription } = useUpdateSubscription();
  const { isSubbed, subscriptionData, transactionData } = useSubscription();

  const [isAnnual, setIsAnnual] = useState(false);
  const { prices, priceLoading, priceError } = usePrices();
  const [paddle, setPaddle] = useState();
  //const data = useContext(SSEContext);
  const { user } = useUser();

  console.log("the product are", prices)

  useEffect(() => {
    if (isSubbed !== null) { // Check if it's not null (i.e., data has been fetched)
      console.log('subscription data', subscriptionData)

    }
  });

  useEffect(() => {
    if (user) {
      console.log("User Email:", user.primaryEmailAddress.emailAddress);
    } else {
      console.log("User is not logged in");
    }
  }, [user]);

  const email = user.primaryEmailAddress.emailAddress;
  console.log("should workd", email)

  useEffect(() => {
    initializePaddle({ environment: 'sandbox', token: 'test_77cffaba1e413299f5fec86bb21' })
      .then((paddleInstance) => {
        if (paddleInstance) {
          setPaddle(paddleInstance);
        } else {
          console.error('Paddle initialization failed');
        }
      })
      .catch((error) => {
        console.error('Error initializing Paddle:', error);
      });
  }, []);



  const updateSub = (priceId) => {
    const subscriptionId = subscriptionData.data.id; // Use subscriptionData.data.id as the subscriptionId
  
    if (subscriptionId && priceId) {
      handleUpdateSubscription(subscriptionId, priceId);
    } else {
      console.error('Subscription ID or Price ID is missing.');
    }
  };

  const openCheckout = (items) => {
    if (paddle) {
      paddle.Checkout.open({
        items: items,
        customData: {
          "customer_email": email,
        }
      });
    } else {
      console.error('Paddle instance is not available');
    }
  };

  const groupedPlans = prices.reduce((acc, price) => {
    const planName = price.name;
    const billingInterval = price.billing_cycle ? price.billing_cycle.interval : null;

    if (!acc[planName]) {
      acc[planName] = {};
    }

    if (billingInterval) {
      acc[planName][billingInterval] = price;
    }


    return acc;
  }, {});

  const isSubscribedPlan = (planId) => {
    return subscriptionData && subscriptionData.data && subscriptionData.data.items && subscriptionData.data.items[0] && subscriptionData.data.items[0].price.id === planId;
  };

  const isDifferentPlan = (planId) => {
    return subscriptionData && subscriptionData.data && subscriptionData.data.items && subscriptionData.data.items[0] && subscriptionData.data.items[0].price.id !== planId;
  };

  return (
    <Box py={12}>
      <VStack spacing={2} textAlign="center">
        <Heading as="h1" fontSize="4xl">
          Plans that fit your need
        </Heading>
        
        <HStack mb={4} align="center">
          <Text>Monthly</Text>
          <Switch
            isChecked={isAnnual}
            onChange={() => setIsAnnual(!isAnnual)}
            colorScheme="teal"
          />
          <Text>Annually</Text>
        </HStack>
        
      </VStack>
      <Flex direction={{ base: 'column', md: 'row' }} justify="center" wrap="wrap" spacing={4} py={5}>
        {Object.keys(groupedPlans).reverse().map((planName) => { // Reverse the order here
          const currentPlan = isAnnual ? groupedPlans[planName].year : groupedPlans[planName].month;

          if (!currentPlan) return null;
          
          return (
            <PriceWrapper key={currentPlan.id}>
              <Box py={4} px={12}>
                <Text fontWeight="500" fontSize="2xl">
                  {planName}
                </Text>
                <HStack justifyContent="center">
                  <Text fontSize="xl" fontWeight="600">
                    $
                  </Text>
                  <Text fontSize="xl" fontWeight="900">
                    {(currentPlan.unit_price.amount / 100).toFixed(2)} {currentPlan.unit_price.currency_code}
                  </Text>
                  <Text fontSize="xl" color="gray.500">
                    /{isAnnual ? 'Annually' : 'Monthly'} ({currentPlan.billing_cycle.frequency})
                  </Text>
                </HStack>
              </Box>
              <VStack
                bg='gray.50'
                py={4}
                borderBottomRadius={'xl'}>
                <List spacing={3} textAlign="start" px={12}>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    unlimited build minutes
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    Lorem, ipsum dolor.
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    5TB Lorem, ipsum dolor.
                  </ListItem>
                </List>
                <Box w="80%" pt={7}>
                  <Button colorScheme="teal" mt={3} onClick={() => {
                    if (isSubscribedPlan(currentPlan.id)) {
                      // Do nothing or handle cancellation if needed
                    } else if (isDifferentPlan(currentPlan.id)) {
                      updateSub(currentPlan.id);
                    } else {
                      const itemsList = [
                        { priceId: currentPlan.id, quantity: 1 }, // Add Subscription Plan
                      ];
                      openCheckout(itemsList);
                    }
                  }}>
                    {isSubscribedPlan(currentPlan.id) ? 'Cancel' : isDifferentPlan(currentPlan.id) ? 'Upgrade' : 'Start trial'}
                  </Button>
                </Box>
              </VStack>
            </PriceWrapper>
          );
        })}
      </Flex>
    </Box>
  )
}

export default ThreeTierPricing