import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './assets/css/App.css';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';
import { SubscriptionProvider } from 'contexts/paddle/SubscriptionContext'; // Import the context provider

const PUBLISHABLE_KEY = process.env.REACT_APP_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(

  <BrowserRouter>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <SubscriptionProvider>

        <App />
      </SubscriptionProvider>

    </ClerkProvider>
  </BrowserRouter>

);