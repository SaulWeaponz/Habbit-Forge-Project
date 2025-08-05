// src/App.jsx
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css'; // Mantine's global styles
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks'; // For managing the mobile nav state


import { saveUserToStorage, removeUserFromStorage } from './utils/localStorage';


// Import the content components for header
import PublicNavbar from './components1/PublicNavbar';
import PublicFooter from './components1/PublicFooter'; 

const headerHeight = 100; // Define your header height
  const mainPaddingTop = headerHeight + 2; // Add a bit extra padding for visual separation, e.g., 16px


function App({ colorScheme, toggleColorScheme }) {
  
  // Remove useAuth0 logic

  
  useEffect(() => {
    // Remove useAuth0 logic
  }, []);
  // Removed console.log(user?.email) as user is not defined


  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <header>
        <PublicNavbar colorScheme={colorScheme} toggleColorScheme={toggleColorScheme} />
      </header>
      <main style={{ flex: 1, paddingTop: '56px' }}>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}

export default App;