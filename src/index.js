import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './assets/css/App.css';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';
import { SSEProvider } from 'contexts/SSEContext';

const PUBLISHABLE_KEY = process.env.REACT_APP_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(

  <BrowserRouter>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <SSEProvider>
        <App />
      </SSEProvider>
    </ClerkProvider>
  </BrowserRouter>

);