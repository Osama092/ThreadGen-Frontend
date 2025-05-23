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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  Radio,
  RadioGroup,
  Stack,
  Alert,
  AlertIcon,
  Divider,
  Badge
} from '@chakra-ui/react'
import { FaCheckCircle } from 'react-icons/fa'
import usePrices from 'hooks/paddle/usePrices'; // Import the custom hook
import React, { useState, useEffect, useContext, useRef } from 'react';
import { initializePaddle } from '@paddle/paddle-js';
import { useUser } from '@clerk/clerk-react';
import { useUpdateSubscription } from 'hooks/paddle/useSubUpdate';
import { useSubscriptionCancel } from 'hooks/paddle/useCancelSub';
import { useSubscription } from 'contexts/paddle/SubscriptionContext';

const PriceWrapper = ({ children, isPopular = false }) => {
  return (
    <Box
      mb={4}
      shadow={isPopular ? "xl" : "base"}
      borderWidth={isPopular ? "2px" : "1px"}
      alignSelf={{ base: 'center', lg: 'flex-start' }}
      borderColor={isPopular ? 'teal.500' : 'gray.200'}
      borderRadius={'xl'}
      width={{ base: '100%', md: '25%' }}
      mx={2}
      position="relative"
      transform={isPopular ? "scale(1.05)" : "scale(1)"}
      zIndex={isPopular ? 10 : 1}
    >
      {isPopular && (
        <Badge
          position="absolute"
          top="-10px"
          left="50%"
          transform="translateX(-50%)"
          bg="teal.500"
          color="white"
          px={3}
          py={1}
          borderRadius="full"
          fontSize="sm"
          fontWeight="bold"
        >
          Most Popular
        </Badge>
      )}
      {children}
    </Box>
  )
}

