import React, { useEffect } from 'react';
import { AppShell, Group, Button, Tooltip, Text } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Outlet } from 'react-router-dom'; // Import Outlet for nested routes
import { IconMenu2, IconX } from '@tabler/icons-react';
import HeaderContent from './HeaderContent';
import SidebarNav from './SidebarNav';

function AdminLayout() {
  const [opened, { toggle }] = useDisclosure(true); // Sidebar open by default
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Keyboard shortcut for toggling sidebar (Ctrl/Cmd + B)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        toggle();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggle]);

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 250, // sidebar width 
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: !opened },
      }}
      padding="md"
      style={{
        background: 'linear-gradient(120deg, #fffaf3 0%, #fff3e0 50%, #ffe5c0 100%)',
        minHeight: '100vh'
      }}
    >
      <AppShell.Header 
        withBorder 
        style={{
          background: 'linear-gradient(90deg, #fff3e0 0%, #ffe0b2 100%)',
          borderBottom: '2px solid #ffd180',
          boxShadow: '0 2px 8px rgba(255,146,43,0.08)',
          paddingLeft: 20,
          paddingRight: 20
        }}
      >
        <Group h="100%" px="md" justify='space-between' align='center'>
          <Group>
            <Tooltip
              label={`${opened ? 'Close' : 'Open'} sidebar (Ctrl+B)`}
              position="bottom"
              withArrow
            >
              <Button
                variant="light"
                size="sm"
                onClick={toggle}
                style={{
                  background: 'rgba(255,146,43,0.1)',
                  color: '#ff922b',
                  border: '1px solid rgba(255,146,43,0.2)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255,146,43,0.15)',
                    transform: 'scale(1.05)'
                  }
                }}
                leftSection={opened ? <IconX size={16} /> : <IconMenu2 size={16} />}
              >
                {opened ? 'Close' : 'Menu'}
              </Button>
            </Tooltip>
            <Text 
              fw={900} 
              size='xl' 
              style={{ 
                color: '#ff922b', 
                letterSpacing: 1.5, 
                textTransform: 'uppercase',
                textShadow: '0 1px 2px rgba(255,146,43,0.1)'
              }}
            >
              Admin Dashboard
            </Text>
          </Group>
          <HeaderContent />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {/*Sidebar Navigation */}
        <SidebarNav />
      </AppShell.Navbar>

      <AppShell.Main>
        {/* nested routes will render */}
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default AdminLayout;