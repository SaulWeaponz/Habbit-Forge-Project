import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Card,
  Group,
  Badge,
  rem,
  Loader,
  Stack,
  Button,
  Divider,
  Paper,
  Blockquote,
  Box,
} from '@mantine/core';
import {
  IconCategory,
  IconQuote,
  IconLink,
  IconUsers,
  IconRun,
  IconPlus,
  IconUserCircle,
  IconSparkles,
  IconFlame,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';

// Helper function to safely get parsed data from local storage
const getLocalStorageCount = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data).length : 0;
  } catch (e) {
    console.error(`Error parsing data from ${key} in localStorage:`, e);
    return 0; // Return 0 if data is corrupted
  }
};

// Animated background keyframes
const animatedBackground = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
`;

// Rotating inspirational quotes for admins
const adminQuotes = [
  {
    quote: "Leadership is not about being in charge. It's about taking care of those in your charge.",
    author: "Simon Sinek"
  },
  {
    quote: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  },
  {
    quote: "Great things are done by a series of small things brought together.",
    author: "Vincent Van Gogh"
  },
  {
    quote: "Your work as an admin empowers a whole community to grow.",
    author: "Habits Forge Team"
  },
];

function InspirationQuote() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % adminQuotes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);
  return (
    <Blockquote
      color="#22b8cf"
      cite={adminQuotes[index].author}
      icon={<IconQuote size={28} color="#22b8cf" />}
      style={{
        fontSize: '1.05rem',
        background: 'rgba(34,184,207,0.07)',
        borderRadius: 8,
        padding: '12px 20px',
        margin: '0 auto',
        maxWidth: 500,
      }}
    >
      <strong>{adminQuotes[index].quote}</strong>
    </Blockquote>
  );
}

// Fun facts or admin tips
const didYouKnowFacts = [
  "Admins have added over 100 motivational quotes to inspire users!",
  "You can manage categories and tips in just a few clicks from this dashboard.",
  "Regularly updating tips keeps users engaged and coming back for more.",
  "Admins are the backbone of the Habits Forge community!",
  "Did you know? You can preview changes before publishing them to users.",
];

function DidYouKnowFact() {
  const [factIndex, setFactIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % didYouKnowFacts.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);
  return (
    <Text size="md" c="#333" mt="xs" style={{ minHeight: 32 }}>
      {didYouKnowFacts[factIndex]}
    </Text>
  );
}

function DashboardPage1() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalMotivationalQuotes: 0,
    totalHabitTips: 0,
    totalQuoteResources: 0,
    totalHabitTipResources: 0,
    totalUsers: '500+', // Dummy data
    activeHabitsToday: '120', // Dummy data
  });

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setStats({
        totalCategories: getLocalStorageCount('habitCategories'),
        totalMotivationalQuotes: getLocalStorageCount('motivationalQuotes'),
        totalHabitTips: getLocalStorageCount('habitTips'),
        totalQuoteResources: getLocalStorageCount('quoteResources'),
        totalHabitTipResources: getLocalStorageCount('habitTipResources'),
        totalUsers: '500+',
        activeHabitsToday: '120',
      });
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      style={{
        minHeight: 'calc(100vh - var(--mantine-header-height, 0px) - var(--mantine-footer-height, 0px))',
        background: 'linear-gradient(120deg, #fffaf3 0%, #fff3e0 50%, #ffe5c0 100%)', // softened orange gradient
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: 'overlay',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 0',
        animation: `${animatedBackground} 20s linear infinite`,
      }}
    >
      <Container size="lg" px="md">
        <Paper
          shadow="xl"
          radius="lg"
          p="xl"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid #ffe0b2', // light orange border
            boxShadow: '0 4px 32px 0 rgba(255,146,43,0.10)', // subtle orange shadow
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Title
              order={1}
              mb="sm"
              style={{
                fontSize: 'clamp(2.2rem, 6vw, 3.2rem)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#ff922b', // orange title
                lineHeight: 1.1,
              }}
            >
              Admin Dashboard
            </Title>
            <Text size="lg" color="#222" mb="sm" style={{ fontWeight: 500 }}>
              Welcome to your Habits Forge Admin Dashboard!<br />
              We're thrilled to have you here. Your dedication and leadership help shape a thriving, positive community.<br />
              Explore the tools below to inspire, motivate, and empower users on their habit-building journey. Thank you for making a difference every day!
            </Text>
          </div>

          <Divider my="lg" color="#ff922b" />

          {/* Quick Actions Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card shadow="md" padding="lg" radius="lg" withBorder style={{ background: 'rgba(255,255,255,0.92)', boxShadow: '0 2px 12px 0 rgba(255,146,43,0.07)', backdropFilter: 'blur(6px)', marginBottom: 32 }}>
              <Stack gap="md">
                <Title order={4} mb="xs">Quick Actions</Title>
                <Button
                  component={Link}
                  to="categories"
                  leftSection={<IconPlus size={16} />}
                  fullWidth
                  radius="xl"
                  size="md"
                  style={{ fontWeight: 700 }}
                  variant="light"
                >
                  Add/Manage Categories
                </Button>
                <Button
                  component={Link}
                  to="quotes"
                  leftSection={<IconPlus size={16} />}
                  fullWidth
                  radius="xl"
                  size="md"
                  style={{ fontWeight: 700 }}
                  variant="light"
                >
                  Add/Manage Quotes
                </Button>
                <Button
                  component={Link}
                  to="tips"
                  leftSection={<IconPlus size={16} />}
                  fullWidth
                  radius="xl"
                  size="md"
                  style={{ fontWeight: 700 }}
                  variant="light"
                >
                  Add/Manage Tips
                </Button>
                <Button
                  component={Link}
                  to="profile"
                  leftSection={<IconUserCircle size={16} />}
                  fullWidth
                  radius="xl"
                  size="md"
                  style={{ fontWeight: 700 }}
                  variant="light"
                >
                  View Admin Profile
                </Button>
              </Stack>
            </Card>
          </motion.div>

          {/* Only keep the motivational quote and further insights below */}
          <Blockquote
            color="#ff922b"
            cite="James Clear"
            style={{
              fontSize: '1.1rem',
              margin: '0 auto',
              maxWidth: 500,
              background: 'rgba(255,146,43,0.07)',
              borderRadius: 8,
              padding: '16px 24px',
            }}
            icon={<IconSparkles size={32} color="#ff922b" />}
          >
            <strong>"Every action you take is a vote for the type of person you wish to become."</strong>
          </Blockquote>

          {/* Admin Inspiration Board - replaces Admin Success Center */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card
              shadow="lg"
              padding="lg"
              radius="md"
              withBorder
              style={{
                background: 'linear-gradient(120deg, #e3fafc 0%, #fffbe6 100%)',
                marginTop: 36,
                marginBottom: 0,
                border: '2px solid #b2f2ff',
                boxShadow: '0 2px 16px 0 rgba(34, 139, 230, 0.10)',
                textAlign: 'center',
                maxWidth: '1000px', // Increased from 500px
                width: '90%', // Make it responsive and wide
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              <Group position="center" mb="sm">
                <IconSparkles size={32} color="#22b8cf" />
                <Title order={3} style={{ color: '#22b8cf', fontWeight: 800, letterSpacing: 1 }}>Admin Inspiration Board</Title>
                <IconSparkles size={32} color="#22b8cf" />
              </Group>
              {/* Rotating Inspirational Quote */}
              <InspirationQuote />
              <Divider my="md" color="#22b8cf" />
              {/* Did You Know Section */}
              <Group position="center" spacing="md" style={{ justifyContent: 'center' }}>
                <IconFlame size={28} color="#fab005" />
                <Text size="lg" fw={600} style={{ color: '#fab005' }}>Did You Know?</Text>
              </Group>
              <DidYouKnowFact />
            </Card>
          </motion.div>
        </Paper>
      </Container>
    </Box>
  );
}

export default DashboardPage1;