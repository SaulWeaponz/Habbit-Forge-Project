import React, { useState, useEffect } from 'react';
import { Card, Stack, Title, Loader, Group, Anchor, Alert, Divider, Box, Image } from '@mantine/core';
import { IconLink, IconAlertCircle } from '@tabler/icons-react';
import quoteResourcesImg from '../../../assets/quote-resources.jpg';
import { API_ENDPOINTS } from '../../../config/strapi';

const STRAPI_RESOURCES_API_URL = API_ENDPOINTS.QUOTE_RESOURCES;

const QuoteResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(STRAPI_RESOURCES_API_URL);
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
    <Card withBorder shadow="md" p="lg" my="md" style={{ maxWidth: 800, margin: 'auto', background: 'rgba(255,255,255,0.96)', borderRadius: 18, boxShadow: '0 4px 24px 0 rgba(34,139,230,0.07)' }}>
      <Title order={2} mb="md" style={{ color: '#ff922b', fontWeight: 800, letterSpacing: '0.03em', textAlign: 'center' }}>Quote Resources</Title>
      <Divider my="md" />
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
                    background: 'linear-gradient(90deg, #fff3e0 0%, #ffe0b2 100%)',
                    borderRadius: 12,
                    padding: '1rem 1.5rem',
                    boxShadow: '0 2px 8px 0 rgba(255,146,43,0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'box-shadow 0.2s',
                    border: '1px solid #ffe0b2',
                  }}
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
        <Box style={{ minWidth: 180, maxWidth: 240, flex: '0 0 220px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
          <Image src={quoteResourcesImg} alt="Quote Resources" radius={16} fit="contain" w={200} h={200} style={{ background: '#fffaf3', border: '1.5px solid #ffe0b2', boxShadow: '0 2px 12px 0 rgba(255,146,43,0.07)' }} />
        </Box>
      </Box>
    </Card>
  );
};

export default QuoteResources; 