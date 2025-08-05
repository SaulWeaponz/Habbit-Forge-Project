import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Group,
  Text,
  Burger,
  Drawer,
  Stack,
  Button,
  Flex,
  Box,
  Image,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useMediaQuery } from '@mantine/hooks';
import logo from '../assets/logo.png';


const PublicNavbar = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');


  const regularLinks = (
    <>
      <Button
        component={Link}
        to="/"
        variant={location.pathname === '/' ? 'light' : 'subtle'}
        color="gray"
        radius="xl"
        size="sm"
        onClick={closeDrawer}
        px="md"
        style={{ minWidth: '80px' }}
      >
        Home
      </Button>
      <Button
        component={Link}
        to="/about"
        variant={location.pathname === '/about' ? 'light' : 'subtle'}
        color="gray"
        radius="xl"
        size="sm"
        onClick={closeDrawer}
        px="md"
        style={{ minWidth: '80px' }}
      >
        About
      </Button>
      <Button
        component={Link}
        to="/contact"
        variant={location.pathname === '/contact' ? 'light' : 'subtle'}
        color="gray"
        radius="xl"
        size="sm"
        onClick={closeDrawer}
        px="md"
        style={{ minWidth: '80px' }}
      >
        Contact
      </Button>
    </>
  );

  return (
    <Box
      component="nav"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        background: 'linear-gradient(90deg, #fff8f0 0%, #fff3e0 60%, #ffecb3 100%)', // even lighter orange/cream gradient
        boxShadow: '0 2px 8px rgba(255,236,179,0.08)',
      }}
    >
      <Box
        py={isMobile ? 2 : 4}
        px={isMobile ? 'xs' : 'md'}
        style={{
          height: isMobile ? 48 : 56,
          borderBottom: '1px solid #ffecb3',
          minHeight: isMobile ? 48 : 56,
        }}
      >
        {/* Reduced vertical padding and added subtle border */}
        <Group h="100%" justify="space-between" wrap="nowrap" style={{ flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
          {/* Left Side */}
          <Group gap={isMobile ? 2 : 'xs'} style={{ flexWrap: 'nowrap' }}>
            <Burger 
              opened={drawerOpened} 
              onClick={toggleDrawer} 
              hiddenFrom="sm" 
              size={isMobile ? 'xs' : 'sm'}
              color="#ffecb3"
              style={{
                background: drawerOpened ? 'rgba(255,236,179,0.10)' : 'rgba(255,255,255,0.85)',
                borderRadius: 6,
                border: `2px solid #ffecb3`,
                boxShadow: drawerOpened ? '0 2px 8px rgba(255,236,179,0.12)' : '0 1px 4px rgba(255,236,179,0.07)',
                transition: 'background 0.2s, box-shadow 0.2s, border 0.2s',
                padding: isMobile ? 1 : 2,
              }}
            />
            <Image
              src={logo}
              alt="Habit Forge Logo"
              width={isMobile ? 32 : 48}
              height={isMobile ? 32 : 48}
              style={{ borderRadius: '50%', boxShadow: '0 1px 6px 0 rgba(255,236,179,0.10)', objectFit: 'cover' }}
            />
          </Group>

          {/* Right Side: Desktop Navigation */}
          <Flex gap={4} align="center" visibleFrom="sm"> 
            {/* Tight gap between buttons */}
            {regularLinks}
            <Button
              component={Link}
              to="/login"
              variant="outline"
              color="#ffecb3"
              radius="xl"
              size="sm"
              onClick={closeDrawer}
              px="md"
              style={{ minWidth: '80px', color: '#ffa726', borderColor: '#ffecb3', background: '#fff' }}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/signup"
              variant="gradient"
              gradient={{ from: '#ffecb3', to: '#fff8f0', deg: 45 }}
              radius="xl"
              size="sm"
              onClick={closeDrawer}
              px="md"
              style={{ minWidth: '80px' }}
            >
              Sign Up
            </Button>
          </Flex>

          {/* Mobile Navigation Drawer */}
          <Drawer
            opened={drawerOpened}
            onClose={closeDrawer}
            title="Menu"
            size="sm"
            overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
            hiddenFrom="sm"
            position="left"
          >
            <Stack gap={4}> {/* Tight gap */}
              {regularLinks}
              <Button
                component={Link}
                to="/login"
                variant="outline"
                color="#ffecb3"
                radius="xl"
                size="sm"
                onClick={closeDrawer}
                fullWidth
                style={{ color: '#ffa726', borderColor: '#ffecb3', background: '#fff' }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant="gradient"
                gradient={{ from: '#ffecb3', to: '#fff8f0', deg: 45 }}
                radius="xl"
                size="sm"
                onClick={closeDrawer}
                fullWidth
              >
                Sign Up
              </Button>
            </Stack>
          </Drawer>
        </Group>
      </Box>
    </Box>
  );
};

export default PublicNavbar;