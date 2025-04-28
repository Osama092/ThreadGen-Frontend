import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Create the context
const SubscriptionContext = createContext();

// Provide the context to components
export const SubscriptionProvider = ({ children }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isSubbed, setIsSubbed] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [transactionData, setTransactionData] = useState(null);
  const [transactionDataTable, setTransactionDataTable] = useState(null);

  

  useEffect(() => {
    const checkSubscription = async (email) => {
      try {
        const response = await axios.post('http://localhost:5000/subscriptions', { email });
        const subscriptionStatus = response.data.isSubbed;
        const subscriptionInfo = response.data.subscriptionData;
        const transactionInfo = response.data.transactionData;
        const transactionInfoTable = response.data.transactionDataTable;

        setIsSubbed(subscriptionStatus);
        setSubscriptionData(subscriptionInfo);
        setTransactionData(transactionInfo);
        setTransactionDataTable(transactionInfoTable);

      } catch (error) {
        console.error('Error fetching subscription data:', error);
      }
    };

    if (user) {
      const email = user.primaryEmailAddress.emailAddress;
      checkSubscription(email);
    } else {
      navigate('/sign-in'); // Redirect to sign-in page
    }
  }, [user, navigate]);

  return (
    <SubscriptionContext.Provider value={{ isSubbed, subscriptionData, transactionData, transactionDataTable }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// Custom hook to use the context
export const useSubscription = () => useContext(SubscriptionContext);