const FeedbackModal = ({ isOpen, onClose, type, handleAction, planName, price }) => {
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Call the actual action handler
    handleAction(reason, feedback)
      .then(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        
        // Close the modal after showing success message
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
        }, 2000);
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.error("Action failed:", error);
        // Optionally show an error message
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
      <ModalContent borderRadius="xl" shadow="xl">
        <ModalHeader borderBottomWidth="1px" pb={3}>
          {type === 'cancel' ? 'Cancel Your Subscription' : 'Upgrade Your Plan'}
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody py={6}>
          {isSuccess ? (
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              {type === 'cancel' 
                ? 'Your subscription has been canceled successfully.' 
                : `Your subscription has been upgraded to ${planName} successfully.`}
            </Alert>
          ) : (
            <>
              <Text mb={4}>
                {type === 'cancel' 
                  ? 'We\'re sorry to see you go. Please let us know why you\'re canceling:' 
                  : `You're about to upgrade to the ${planName} plan at ${price}.`}
              </Text>
              
              {type === 'cancel' && (
                <FormControl mb={4}>
                  <FormLabel>Reason for cancellation</FormLabel>
                  <RadioGroup onChange={setReason} value={reason}>
                    <Stack spacing={2}>
                      <Radio value="too_expensive">Too expensive</Radio>
                      <Radio value="not_enough_features">Not enough features</Radio>
                      <Radio value="switching_to_competitor">Switching to a competitor</Radio>
                      <Radio value="temporary_pause">Just taking a break</Radio>
                      <Radio value="other">Other</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
              )}
              
              <FormControl>
                <FormLabel>
                  {type === 'cancel' ? 'Additional feedback (optional)' : 'Any specific features you\'re looking forward to?'}
                </FormLabel>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={type === 'cancel' 
                    ? 'Tell us how we can improve...' 
                    : 'Share what you\'re most excited about...'
                  }
                  size="md"
                  resize="vertical"
                />
              </FormControl>
            </>
          )}
        </ModalBody>

        {!isSuccess && (
          <ModalFooter borderTopWidth="1px" pt={3}>
            <Button variant="outline" mr={3} onClick={onClose}>
              {type === 'cancel' ? 'Keep Subscription' : 'Cancel'}
            </Button>
            <Button 
              colorScheme={type === 'cancel' ? 'red' : 'teal'} 
              onClick={handleSubmit}
              isLoading={isSubmitting}
            >
              {type === 'cancel' ? 'Confirm Cancellation' : 'Confirm Upgrade'}
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

const ThreeTierPricing = () => {
  const { loading: updateLoading, error: updateError, data: updateData, handleUpdateSubscription } = useUpdateSubscription();
  const { loading: cancelLoading, error: cancelError, data: cancelData, handleCancelSubscription } = useSubscriptionCancel();
  const { isSubbed, subscriptionData, transactionData } = useSubscription();

  const [isAnnual, setIsAnnual] = useState(false);
  const { prices, priceLoading, priceError } = usePrices();
  const [paddle, setPaddle] = useState();
  const checkoutButtonRef = useRef(null);
  const { user } = useUser();
  
  // Modal control
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState('cancel');
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Define your plan perks here, keyed by Paddle Price ID.
  const planPerks = {
    // Monthly Plans
    "pri_01j82nx8bqpf679svazwrgja50": [ 
      "100 Requests Limit",
      "Standard Email Support",
      "Low Video Generating Priority",
    ],
    "pri_01j82nzvsg4st6xjs8px3khsgg": [
      "500 Requests Limit",
      "Basic video Generating Priority",
      "24/7 Priority Support",
    ],
    "pri_01j83g0qprpe2xdwpjgebqhef3": [
      "Unlimited Requests",
      "High Video Generating Priority",
      "24/7 Priority Support",
    ],

    // Annual Plans
    "pri_01j82nyetjez36tratkwysaaj4": [ 
      "100 Requests Limit",
      "Standard Email Support",
      "Low Video Generating Priority",
      "Save 17% annually"
    ],
    "pri_01j82p126fykccmf7gtf1k0vwj": [
      "500 Requests Limit",
      "Basic video Generating Priority",
      "24/7 Priority Support",
      "Save 17% annually"
    ],
    "pri_01j83g1rs5ynrh6tnq2zeq5y9t": [
      "Unlimited Requests",
      "High Video Generating Priority",
      "24/7 Priority Support",
      "Save 23% annually"
    ],
  };

  console.log("All prices from Paddle:", prices);

  useEffect(() => {
    if (isSubbed !== null) {
      console.log('Current subscription data:', subscriptionData);
    }
  }, [isSubbed, subscriptionData]);

  useEffect(() => {
    if (user) {
      console.log("User Email:", user.primaryEmailAddress?.emailAddress);
    } else {
      console.log("User is not logged in");
    }
  }, [user]);

  const email = user?.primaryEmailAddress?.emailAddress;
  console.log("User email for Paddle checkout:", email);

  useEffect(() => {
    initializePaddle({ environment: 'sandbox', token: process.env.REACT_APP_PADDLE_TOKEN })
      .then((paddleInstance) => {
        if (paddleInstance) {
          setPaddle(paddleInstance);
          
          paddleInstance.Checkout.on('open', () => {
            console.log('Paddle checkout opened');
          });
          
          paddleInstance.Checkout.on('close', () => {
            console.log('Paddle checkout closed');
            if (checkoutButtonRef.current) {
              setTimeout(() => {
                checkoutButtonRef.current.focus();
              }, 0);
            }
          });
        } else {
          console.error('Paddle initialization failed');
        }
      })
      .catch((error) => {
        console.error('Error initializing Paddle:', error);
      });
  }, []);

  const updateSub = (priceId) => {
    const subscriptionId = subscriptionData?.data?.id;
  
    if (subscriptionId && priceId) {
      return handleUpdateSubscription(subscriptionId, priceId);
    } else {
      console.error('Subscription ID or Price ID is missing for update.');
      return Promise.reject('Subscription ID or Price ID is missing');
    }
  };
  
  const cancelSub = () => {
    const subscriptionId = subscriptionData?.data?.id;
    
    if (subscriptionId) {
      return handleCancelSubscription(subscriptionId);
    } else {
      console.error('Subscription ID is missing for cancellation.');
      return Promise.reject('Subscription ID is missing');
    }
  };

  const openCheckout = (items, buttonRef) => {
    if (paddle) {
      
      document.activeElement?.blur();
      
      setTimeout(() => {
        paddle.Checkout.open({
          items: items,
          customer: {
            email: email,
          },
          settings: {
            displayMode: 'overlay',
            theme: 'light',
            locale: 'en'
          }
        });
      }, 100);
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
    return subscriptionData && 
           subscriptionData.data && 
           subscriptionData.data.items && 
           subscriptionData.data.items[0] && 
           subscriptionData.data.items[0].price.id === planId &&
           subscriptionData.data.status !== 'canceled';
  };

  const isSubscriptionCanceled = () => {
    return subscriptionData && 
           subscriptionData.data && 
           subscriptionData.data.status === 'canceled';
  };

  const isDifferentPlan = (planId) => {
    return subscriptionData && 
           subscriptionData.data && 
           subscriptionData.data.items && 
           subscriptionData.data.items[0] && 
           subscriptionData.data.items[0].price.id !== planId &&
           subscriptionData.data.status !== 'canceled';
  };

  const handlePlanAction = (plan, actionType) => {
    setSelectedPlan(plan);
    setModalType(actionType);
    onOpen();
  };

  const executeAction = (reason, feedback) => {
    if (modalType === 'upgrade' && selectedPlan) {
      return updateSub(selectedPlan.id);
    } else if (modalType === 'cancel') {
      return cancelSub();
    }
    return Promise.resolve();
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
        {Object.keys(groupedPlans).reverse().map((planName, index) => { 
          const currentPlan = isAnnual ? groupedPlans[planName].year : groupedPlans[planName].month;
          const isMiddlePlan = index === 1; // Middle plan (Pro Plan)

          if (!currentPlan) return null; 

          console.log(`Rendering: ${planName} (${isAnnual ? 'Annual' : 'Monthly'}) - Price ID: ${currentPlan.id}`);
          
          const priceDisplay = `$${(currentPlan.unit_price.amount / 100).toFixed(2)} ${currentPlan.unit_price.currency_code}/${isAnnual ? 'year' : 'month'}`;
          
          let buttonText = 'Start trial';
          let buttonColor = "teal";
          let buttonVariant = "solid";
          let buttonAction = () => {
            const itemsList = [{ priceId: currentPlan.id, quantity: 1 }];
            openCheckout(itemsList, { current: checkoutButtonRef.current });
          };
          
          if (isSubscribedPlan(currentPlan.id)) {
            buttonText = 'Cancel';
            buttonColor = "red";
            buttonVariant = "outline";
            buttonAction = () => handlePlanAction(currentPlan, 'cancel');
          } else if (isDifferentPlan(currentPlan.id)) {
            buttonText = 'Upgrade';
            buttonAction = () => handlePlanAction(currentPlan, 'upgrade');
          } else if (isSubscriptionCanceled()) {
            buttonText = 'Resubscribe';
            buttonAction = () => {
              const itemsList = [{ priceId: currentPlan.id, quantity: 1 }];
              openCheckout(itemsList, { current: checkoutButtonRef.current });
            };
          }
          
          return (
            <PriceWrapper key={currentPlan.id} isPopular={isMiddlePlan}> 
              <Box py={4} px={8}>
                <Text fontWeight="500" fontSize="2xl">
                  {planName}
                </Text>
                <HStack justifyContent="center">
                  <Text fontSize="xl" fontWeight="600">
                    $
                  </Text>
                  <Text fontSize="xl" fontWeight="900">
                    {(currentPlan.unit_price.amount / 100).toFixed(2)}
                  </Text>
                  <Text fontSize="sm" fontWeight="500" alignSelf="flex-start" mt={1}>
                    {currentPlan.unit_price.currency_code}
                  </Text>
                  <Text fontSize="xl" color="gray.500">
                    /{isAnnual ? 'Annually' : 'Monthly'}
                  </Text>
                </HStack>
              </Box>
              <VStack
                bg='gray.50'
                py={4}
                borderBottomRadius={'xl'}>
                <List spacing={2} textAlign="start" px={6} width="100%">
                  {planPerks[currentPlan.id] && planPerks[currentPlan.id].map((perk, index) => (
                    <ListItem key={index} fontSize="sm">
                      <ListIcon as={FaCheckCircle} color="green.500" />
                      {perk}
                    </ListItem>
                  ))}
                  {!planPerks[currentPlan.id] && (
                      <ListItem>
                          <Text color="gray.500" fontSize="sm">
                            (Perks not defined for ID: {currentPlan.id})
                          </Text>
                      </ListItem>
                  )}
                </List>
                <Box w="80%" pt={4}>
                  <Button 
                    ref={(el) => {
                      if (el) checkoutButtonRef.current = el; 
                    }}
                    colorScheme={buttonColor}
                    variant={buttonVariant}
                    mt={3} 
                    onClick={buttonAction}
                    isLoading={updateLoading || cancelLoading}
                    width="100%"
                  >
                    {buttonText}
                  </Button>
                </Box>
              </VStack>
            </PriceWrapper>
          );
        })}
      </Flex>
      
      <FeedbackModal 
        isOpen={isOpen} 
        onClose={onClose} 
        type={modalType}
        handleAction={executeAction}
        planName={selectedPlan?.name || ''}
        price={selectedPlan ? `$${(selectedPlan.unit_price.amount / 100).toFixed(2)} ${selectedPlan.unit_price.currency_code}/${selectedPlan.billing_cycle.interval}` : ''}
      />
    </Box>
  )
}

export default ThreeTierPricing