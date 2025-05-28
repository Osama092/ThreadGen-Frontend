import { Box, SimpleGrid, Grid } from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";

import { Link, HStack} from "@chakra-ui/react"
import PricingPage from 'components/pricingPage/pricing'

import ComplexTable from "views/admin/billsManagement/components/ComplexTable";

import React ,{ useState, useEffect } from "react";

import { Card, CardBody, Button, Heading, Text, Badge, Spinner } from '@chakra-ui/react'
import { initializePaddle } from '@paddle/paddle-js';
import axios from 'axios';
import { useSubscription } from 'contexts/paddle/SubscriptionContext';

export default function Billing() {
  const [paddle, setPaddle] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isSubbed, subscriptionData, transactionData } = useSubscription();
  const [cardInfo, setCardInfo] = useState(null);

  
  let next_billing_cycle
  let amount
  let currency_code

  let currentPlan
  let currentPlanDescription


  useEffect(() => {

    if (transactionData && transactionData.length > 0) {
      setCardInfo(transactionData[0]);
    }
  }, [isSubbed, subscriptionData, transactionData]);

  if (subscriptionData && subscriptionData.data && subscriptionData.data.items && subscriptionData.data.items.length > 0) {
    next_billing_cycle = subscriptionData.data.items[0].next_billed_at;
    amount = subscriptionData.data.items[0].price.unit_price.amount;
    currency_code = subscriptionData.data.items[0].price.unit_price.currency_code;

    currentPlan = subscriptionData.data.items[0].price.name;
    currentPlanDescription = subscriptionData.data.items[0].price.description;
  } else {
      console.log('subscriptionData or its data is null or undefined');
  }


  useEffect(() => {
    initializePaddle({ environment: 'sandbox', token: process.env.REACT_APP_PADDLE_TOKEN })
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

  const updatePaymentMethod = async () => {
    try {
      const response = await axios.post(`/subscriptions/${subscriptionData.data.id}/update-payment-method-transaction`);
      paddle?.Checkout.open({
        transactionId: response.data.data.id
      });
    } catch (error) {
      console.error(`Error fetching data for subscription ID ${subscriptionData.data.id} from Paddle API:`, error);
    }
  };

  return (

        
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
    {isSubbed === null ? (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="400px"
          width="100%"
        >
          <Spinner size="xl" color="brand.500" thickness="4px" />
        </Box>
    ) : isSubbed ? (
      <Grid
        mb='20px'
        templateColumns={{
          base: "1fr",
        }}
        templateRows={{
          base: "repeat(1, 1fr)",
          lg: "1fr",
        }}
        spacing={{ base: "20px", xl: "20px" }}>
        
        <Heading mb={5}>Plan overview</Heading>


        <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline'
          borderRadius="xl"
          mb={5}
        >
          <CardBody>
            <SimpleGrid minChildWidth='120px' spacing='40px'>
              <Box height='auto' display="flex" alignItems="center">
                <Badge colorScheme="blue" fontSize="lg" px={4} py={2}>Current plan</Badge> 
              </Box>
              <Box height='auto' display="flex" alignItems="center">
                <Text mr="30%"> 
                  <Text>{ currentPlan }</Text>
                  <Text whiteSpace="nowrap">{ currentPlanDescription }</Text>
                </Text>
              </Box>
              <Box height='auto' width="100%" display="flex" alignItems="center"></Box>

              <Box height='auto' display="flex" alignItems="center" justifyContent="flex-end">
                <Button variant='solid' colorScheme='blue' onClick={onOpen}>Change Plan</Button> 
              </Box>
                  
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW="100%" width="70%">
                  <ModalCloseButton />
                  <ModalBody>
                    <PricingPage />
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </SimpleGrid>
          </CardBody>
        </Card>

        <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline'
          borderRadius="xl"
        >
          <CardBody>
            <SimpleGrid minChildWidth='120px' spacing='40px'>
              <Box height='auto' display="flex" alignItems="center">
                <Badge colorScheme="blue" fontSize="lg" px={4} py={2}>Renewal</Badge> 
              </Box>
              <Box height='auto' display="flex" alignItems="center">
                <HStack spacing={2}>
                  <label>Date</label>
                  <Text type="date">
                    { new Date(next_billing_cycle).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) 
                    } 
                  </Text> 
                </HStack>
              </Box>
              <Box height='auto' display="flex" alignItems="center" >
                <HStack spacing={2}>
                  <label>Amount</label>
                  <Text>{ amount } <Text as="span">{ currency_code }</Text></Text>
                </HStack>
              </Box>
              <Box height='auto' display="flex" alignItems="center" ></Box>
            </SimpleGrid>
          </CardBody>
        </Card>

        <SimpleGrid minChildWidth='120px' >
          <Box height='auto'>
            <Text>
            Need unlimited api usage on a bigger scale?  {" "}
              <Link 
                color="brand.500" 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=derouichoussama099@gmail.com"
                target="_blank"
              >
                Contact Sales
              </Link>
            </Text>
          </Box>
        </SimpleGrid>

        <Heading mb={5}>Payment method</Heading>

        <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline'
          borderRadius="xl"
          mb={5}
        >
          <CardBody>
            <SimpleGrid minChildWidth='120px' spacing='40px'>
              <Box height='auto' display="flex" alignItems="center">
                <Badge colorScheme="blue" fontSize="lg" px={4} py={2}>Card details</Badge> 
              </Box>
              <Box height='auto' display="flex" alignItems="center">
                <HStack>
                  <svg viewBox="0 0 24 24"  width="35" height="35" focusable="false" className="chakra-icon css-m94y6i">
                    <path fill="currentColor" d="M1.406 17.023a2.461 2.461 0 002.461 2.46h14.766a2.461 2.461 0 002.46-2.46v-6.768H1.407v6.768zm2.9-3.34a1.318 1.318 0 011.319-1.318h2.11a1.318 1.318 0 011.318 1.318v.879a1.318 1.318 0 01-1.319 1.318H5.625a1.318 1.318 0 01-1.318-1.318v-.879zM18.633 4.014H3.867a2.46 2.46 0 00-2.46 2.461v1.143h19.687V6.475a2.46 2.46 0 00-2.461-2.46z"></path>
                  </svg>
                    <Text>
                      *** **** ****  
                      {cardInfo ? `   ${ cardInfo.payments[0].method_details.card.last4} ` : 'No Card Info Available'}

                    </Text>
                </HStack>
              </Box>
              <Box height='auto' display="flex" alignItems="center" >
                <HStack spacing={2}>
                    <label>Expires</label>
                    <Text>
                    {cardInfo ? `${cardInfo.payments[0].method_details.card.expiry_month}/${String(cardInfo.payments[0].method_details.card.expiry_year).slice(-2)}` : 'No Card Info Available'}
                    </Text>
                </HStack>
              </Box>

              <Box height='auto' width="100%" display="flex" alignItems="center" justifyContent="flex-end">
                <Button variant='solid' colorScheme='blue' onClick={updatePaymentMethod} >Change Payment method</Button> 
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>
      
        <Heading mb={5}>History</Heading>

        <ComplexTable
          columnsData
        />

        </Grid>
        
      ) : (
        <p>Not subscribed</p>
      )}
    

    
    </Box>
        
  );
}