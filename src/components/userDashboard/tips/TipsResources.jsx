import React, { useState, useEffect } from 'react';
import { Card, Stack, Title, Loader, Group, Anchor, Alert, Divider, Box, Image } from '@mantine/core';
import { IconLink, IconAlertCircle } from '@tabler/icons-react';
import motivationImg from '../../../assets/motivation.jpg';
import { API_ENDPOINTS } from '../../../config/strapi';

const STRAPI_TIP_RESOURCES_API_URL = API_ENDPOINTS.TIP_RESOURCES;

const TipsResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(STRAPI_TIP_RESOURCES_API_URL);
        if (!response.ok) throw new Error('Failed to fetch resources');
        const data = await response.json();
        setResources(data.data.map(item => ({
          id: item.id,
          name: item.attributes?.name || item.name,
          link: item.attributes?.link || item.link
        })));
      } catch (e) {
        setError('Failed to load resources.');
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  return (
    <Card withBorder shadow="md" p="lg" my="md" style={{ maxWidth: 900, margin: 'auto', background: 'linear-gradient(120deg, #fff3e0 0%, #ffe0b2 100%)', borderRadius: 20, boxShadow: '0 4px 24px 0 rgba(255,146,43,0.10)' }}>
      <Title order={2} mb="md" style={{ color: '#ff922b', fontWeight: 900, letterSpacing: '0.03em', textAlign: 'center', textShadow: '0 2px 8px #ffe0b233' }}>Tip Resources</Title>
      <Divider my="md" color="#ff922b" />
      <Box style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {/* Left: Resource List */}
        <Box style={{ flex: 1, minWidth: 0 }}>
          {error && <Alert icon={<IconAlertCircle size={16} />} color="red">{error}</Alert>}
          {loading ? (
            <Group justify="center"><Loader /></Group>
          ) : resources.length === 0 ? (
            <Box style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '1.5rem 0' }}>No resources added yet.</Box>
          ) : (
            <Stack spacing="md">
              {resources.map(resource => (
                <Box
                  key={resource.id}
                  style={{
                    background: 'linear-gradient(90deg, #fff7e6 0%, #ffe0b2 100%)',
                    borderRadius: 14,
                    padding: '1rem 1.5rem',
                    boxShadow: '0 2px 8px 0 rgba(255,146,43,0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    border: '1.5px solid #ffe0b2',
                    transition: 'box-shadow 0.2s, background 0.2s',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#ffe0b2'}
                  onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #fff7e6 0%, #ffe0b2 100%)'}
                >
                  <Anchor
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    leftSection={<IconLink size={16} color="#ff922b" />}
                    style={{
                      color: '#222',
                      fontWeight: 600,
                      fontSize: '1.08rem',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                      flex: 1,
                    }}
                    onMouseOver={e => (e.currentTarget.style.color = '#ff922b')}
                    onMouseOut={e => (e.currentTarget.style.color = '#222')}
                  >
                    {resource.name}
                  </Anchor>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
        {/* Right: Image */}
        <Box style={{ minWidth: 220, maxWidth: 400, flex: '0 0 370px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
          <Image src={motivationImg} alt="Motivation" radius={24} fit="cover" w={350} h={350} style={{ objectFit: 'cover', borderRadius: 24, background: '#fffaf3', border: '1.5px solid #ffe0b2', boxShadow: '0 2px 12px 0 rgba(255,146,43,0.07)' }} />
        </Box>
      </Box>
    </Card>
  );
};

export default TipsResources; 