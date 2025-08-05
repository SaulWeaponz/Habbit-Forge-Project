import { Button, Group, Text, Title, Paper, Space, Image, Divider, Blockquote, Badge, Overlay, Container, Box } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconFlame, IconTarget, IconSparkles } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';
import { useMediaQuery } from '@mantine/hooks';
import React, { useState, useEffect } from 'react';

// Define keyframes separately
const animatedBackground = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
`;

function HomePage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [bgIndex, setBgIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      style={{
        minHeight: 'calc(100vh - var(--mantine-header-height, 0px) - var(--mantine-footer-height, 0px))',
        background: `linear-gradient(120deg, #e0e7ff 0%, #b2f2bb 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: 'overlay',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '16px 0' : '48px 0',
        animation: `${animatedBackground} 20s linear infinite`,
      }}
    >
      {/* Main content */}
      <Box style={{ position: 'relative', zIndex: 3, width: '100%' }}>
        <Container size={isMobile ? 'xs' : 'md'} px={isMobile ? 'xs' : 'md'}>
          <Paper
            shadow="xl"
            radius="lg"
            p={isMobile ? 'md' : 'xl'}
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(6px)',
              border: '1.5px solid #e3e8f0',
              boxShadow: '0 4px 32px 0 rgba(34,139,230,0.10)',
              width: '100%',
              maxWidth: 600,
            }}
          >
            {/* Hero Section */}
            <div style={{ textAlign: 'center', marginBottom: isMobile ? 20 : 32 }}>
              <Title
                order={1}
                mb="sm"
                style={{
                  fontSize: isMobile ? '1.5rem' : 'clamp(2.2rem, 6vw, 3.2rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: '#222',
                  lineHeight: 1.1,
                }}
              >
                Small Steps. Lasting Change.
              </Title>
              <Text size="lg" color="dimmed" mb="sm" style={{ fontWeight: 500 }}>
                Your personal path to building better habits.
              </Text>
              <Text size="md" color="dimmed" mb="md">
                Track your goals, stay consistent, and transform your daily routine.
              </Text>
              <Group justify="center" mt="md" gap={isMobile ? 8 : 16} direction={isMobile ? 'column' : 'row'} style={{ flexDirection: isMobile ? 'column' : 'row' }}>
                <Button
                  component={Link}
                  to="/signup"
                  size={isMobile ? 'md' : 'lg'}
                  radius="xl"
                  leftSection={<IconFlame size={isMobile ? 16 : 20} />}
                  style={{ fontWeight: 700, width: isMobile ? '100%' : 'auto' }}
                >
                  Get Started
                </Button>
                <Button
                  component={Link}
                  to="about"
                  size={isMobile ? 'md' : 'lg'}
                  radius="xl"
                  variant="outline"
                  leftSection={<IconSparkles size={isMobile ? 16 : 20} />}
                  style={{ fontWeight: 700, width: isMobile ? '100%' : 'auto' }}
                >
                  Learn More
                </Button>
              </Group>
            </div>

            <Divider my="lg" />

            {/* Features/Benefits Section */}
            <Group justify="center" gap={isMobile ? 8 : 24} mb={isMobile ? 'md' : 'lg'} wrap="wrap">
              <Badge
                color="blue"
                size={isMobile ? 'md' : 'lg'}
                variant="light"
                leftSection={<IconTarget size={isMobile ? 12 : 16} />}
                style={{ fontWeight: 600, fontSize: isMobile ? '0.9rem' : '1rem', padding: isMobile ? '6px 10px' : '8px 16px', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}
              >
                Track Progress
              </Badge>
              <Badge
                color="teal"
                size={isMobile ? 'md' : 'lg'}
                variant="light"
                leftSection={<IconFlame size={isMobile ? 12 : 16} />}
                style={{ fontWeight: 600, fontSize: isMobile ? '0.9rem' : '1rem', padding: isMobile ? '6px 10px' : '8px 16px', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}
              >
                Build Habits
              </Badge>
              <Badge
                color="yellow"
                size={isMobile ? 'md' : 'lg'}
                variant="light"
                leftSection={<IconSparkles size={isMobile ? 12 : 16} />}
                style={{ fontWeight: 600, fontSize: isMobile ? '0.9rem' : '1rem', padding: isMobile ? '6px 10px' : '8px 16px', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}
              >
                Stay Motivated
              </Badge>
            </Group>

            <Blockquote
              color="blue"
              cite="James Clear"
              style={{
                fontSize: isMobile ? '1rem' : '1.1rem',
                margin: isMobile ? '12px auto' : '0 auto',
                maxWidth: isMobile ? '100%' : 500,
                background: 'rgba(34,139,230,0.07)',
                borderRadius: 8,
                padding: isMobile ? '10px 10px' : '16px 24px',
              }}
            >
              <strong>"Every action you take is a vote for the type of person you wish to become."</strong>
            </Blockquote>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage;