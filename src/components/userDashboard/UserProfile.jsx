import React, { useState, useEffect } from 'react';
import {
  Container, Title, Text, Paper, Avatar, Stack, Loader, Button, Group, TextInput, Divider, Tooltip, Box, rem
} from '@mantine/core';
import { IconEdit, IconCheck, IconX, IconMail, IconUserCircle, IconCamera, IconInfoCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { saveUserToStorage, getUserFromStorage } from '../../utils/localStorage';
import { API_ENDPOINTS } from '../../config/strapi';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', profilePicture: '' });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // First try to get user from localStorage
    const storedUser = getUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        name: storedUser.name || storedUser.username || '',
        email: storedUser.email || '',
        profilePicture: storedUser.picture || storedUser.profilePicture || '',
      });
      setLoading(false);
      // Still fetch from backend to ensure latest data
      fetch(API_ENDPOINTS.USERS + '?populate=profilePicture')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const matched = data.find(u => u.email === storedUser?.email); // Use storedUser?.email
            if (matched) {
              let imageUrl = '';
              if (matched.profilePicture) {
                if (Array.isArray(matched.profilePicture) && matched.profilePicture[0]?.url) {
                  imageUrl = matched.profilePicture[0].url.startsWith('http')
                    ? matched.profilePicture[0].url
                                         : `${API_ENDPOINTS.USERS.replace('/api/users', '')}${matched.profilePicture[0].url}`;
                  } else if (matched.profilePicture.url) {
                    imageUrl = matched.profilePicture.url.startsWith('http')
                      ? matched.profilePicture.url
                      : `${API_ENDPOINTS.USERS.replace('/api/users', '')}${matched.profilePicture.url}`;
                }
              }
              setUserInfo(matched);
              setFormData({
                name: matched.username || '',
                email: matched.email || '',
                profilePicture: imageUrl,
              });
              // Always update localStorage with latest backend user data
              saveUserToStorage({
                ...matched,
                picture: imageUrl,
                profilePicture: matched.profilePicture,
              });
              setUser({ ...matched, picture: imageUrl, profilePicture: matched.profilePicture });
            }
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []); // Only run on mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formDataUpload = new FormData();
    formDataUpload.append('files', file);
    try {
      const response = await fetch(API_ENDPOINTS.UPLOAD, {
        method: 'POST',
        body: formDataUpload,
      });
      if (!response.ok) throw new Error('Image upload failed');
      const data = await response.json();
              const imageUrl = data[0]?.url
          ? (data[0].url.startsWith('http') ? data[0].url : `${API_ENDPOINTS.USERS.replace('/api/users', '')}${data[0].url}`)
          : '';
      const imageId = data[0]?.id;
      setFormData((prev) => ({ ...prev, profilePicture: imageUrl, profilePictureId: imageId }));

      // Update localStorage user data immediately
      const storedUser = getUserFromStorage();
      if (storedUser) {
        const updatedUser = { ...storedUser, picture: imageUrl, profilePicture: imageId };
        saveUserToStorage(updatedUser);
        setUser(updatedUser);
      }

      notifications.show({ title: 'Success', message: 'Profile picture uploaded successfully!', color: 'green' });
    } catch (error) {
      notifications.show({ title: 'Error', message: error.message || 'Profile picture upload failed', color: 'red' });
    }
  };

  const handleUpdate = async () => {
    try {
      const profilePictureId = formData.profilePictureId;
      // Try both one-to-one and one-to-many payloads for compatibility
      let payload = {
        username: formData.name,
        email: formData.email,
      };
      if (profilePictureId) {
        payload.profilePicture = profilePictureId; // one-to-one
      }
      const jwt = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (jwt) headers['Authorization'] = `Bearer ${jwt}`;
      let response, updated = null;
      if (userInfo && userInfo.id) {
        // Always use /users/:id for update
        response = await fetch(`${API_ENDPOINTS.USERS}/${userInfo.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload),
        });
        if (!response.ok && profilePictureId) {
          payload.profilePicture = [profilePictureId];
          const retryRes = await fetch(`${API_ENDPOINTS.USERS}/${userInfo.id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(payload),
          });
          if (retryRes.ok) {
            updated = await retryRes.json();
            setUserInfo(updated);
          } else {
            throw new Error('Failed to update profile picture in backend');
          }
        } else if (response.ok) {
          updated = await response.json();
          setUserInfo(updated);
        }
      }
      // Always update localStorage with latest backend user data after update
      if (updated) {
        let imageUrl = '';
        if (updated.profilePicture) {
          if (Array.isArray(updated.profilePicture) && updated.profilePicture[0]?.url) {
                          imageUrl = updated.profilePicture[0].url.startsWith('http')
                ? updated.profilePicture[0].url
                : `${API_ENDPOINTS.USERS.replace('/api/users', '')}${updated.profilePicture[0].url}`;
            } else if (updated.profilePicture.url) {
              imageUrl = updated.profilePicture.url.startsWith('http')
                ? updated.profilePicture.url
                : `${API_ENDPOINTS.USERS.replace('/api/users', '')}${updated.profilePicture.url}`;
          }
        }
        saveUserToStorage({
          ...updated,
          picture: imageUrl,
          profilePicture: updated.profilePicture,
        });
        setUser({ ...updated, picture: imageUrl, profilePicture: updated.profilePicture });
      }
      setIsEditing(false);
      notifications.show({ title: 'Success', message: 'Profile details saved successfully!', color: 'green' });
    } catch (error) {
      notifications.show({ title: 'Error', message: error.message || 'Failed to save profile details', color: 'red' });
    }
  };

  const handleCancel = () => {
    if (userInfo) {
      let imageUrl = '';
      if (userInfo.profilePicture) {
        if (Array.isArray(userInfo.profilePicture) && userInfo.profilePicture[0]?.url) {
                      imageUrl = userInfo.profilePicture[0].url.startsWith('http')
              ? userInfo.profilePicture[0].url
              : `${API_ENDPOINTS.USERS.replace('/api/users', '')}${userInfo.profilePicture[0].url}`;
          } else if (userInfo.profilePicture.url) {
            imageUrl = userInfo.profilePicture.url.startsWith('http')
              ? userInfo.profilePicture.url
              : `${API_ENDPOINTS.USERS.replace('/api/users', '')}${userInfo.profilePicture.url}`;
        }
      }
      setFormData({
        name: userInfo.username || '',
        email: userInfo.email || '',
        profilePicture: imageUrl,
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Container size="sm" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper shadow="xl" radius="lg" p="xl" style={{ background: 'rgba(255,255,255,0.97)', border: '1.5px solid #ffe0b2' }}>
          <Stack align="center" spacing="lg">
            <Loader color="orange" size="lg" />
            <Text size="lg" color="#666">Loading user profile...</Text>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Box style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #fffaf3 0%, #fff3e0 50%, #ffe5c0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: rem(24),
    }}>
      <Container size={480} px={0}>
        <Paper shadow="xl" radius="xl" p={24} style={{ background: 'rgba(255,255,255,0.98)', border: '2px solid #ffe0b2', boxShadow: '0 8px 32px 0 rgba(255,146,43,0.10)' }}>
          <Stack align="center" spacing="sm">
            <Title order={1} style={{ color: '#ff922b', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 0 }}>
              My Profile
            </Title>
            <Text size="md" color="#666" style={{ marginBottom: 8, fontWeight: 500 }}>
              Update your personal details and profile picture
            </Text>
            <Divider my="sm" style={{ width: '100%' }} />
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 4 }}>
              <Avatar
                src={formData.profilePicture || 'https://i.pravatar.cc/150?img=13'}
                size={150}
                radius="xl"
                style={{
                  border: '4px solid #ff922b',
                  background: '#fffaf3',
                  boxShadow: '0 8px 32px rgba(255,146,43,0.2)',
                  transition: 'all 0.3s ease'
                }}
              />
              {isEditing && (
                <Tooltip label="Upload new profile picture" withArrow position="right">
                  <label htmlFor="profile-upload" style={{ cursor: 'pointer' }}>
                    <IconCamera size={32} style={{
                      position: 'absolute',
                      bottom: 12,
                      right: 12,
                      background: '#fff',
                      borderRadius: '50%',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      padding: 6,
                      color: '#ff922b',
                      zIndex: 2,
                      border: '2px solid #ff922b',
                      transition: 'all 0.2s',
                    }} />
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                  </label>
                </Tooltip>
              )}
            </div>
            {isEditing ? (
              <Stack spacing="sm" style={{ width: '100%' }}>
                <TextInput
                  label={<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconUserCircle size={18} style={{ color: '#ff922b' }} /> Full Name</span>}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  variant="filled"
                  styles={{ input: { fontWeight: 500, background: '#fffaf3', borderRadius: 8, border: '1.5px solid #ffe0b2', transition: 'border 0.2s' } }}
                  size="md"
                  withAsterisk
                  autoComplete="off"
                />
                <TextInput
                  label={<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconMail size={16} style={{ color: '#ff922b' }} /> Email Address</span>}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  variant="filled"
                  styles={{ input: { fontWeight: 500, background: '#fffaf3', borderRadius: 8, border: '1.5px solid #ffe0b2', transition: 'border 0.2s' } }}
                  size="md"
                  withAsterisk
                  autoComplete="off"
                />
                <TextInput
                  label={<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconCamera size={16} style={{ color: '#ff922b' }} /> Profile Picture</span>}
                  name="profilePicture"
                  value={formData.profilePicture}
                  onChange={handleChange}
                  placeholder="Paste an image URL or upload above"
                  variant="filled"
                  size="md"
                  styles={{ input: { borderRadius: 8, border: '1.5px solid #ffe0b2', transition: 'border 0.2s' } }}
                  autoComplete="off"
                  rightSection={<Tooltip label="Paste an image URL or click the camera icon above to upload" withArrow><IconInfoCircle size={18} color="#ff922b" /></Tooltip>}
                />
                <Group justify="flex-end" mt="sm" style={{ gap: 12 }}>
                  <Button
                    variant="outline"
                    color="red"
                    leftSection={<IconX size={16} />}
                    onClick={handleCancel}
                    style={{ borderRadius: 8, fontWeight: 600, transition: 'background 0.2s' }}
                  >
                    Discard Changes
                  </Button>
                  <Button
                    leftSection={<IconCheck size={16} />}
                    onClick={handleUpdate}
                    color="#ff922b"
                    style={{ fontWeight: 700, borderRadius: 8, transition: 'background 0.2s' }}
                  >
                    Save Profile
                  </Button>
                </Group>
              </Stack>
            ) : (
              <>
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <Text size="md" fw={700} style={{ color: '#222', marginBottom: 4 }}>
                    Full Name
                  </Text>
                  <Text size="lg" style={{ color: '#444', marginBottom: 12, fontWeight: 500 }}>
                    {formData.name || 'Not provided'}
                  </Text>
                  <Text size="md" fw={700} style={{ color: '#222', marginBottom: 4 }}>
                    Email Address
                  </Text>
                  <Text size="lg" style={{ color: '#444', marginBottom: 12, fontWeight: 500 }}>
                    {formData.email || 'Not provided'}
                  </Text>
                </div>
                <Group justify="flex-end" mt="sm" style={{ gap: 12, width: '100%' }}>
                  <Button
                    leftSection={<IconEdit size={16} />}
                    onClick={() => setIsEditing(true)}
                    color="#ff922b"
                    style={{ fontWeight: 700, borderRadius: 8, transition: 'background 0.2s' }}
                  >
                    Edit Details
                  </Button>
                </Group>
              </>
            )}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default UserProfile;