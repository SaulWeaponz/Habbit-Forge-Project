import React, { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Text,
  Button,
  Group,
  Burger,
  AppShellSection,
  ScrollArea,
  Avatar,
  Center,
  Box,
  Stack,
  Tooltip,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Outlet, useNavigate } from "react-router-dom";
import { IconUser, IconTarget, IconQuote, IconBulb, IconLogout, IconDashboard, IconMenu2, IconX, IconCheck, IconCalendar, IconTrophy, IconBrain, IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import GoalDetail from '../../components/userDashboard/GoalDetail';

const UserDashBoard = () => {
  let user = JSON.parse(localStorage.getItem('currentUser'))

  const isMobile = useMediaQuery('(max-width: 768px)');


  const handleLogout=()=>{
    localStorage.removeItem('currentUser')
    navigate('/login')
  }
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure(false);
  const [expandedItems, setExpandedItems] = useState(new Set());

  const handleNavigate = (path) => {
    navigate(path);
    // Only close sidebar on mobile devices for better UX
    if (isMobile) {
      toggle();
    }
  };

  const toggleExpanded = (itemPath) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemPath)) {
        newSet.delete(itemPath);
      } else {
        newSet.add(itemPath);
      }
      return newSet;
    });
  };

  const handleItemClick = (item) => {
    if (item.hasSubItems) {
      toggleExpanded(item.path);
    } else {
      handleNavigate(item.path);
    }
  };

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

  const navItems = [
    { path: "/user-dashboard", label: "Overview", icon: IconDashboard },
    { path: "/user-dashboard/profile", label: "Profile", icon: IconUser },
    { 
      path: "/user-dashboard/manage-habits", 
      label: "Manage Habits", 
      icon: IconTarget,
      hasSubItems: true,
      subItems: [
        { path: "/user-dashboard/habbits-management", label: "Create Habits", icon: IconTarget },
        { path: "/user-dashboard/interactive-habits", label: "Interactive Habits", icon: IconCheck },
      ]
    },
    { 
      path: "/user-dashboard/manage-goals", 
      label: "Manage Goals", 
      icon: IconTarget,
      hasSubItems: true,
      subItems: [
        { path: "/user-dashboard/goals-management", label: "Create Goals", icon: IconTarget },
        { path: "/user-dashboard/goal-tracking", label: "Track Goals", icon: IconTarget },
      ]
    },
    { path: "/user-dashboard/achievements", label: "Achievements", icon: IconTrophy },
    { 
      path: "/user-dashboard/motivation", 
      label: "Motivation", 
      icon: IconQuote,
      hasSubItems: true,
      subItems: [
        { path: "/user-dashboard/motivational-quotes", label: "View Quotes", icon: IconQuote },
        { path: "/user-dashboard/quote-resource", label: "Quotes Resources", icon: IconQuote },
      ]
    },
    { 
      path: "/user-dashboard/habit-tips", 
      label: "Habit Tips", 
      icon: IconBulb,
      hasSubItems: true,
      subItems: [
        { path: "/user-dashboard/tips", label: "View Tips", icon: IconBulb },
        { path: "/user-dashboard/tip-resources", label: "Tip Resources", icon: IconBulb },
      ]
    },
    { path: "/user-dashboard/insights", label: "Insights", icon: IconBrain },
  ];

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{ 
        width: 280, 
        breakpoint: "sm", 
        collapsed: { mobile: !opened, desktop: !opened } 
      }}
      padding="sm"
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
              User Dashboard
            </Text>
          </Group>
          <Group spacing='sm'>
            <Avatar 
              radius='xl'
              size='md'
              style={{ 
                border: '2px solid #fff', 
                boxShadow: '0 2px 4px rgba(255,146,43,0.2)',
                background: 'linear-gradient(135deg, #ff922b 0%, #ffa726 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '14px'
              }}
            >
              US
            </Avatar>
            <Text size='sm' fw={600} style={{ color: '#222' }}>{user?.name}</Text>
            <Button 
              variant='light' 
              size='xs' 
              onClick={handleLogout}
              style={{ 
                background: '#fff3e0', 
                color: '#ff922b', 
                fontWeight: 700,
                border: '1px solid #ffd180'
              }}
              leftSection={<IconLogout size={14} />}
            >
              Logout
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar 
        width={{ base: 280 }} 
        collapsed={{ mobile: !opened }}
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,248,240,0.95) 100%)',
          backdropFilter: 'blur(12px)',
          borderRight: '2px solid #ffd180',
          boxShadow: '4px 0 16px rgba(255,146,43,0.12)',
          overflow: 'hidden',
          zIndex: 100
        }}
      >
        {/* Decorative background elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'radial-gradient(circle at 20% 80%, rgba(255,146,43,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,193,7,0.03) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
        
        <AppShell.Section pr={24} pl={24} pt={24} pb={24}>
          <ScrollArea style={{ height: "calc(100vh - 120px)" }} mx="auto" type="hover">
            <Stack spacing={8}>
              {navItems.map((item, index) => {
                const isExpanded = expandedItems.has(item.path);
                const isMainItem = index === 0;
                
                return (
                  <div key={item.path}>
                    <Button
                      variant={isMainItem ? "filled" : "light"}
                      fullWidth
                      size="lg"
                      onClick={() => handleItemClick(item)}
                      leftSection={<item.icon size={20} />}
                      rightSection={item.hasSubItems && (
                        isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />
                      )}
                      style={{
                        fontWeight: 600,
                        borderRadius: 12,
                        padding: '12px 16px',
                        height: 'auto',
                        minHeight: 48,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        background: isMainItem 
                          ? 'linear-gradient(135deg, #ff922b 0%, #ffa726 100%)' 
                          : 'rgba(255,255,255,0.8)',
                        color: isMainItem ? '#fff' : '#333',
                        border: isMainItem 
                          ? 'none' 
                          : '1px solid rgba(255,146,43,0.15)',
                        boxShadow: isMainItem 
                          ? '0 4px 16px rgba(255,146,43,0.3)' 
                          : '0 2px 8px rgba(255,146,43,0.08)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: isMainItem 
                            ? '0 8px 24px rgba(255,146,43,0.4)' 
                            : '0 4px 16px rgba(255,146,43,0.15)',
                          background: isMainItem 
                            ? 'linear-gradient(135deg, #ff8a00 0%, #ff9800 100%)' 
                            : 'rgba(255,146,43,0.1)',
                        }
                      }}
                    >
                      <div style={{ textAlign: 'left', width: '100%' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>
                          {item.label}
                        </div>
                        {isMainItem && (
                          <div style={{ 
                            fontSize: '11px', 
                            opacity: 0.9, 
                            marginTop: '2px',
                            fontWeight: 400 
                          }}>
                            Dashboard Home
                          </div>
                        )}
                      </div>
                    </Button>
                    
                    {/* Render sub-items if expanded */}
                    {item.hasSubItems && isExpanded && (
                      <Stack spacing={4} ml={16} mt={4}>
                        {item.subItems.map((subItem) => (
                          <Button
                            key={subItem.path}
                            variant="light"
                            fullWidth
                            size="md"
                            onClick={() => handleNavigate(subItem.path)}
                            leftSection={<subItem.icon size={18} />}
                            style={{
                              fontWeight: 500,
                              borderRadius: 8,
                              padding: '8px 12px',
                              height: 'auto',
                              minHeight: 40,
                              transition: 'all 0.2s ease',
                              background: 'rgba(255,146,43,0.05)',
                              color: '#666',
                              border: '1px solid rgba(255,146,43,0.1)',
                              fontSize: '13px',
                              '&:hover': {
                                background: 'rgba(255,146,43,0.1)',
                                transform: 'translateX(2px)',
                              }
                            }}
                          >
                            {subItem.label}
                          </Button>
                        ))}
                      </Stack>
                    )}
                  </div>
                );
              })}
            </Stack>
          </ScrollArea>

          {/* Sidebar Footer */}
          <Box mt={32} pt={24} style={{ 
            borderTop: '1px solid rgba(255,146,43,0.15)',
            textAlign: 'center' 
          }}>
            <Text size="xs" color="#666" style={{ marginBottom: 8 }}>
              Quick Stats
            </Text>
            <Group justify="center" gap={16}>
              <div style={{ textAlign: 'center' }}>
                <Text size="lg" fw={700} style={{ color: '#ff922b' }}>
                  {navItems.length - 1}
                </Text>
                <Text size="xs" color="#666">Sections</Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Text size="lg" fw={700} style={{ color: '#ff922b' }}>
                  {user?.name ? user.name.split(' ').length : 1}
                </Text>
                <Text size="xs" color="#666">Active</Text>
              </div>
            </Group>
          </Box>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Box
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(8px)',
            borderRadius: 16,
            border: '1.5px solid #ffe0b2',
            boxShadow: '0 4px 32px 0 rgba(255,146,43,0.10)',
            padding: '2rem',
            margin: '0.5rem',
            minHeight: 'calc(100vh - 140px)',
            height: 'auto',
            transition: 'all 0.3s ease'
          }}
        >
          <Outlet />
        </Box>
      </AppShell.Main>

      <AppShell.Footer
        style={{
          background: 'linear-gradient(90deg, #fff3e0 0%, #ffe0b2 100%)',
          borderTop: '2px solid #ffd180',
          boxShadow: '0 -2px 8px rgba(255,146,43,0.08)'
        }}
      >
        <AppShellSection mx='xl'>
          <Center>
            <Text style={{ color: '#ff922b', fontWeight: 600 }}>
              © 2024 Habit Forge - Your Personal Habit Building Journey
            </Text>
          </Center>
        </AppShellSection>
      </AppShell.Footer>
    </AppShell>
  );
};

export default UserDashBoard;
