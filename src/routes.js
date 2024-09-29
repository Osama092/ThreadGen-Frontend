import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
} from 'react-icons/md';
import { MdSettings } from 'react-icons/md';
import { LockIcon } from '@chakra-ui/icons';

// Admin Imports
import MainDashboard from 'views/admin/mainDashboard';
import SingleFlow from 'views/admin/singleFlow'
import NFTMarketplace from 'views/admin/flowsManagement';
import DataTables from 'views/admin/billsManagement';
import ApiKeys from 'views/admin/apiManagement';
import SignInPage from 'views/auth/';
// Auth Imports
const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },


  

  {
    name: 'Flow Managment',
    layout: '/admin',
    path: '/nft-marketplace',
    icon: (
      <Icon
        as={MdSettings}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <NFTMarketplace />,
    secondary: true,
  },
  {
    name: 'Api Key',
    layout: '/admin',
    path: '/apikey',
    icon: <Icon as={LockIcon} width="20px" height="20px" color="inherit" />,
    component: <ApiKeys />,
  },
  {
    name: 'Billing',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/billing',
    component: <DataTables />,
  },

  {
    name: 'Single',
    layout: '/admin',
    path: '/flow/:id',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <SingleFlow />,
  },



];

export default routes;
