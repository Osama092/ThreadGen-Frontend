import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import {} from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import SingleFlow from './views/admin/singleFlow';
import {
  ChakraProvider,
} from '@chakra-ui/react';
import initialTheme from './theme/theme'; //  { themeGreen }
import { useState } from 'react';
import { ModalProvider } from 'contexts/ModalContext'
// Chakra imports
import SignInPage from 'views/auth/index';
import LandingPage from 'views/admin/landingPage'; // Assuming you save the landing page here

export default function Main() {
  // eslint-disable-next-line
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  return (
    <ModalProvider>
      <ChakraProvider theme={currentTheme}>
        <Routes>
          <Route path="/sign-in" element={<LandingPage />} />

          <Route
            path="admin/*"
            element={
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
            }
          />        
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>


      </ChakraProvider>
    </ModalProvider>
  );
}
