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
      width={{ base: '280px', sm: '300px', md: '280px', lg: '280px' }}
      mx={{ base: 'auto', lg: 2 }}
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

const FeedbackModal = ({ isOpen, onClose, type, handleAction, planName, price, onActionComplete }) => {
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
        
        // Close the modal and trigger page refresh after showing success message
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          // Trigger the callback to refresh the page
          if (onActionComplete) {
            onActionComplete();
          }
        }, 1500); // Reduced timeout for better UX
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

const ThreeTierPricing = ({ onActionComplete }) => {
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

  const email = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    initializePaddle({ environment: 'sandbox', token: process.env.REACT_APP_PADDLE_TOKEN })
      .then((paddleInstance) => {
        if (paddleInstance) {
          setPaddle(paddleInstance);
          
          paddleInstance.Checkout.on('open', () => {
            console.log('Paddle checkout opened');
          });
          
          paddleInstance.Checkout.on('close', () => {
            if (checkoutButtonRef.current) {
              setTimeout(() => {
                checkoutButtonRef.current.focus();
              }, 0);
            }
          });

          // Listen for successful checkout completion
          paddleInstance.Checkout.on('checkout.completed', (data) => {
            console.log('Checkout completed:', data);
            // Trigger page refresh after successful purchase
            setTimeout(() => {
              if (onActionComplete) {
                onActionComplete();
              }
            }, 2000); // Give some time for the transaction to process
          });

        } else {
          console.error('Paddle initialization failed');
        }
      })
      .catch((error) => {
        console.error('Error initializing Paddle:', error);
      });
  }, [onActionComplete]);

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
          customData: {
            helloworld: 'Hello from Paddle Checkout',
            customer_email: email 
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

  // Fixed subscription status checks
  const isSubscribedPlan = (planId) => {
    return subscriptionData && 
           subscriptionData.data && 
           subscriptionData.data.items && 
           subscriptionData.data.items[0] && 
           subscriptionData.data.items[0].price.id === planId &&
           subscriptionData.data.status === 'active'; // Changed to explicitly check for 'active'
  };

  const isSubscriptionCanceled = () => {
    return subscriptionData && 
           subscriptionData.data && 
           (subscriptionData.data.status === 'canceled' || 
            subscriptionData.data.status === 'cancelled' || // Handle both spellings
            subscriptionData.data.status === 'paused' ||
            subscriptionData.data.status === 'past_due'); // Include other non-active states
  };

  const isDifferentPlan = (planId) => {
    return subscriptionData && 
           subscriptionData.data && 
           subscriptionData.data.items && 
           subscriptionData.data.items[0] && 
           subscriptionData.data.items[0].price.id !== planId &&
           subscriptionData.data.status === 'active'; // Only show upgrade for active subscriptions
  };

  // New helper function to check if user has any subscription history
  const hasSubscriptionHistory = () => {
    return subscriptionData && subscriptionData.data && subscriptionData.data.id;
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

  // Handler for when any action completes (to refresh the page)
  const handleActionComplete = () => {
    // Close any open modals first
    onClose();
    
    // Refresh the page after a short delay
    setTimeout(() => {
      if (onActionComplete) {
        onActionComplete();
      } else {
        // Fallback to window.location.reload if no callback provided
        window.location.reload();
      }
    }, 500);
  };

  return (
    <Box py={{ base: 6, md: 12 }} px={{ base: 4, md: 6, lg: 8 }}>
      <VStack spacing={2} textAlign="center" mb={{ base: 6, md: 8 }}>
        <Heading 
          as="h1" 
          fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
          px={{ base: 4, md: 0 }}
        >
          Plans that fit your need
        </Heading>
        
        <HStack mb={4} align="center" spacing={3}>
          <Text fontSize={{ base: "sm", md: "md" }}>Monthly</Text>
          <Switch
            isChecked={isAnnual}
            onChange={() => setIsAnnual(!isAnnual)}
            colorScheme="teal"
          />
          <Text fontSize={{ base: "sm", md: "md" }}>Annually</Text>
        </HStack>
      </VStack>
      
      <Flex 
        direction={{ base: 'column', lg: 'row' }} 
        justify="center" 
        align={{ base: 'center', lg: 'flex-start' }}
        gap={{ base: 4, lg: 6 }}
        py={5}
        maxWidth="1200px"
        mx="auto"
      >
        {Object.keys(groupedPlans).reverse().map((planName, index) => { 
          const currentPlan = isAnnual ? groupedPlans[planName].year : groupedPlans[planName].month;
          const isMiddlePlan = index === 1; // Middle plan (Pro Plan)

          if (!currentPlan) return null; 


          
          const priceDisplay = `$${(currentPlan.unit_price.amount / 100).toFixed(2)} ${currentPlan.unit_price.currency_code}/${isAnnual ? 'year' : 'month'}`;
          
          let buttonText = 'Start trial';
          let buttonColor = "teal";
          let buttonVariant = "solid";
          let buttonAction = () => {
            const itemsList = [{ priceId: currentPlan.id, quantity: 1 }];
            openCheckout(itemsList, { current: checkoutButtonRef.current });
          };
          
          // Fixed button logic
          if (isSubscribedPlan(currentPlan.id)) {
            // User is currently subscribed to this plan
            buttonText = 'Cancel';
            buttonColor = "red";
            buttonVariant = "outline";
            buttonAction = () => handlePlanAction(currentPlan, 'cancel');
          } else if (isDifferentPlan(currentPlan.id)) {
            // User has active subscription to different plan
            buttonText = 'Upgrade';
            buttonAction = () => handlePlanAction(currentPlan, 'upgrade');
          } else if (isSubscriptionCanceled() && hasSubscriptionHistory()) {
            // User had subscription but it's now canceled/inactive
            buttonText = 'Resubscribe';
            buttonAction = () => {
              const itemsList = [{ priceId: currentPlan.id, quantity: 1 }];
              openCheckout(itemsList, { current: checkoutButtonRef.current });
            };
          } else {
            // New user or no subscription history
            buttonText = 'Get Started';
            buttonAction = () => {
              const itemsList = [{ priceId: currentPlan.id, quantity: 1 }];
              openCheckout(itemsList, { current: checkoutButtonRef.current });
            };
          }
          
          return (
            <PriceWrapper key={currentPlan.id} isPopular={isMiddlePlan}> 
              <Box py={{ base: 3, md: 4 }} px={{ base: 4, md: 6 }}>
                <Text 
                  fontWeight="500" 
                  fontSize={{ base: "lg", md: "xl" }}
                  mb={2}
                  textAlign="center"
                >
                  {planName}
                </Text>
                
                {/* Responsive Price Display */}
                <VStack spacing={0} justify="center" align="center" mb={1}>
                  <HStack 
                    justify="center" 
                    align="baseline" 
                    spacing={1}
                  >
                    <Text fontSize={{ base: "md", md: "lg" }} fontWeight="600">
                      $
                    </Text>
                    <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="900" lineHeight="1">
                      {(currentPlan.unit_price.amount / 100).toFixed(0)}
                    </Text>
                    <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="500" color="gray.600">
                      {currentPlan.unit_price.currency_code}
                    </Text>
                  </HStack>
                  
                  <Text 
                    fontSize={{ base: "xs", md: "sm" }} 
                    color="gray.500" 
                    textAlign="center"
                  >
                    per {isAnnual ? 'year' : 'month'}
                  </Text>
                </VStack>
              </Box>
              
              <VStack
                bg='gray.50'
                py={{ base: 3, md: 4 }}
                borderBottomRadius={'xl'}
                minHeight={{ base: "auto", md: "240px" }}
              >
                <List spacing={1} textAlign="start" px={{ base: 3, md: 4 }} width="100%">
                  {planPerks[currentPlan.id] && planPerks[currentPlan.id].map((perk, index) => (
                    <ListItem key={index} fontSize={{ base: "xs", md: "sm" }}>
                      <ListIcon as={FaCheckCircle} color="green.500" />
                      {perk}
                    </ListItem>
                  ))}
                  {!planPerks[currentPlan.id] && (
                      <ListItem>
                          <Text color="gray.500" fontSize={{ base: "xs", md: "sm" }}>
                            (Perks not defined for ID: {currentPlan.id})
                          </Text>
                      </ListItem>
                  )}
                </List>
                
                <Box w={{ base: "85%", md: "80%" }} pt={3}>
                  <Button 
                    ref={(el) => {
                      if (el) checkoutButtonRef.current = el; 
                    }}
                    colorScheme={buttonColor}
                    variant={buttonVariant}
                    mt={2} 
                    onClick={buttonAction}
                    isLoading={updateLoading || cancelLoading}
                    width="100%"
                    size={{ base: "sm", md: "md" }}
                    fontSize={{ base: "sm", md: "md" }}
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
        onActionComplete={handleActionComplete}
      />
    </Box>
  )
}

export default ThreeTierPricing