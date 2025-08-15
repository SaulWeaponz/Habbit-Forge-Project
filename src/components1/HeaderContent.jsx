import React, { useEffect, useState } from 'react';
import { Group, Text, Avatar, Button, rem, Menu, Loader } from '@mantine/core';
import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
import { API_ENDPOINTS } from '../config/strapi';

function HeaderContent() {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();

  useEffect(() => {
    const loadAdminInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, try to get user from localStorage (for Strapi auth)
        const storedUser = localStorage.getItem('currentUser');
        const authToken = localStorage.getItem('authToken');

        if (storedUser) {
          const user = JSON.parse(storedUser);
          console.log('Stored user data:', user);
          setAdminInfo({
            email: user.email || 'admin@example.com',
            username: user.username || user.name || 'Admin User',
            profilePicture: user.picture || user.profilePicture || user.avatar || 'https://ui-avatars.com/api/?name=Admin&background=ff922b&color=fff&size=150',
          });
          setLoading(false);
          return;
        }

        // If no stored user, try to fetch from Strapi API
        if (authToken) {
          const response = await fetch(API_ENDPOINTS.USERS_ME, {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const userData = await response.json();
            console.log('API user data:', userData);
            setAdminInfo({
              email: userData.email || 'admin@example.com',
              username: userData.username || userData.name || 'Admin User',
              profilePicture: userData.profilePicture || userData.picture || userData.avatar || 'https://ui-avatars.com/api/?name=Admin&background=ff922b&color=fff&size=150',
            });
          } else {
            throw new Error('Failed to fetch user data');
          }
        } else {
          // Fallback to default admin info
          setAdminInfo({
            email: 'admin@example.com',
            username: 'Admin User',
            profilePicture: 'https://ui-avatars.com/api/?name=Admin&background=ff922b&color=fff&size=150',
          });
        }
      } catch (err) {
        console.error('Error loading admin info:', err);
        setError(err.message);
        // Set fallback admin info
        setAdminInfo({
          email: 'admin@example.com',
          username: 'Admin User',
          profilePicture: 'https://ui-avatars.com/api/?name=Admin&background=ff922b&color=fff&size=150',
        });
      } finally {
        setLoading(false);
      }
    };

    loadAdminInfo();
  }, []);

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  // Show loading only for a short time, then show content even if there's an error
  if (loading && !adminInfo) {
    return (
      <Group h="100%" px="md" justify="center" style={{ flexGrow: 1 }}>
        <Loader size="md" color="orange" />
      </Group>
    );
  }

  return (
    <Group h="100%" px="md" justify="flex-end" style={{ flexGrow: 1, background: 'linear-gradient(90deg, #fff3e0 0%, #ffe0b2 100%)', color: '#222', borderRadius: 12, boxShadow: '0 2px 8px rgba(255,146,43,0.08)', padding: '0.5rem 1rem', margin: '0.5rem 0' }}>
      <Group>
        <Group gap={6} align="center">
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Avatar 
              src={adminInfo?.profilePicture || 'https://ui-avatars.com/api/?name=Admin&background=ff922b&color=fff&size=150'} 
              alt={adminInfo?.username || 'Admin'} 
              radius="xl" 
              size={40} 
              style={{ border: '2px solid #fff' }} 
            />
          </div>
          {/* Show admin name and email */}
          {!isMobile && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text size="sm" fw={700} visibleFrom="sm" style={{ color: '#222' }}>
                {adminInfo?.username || 'Admin User'}
              </Text>
              <Text size="xs" c="#888">{adminInfo?.email || 'admin@example.com'}</Text>
            </div>
          )}
        </Group>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button variant="light" size="sm" compact color="orange" style={{ background: '#fff3e0', color: '#ff922b', fontWeight: 700 }}>
              <Text size="sm" fw={500}>Options</Text> 
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Profile & Logout</Menu.Label>
            <Menu.Item component={Link} to="/admin/profile" leftSection={<IconUser style={{ width: rem(14), height: rem(14) }} />}>
              Profile
            </Menu.Item>
            <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
              Settings
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item color="red" leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />} onClick={handleLogout}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        {!isMobile && (
          <Button variant="default" onClick={handleLogout} hiddenFrom="xs" color="orange" style={{ background: '#fff3e0', color: '#ff922b', fontWeight: 700 }}>
            Logout
          </Button>
        )}
      </Group>
    </Group>
  );
}

export default HeaderContent;