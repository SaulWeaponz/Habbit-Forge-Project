import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title, Text, Avatar, Button, Group, TextInput, Stack, Paper, Box, Divider } from '@mantine/core';
import { IconEdit, IconCheck, IconX, IconMail, IconUserCircle, IconCamera } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { API_ENDPOINTS } from '../config/strapi';

function AdminProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', profilePicture: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.email) {
      setLoading(false);
      return;
    }
    fetch(API_ENDPOINTS.USERS + '?populate=profilePicture')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const matched = data.find(user => user.email === currentUser.email);
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
            setAdminInfo(matched);
            setFormData({
              name: matched.username || '',
              email: matched.email || '',
              profilePicture: imageUrl,
            });
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
      notifications.show({ title: 'Success', message: 'Image uploaded successfully!', color: 'green' });
    } catch (error) {
      notifications.show({ title: 'Error', message: error.message || 'Image upload failed', color: 'red' });
    }
  };

  const handleUpdate = async () => {
    try {
      const profilePictureId = formData.profilePictureId;
      const response = await fetch(`${API_ENDPOINTS.USERS}/${adminInfo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          profilePicture: profilePictureId,
        }),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      const updated = await response.json();
      setAdminInfo(updated);
      setIsEditing(false);
      notifications.show({ title: 'Success', message: 'Profile updated successfully', color: 'green' });
    } catch (error) {
      notifications.show({ title: 'Error', message: error.message || 'Failed to update profile', color: 'red' });
    }
  };

  const handleCancel = () => {
    if (adminInfo) {
      let imageUrl = '';
      if (adminInfo.profilePicture) {
        if (Array.isArray(adminInfo.profilePicture) && adminInfo.profilePicture[0]?.url) {
          imageUrl = adminInfo.profilePicture[0].url.startsWith('http')
            ? adminInfo.profilePicture[0].url
            : `${API_ENDPOINTS.USERS.replace('/api/users', '')}${adminInfo.profilePicture[0].url}`;
        } else if (adminInfo.profilePicture.url) {
          imageUrl = adminInfo.profilePicture.url.startsWith('http')
            ? adminInfo.profilePicture.url
            : `${API_ENDPOINTS.USERS.replace('/api/users', '')}${adminInfo.profilePicture.url}`;
        }
      }
      setFormData({
        name: adminInfo.username || '',
        email: adminInfo.email || '',
        profilePicture: imageUrl,
      });
    }
    setIsEditing(false);
  };

  if (loading) return <Text align="center">Loading...</Text>;
  if (!adminInfo) return <Text align="center">No admin info found.</Text>;

  return (
    <Box maw={700} mx="auto" my="lg" style={{
      minHeight: 'calc(100vh - var(--mantine-header-height, 0px) - var(--mantine-footer-height, 0px))',
      background: 'linear-gradient(120deg, #fffaf3 0%, #fff3e0 50%, #ffe5c0 100%)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundBlendMode: 'overlay',
      padding: '48px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Paper p="xl" shadow="xl" radius="lg" style={{
        background: 'rgba(255,255,255,0.97)',
        border: '2px solid #ffe0b2',
        boxShadow: '0 8px 32px 0 rgba(255,146,43,0.15)',
        backdropFilter: 'blur(10px)',
        maxWidth: 700,
        width: '100%',
        margin: '0 auto',
        transition: 'box-shadow 0.3s',
      }}>
        <Title order={2} mb="lg" fw={900} style={{ color: '#ff922b', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'center' }}>Admin Profile</Title>
        <Stack gap="lg">
          <Group justify="center">
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                src={formData.profilePicture}
                alt={formData.name}
                size={130}
                radius={100}
                style={{
                  border: '4px solid #ff922b',
                  boxShadow: '0 4px 24px 0 rgba(255,146,43,0.15)',
                  background: '#fffaf3',
                  cursor: isEditing ? 'pointer' : 'default',
                }}
              />
              {isEditing && (
                <IconCamera size={28} style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  background: '#fff',
                  borderRadius: '50%',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  padding: 4,
                  color: '#ff922b',
                  zIndex: 2,
                }} />
              )}
            </div>
          </Group>
          <Group justify="center" mb="sm">
            <Text fw={700} size="lg" style={{ color: '#ff922b', letterSpacing: 1 }}>{formData.name}</Text>
          </Group>
          <Group justify="center" mb="md">
            <Text size="sm" c="#888" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconMail size={16} style={{ color: '#ff922b' }} />
              {formData.email}
            </Text>
          </Group>
          <Divider my={8} color="#ffe0b2" />
          {isEditing && (
            <>
              <TextInput
                label={<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconUserCircle size={18} style={{ color: '#ff922b' }} /> Admin Name</span>}
                name="name"
                value={formData.name}
                onChange={handleChange}
                readOnly={!isEditing}
                variant={isEditing ? 'filled' : 'unstyled'}
                styles={{ input: { fontWeight: 500, background: isEditing ? '#fffaf3' : 'transparent', borderRadius: 8 } }}
                size="md"
                withAsterisk={isEditing}
                autoComplete="off"
              />
              <TextInput
                label={<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconMail size={16} style={{ color: '#ff922b' }} /> Admin Email</span>}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                readOnly={!isEditing}
                variant={isEditing ? 'filled' : 'unstyled'}
                styles={{ input: { fontWeight: 500, background: isEditing ? '#fffaf3' : 'transparent', borderRadius: 8 } }}
                size="md"
                withAsterisk={isEditing}
                autoComplete="off"
              />
              <TextInput
                label={<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconCamera size={16} style={{ color: '#ff922b' }} /> Profile Picture URL</span>}
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleChange}
                placeholder="Enter direct image URL or upload below"
                variant="filled"
                size="md"
                styles={{ input: { borderRadius: 8 } }}
                autoComplete="off"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ marginTop: 8, borderRadius: 8, padding: 4, background: '#fffaf3', border: '1px solid #ffe0b2' }}
              />
              <Group justify="flex-end" mt="md" style={{ gap: 12 }}>
                <Button variant="outline" color="red" leftSection={<IconX size={16} />} onClick={handleCancel} style={{ borderRadius: 8 }}>
                  Cancel
                </Button>
                <Button leftSection={<IconCheck size={16} />} onClick={handleUpdate} color="#ff922b" style={{ fontWeight: 600, borderRadius: 8, transition: 'background 0.2s' }}>
                  Update Profile
                </Button>
              </Group>
            </>
          )}
          {!isEditing && (
            <Group justify="flex-end" mt="md" style={{ gap: 12 }}>
              <Button leftSection={<IconEdit size={16} />} onClick={() => setIsEditing(true)} color="#ff922b" style={{ fontWeight: 600, borderRadius: 8, transition: 'background 0.2s' }}>
                Edit Profile
              </Button>
            </Group>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}

export default AdminProfilePage;