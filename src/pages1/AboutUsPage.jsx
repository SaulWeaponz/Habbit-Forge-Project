import React from 'react';
import { Title, Text, Container, Paper, Group, Badge, Box, Divider, Image } from '@mantine/core';
import { IconTarget, IconFlame, IconSparkles, IconBulb } from '@tabler/icons-react';
// import aboutHero from '../assets/about-hero.jpg';
const aboutHero = 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80';
import './AboutUsPage.css';

function AboutUsPage() {
  return (
    <Box
      className="aboutus-bg"
      style={{
        minHeight: 'calc(100vh - var(--mantine-header-height, 0px) - var(--mantine-footer-height, 0px))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 0',
      }}
    >
      <Container size="md" px="md">
        <Paper
          shadow="xl"
          radius="lg"
          p="xl"
          className="aboutus-paper"
        >
          {/* Hero Section with Image */}
          <div className="aboutus-hero aboutus-hero-row">
            <div className="aboutus-hero-img-col">
              <Image
                src={aboutHero}
                alt="Person focused on laptop"
                width={240}
                height={240}
                radius={120}
                className="aboutus-hero-img"
              />
            </div>
            <div className="aboutus-hero-content-col">
              <Title order={1} mb="sm" className="aboutus-title">
                About Habits Forge
              </Title>
              <Text size="lg" color="dimmed" mb="sm" className="aboutus-subtitle">
                Helping you build better habits, one step at a time.
              </Text>
            </div>
          </div>

          <Divider my="lg" className="aboutus-divider" />

          {/* Mission & Vision Section */}
          <Group gap={24} mb="xl" align="stretch" wrap="wrap" justify="center">
            <Paper shadow="sm" radius="md" p="md" className="aboutus-mission">
              <Group gap={8} mb={4} align="center">
                <IconTarget size={22} color="#ff9800" />
                <Text fw={700} size="lg">Our Mission</Text>
              </Group>
              <Text size="sm" color="dimmed">
                To empower individuals to create lasting positive change by making habit-building simple, motivating, and fun.
              </Text>
            </Paper>
            <Paper shadow="sm" radius="md" p="md" className="aboutus-vision">
              <Group gap={8} mb={4} align="center">
                <IconFlame size={22} color="#ffa726" />
                <Text fw={700} size="lg">Our Vision</Text>
              </Group>
              <Text size="sm" color="dimmed">
                A world where everyone can achieve their goals and live their best life through the power of small, consistent actions.
              </Text>
            </Paper>
          </Group>

          {/* Core Values/Features Section */}
          <Group justify="center" gap={24} mb="lg" wrap="wrap">
            <Badge
              color="orange"
              size="lg"
              variant="light"
              leftSection={<IconSparkles size={16} />}
              className="aboutus-badge"
            >
              Motivation & Support
            </Badge>
            <Badge
              color="yellow"
              size="lg"
              variant="light"
              leftSection={<IconBulb size={16} />}
              className="aboutus-badge"
            >
              Practical Tips
            </Badge>
            <Badge
              color="orange"
              size="lg"
              variant="light"
              leftSection={<IconTarget size={16} />}
              className="aboutus-badge"
            >
              Goal Tracking
            </Badge>
          </Group>

          <Text align="center" size="sm" color="dimmed" mt="xl" className="aboutus-footer-text">
            Join us on your journey to a better you. Every day is a new opportunity to grow!
          </Text>
        </Paper>
      </Container>
    </Box>
  );
}

export default AboutUsPage;