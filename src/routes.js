import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
} from 'react-icons/md';
import { MdSettings, MdCampaign, MdCreditCard, MdVideoLibrary } from 'react-icons/md';
import { LockIcon,  } from '@chakra-ui/icons';
import ProtectedRoute from 'protection';
import LandingPage from 'views/admin/landingPage';

// Admin Imports
import MainDashboard from 'views/admin/mainDashboard';
import SingleFlow from 'views/admin/singleFlow'
import NFTMarketplace from 'views/admin/flowsManagement';
import DataTables from 'views/admin/billsManagement';
import ApiKeys from 'views/admin/apiManagement';
import CampaignsManagement from 'views/admin/CampaignsManagement';
import SignInPage from 'views/auth/';
import SingleCampaign from 'views/admin/singleCampaign';
// Auth Imports
const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: '/main-dashboard',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },


  {
    name: 'Flows',
    layout: '/admin',
    path: '/flows-management',
    icon: (
      <Icon
        as={MdVideoLibrary}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component:
      <ProtectedRoute>
      <NFTMarketplace />
    </ProtectedRoute>,
    secondary: true,
  },
  
  { 
    name: 'Campaigns', 
    layout: '/admin', 
    path: '/campaigns-management', 
    icon: <Icon as={MdCampaign} width="20px" height="20px" color="inherit" />, 
    component: <CampaignsManagement />, 
  },
  {
    name: 'Keys',
    layout: '/admin',
    path: '/keys-management',
    icon: <Icon as={LockIcon} width="20px" height="20px" color="inherit" />,
    component: <ApiKeys />,
  },
  {
    name: 'Subscriptions',
    layout: '/admin',
    icon: <Icon as={MdCreditCard} width="20px" height="20px" color="inherit" />,
    path: '/bills-management',
    component: <DataTables />,
  },
  {
    name: 'Single Campaign',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/single-campaign/:campaignName',
    component: <SingleCampaign />,
    hideInNav: true, 
  },

  {
    name: 'Single',
    layout: '/admin',
    path: '/flow/:id',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <SingleFlow />,
    hideInNav: true,
  }



];

export default routes;
