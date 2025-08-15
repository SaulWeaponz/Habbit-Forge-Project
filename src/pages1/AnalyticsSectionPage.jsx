import { Container, Title, Text, Paper, Box, Blockquote, Divider, Group, Card, rem, SimpleGrid, Progress, List, ThemeIcon, Button, Modal, Table, ScrollArea } from '@mantine/core';
import { IconSparkles, IconChartBar, IconUsers, IconTrendingUp, IconUser } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'; // Added for useState and useEffect
import { API_ENDPOINTS } from '../config/strapi';

// Animated background keyframes
const animatedBackground = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
`;

function AnalyticsSectionPage() {
  // --- Backend Data Fetching ---
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [users, setUsers] = useState([]); // <-- Add users state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const AUTH_TOKEN = import.meta.env.VITE_STRAPI_AUTH_TOKEN;
  const HABITS_API = API_ENDPOINTS.HABITS;
  const GOALS_API = API_ENDPOINTS.GOALS;
  const USERS_API = API_ENDPOINTS.USERS;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch habits
        const habitsRes = await fetch(HABITS_API, {
          headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
        });
        const habitsData = await habitsRes.json();
        const habitsList = Array.isArray(habitsData.data) ? habitsData.data.map(h => ({ id: h.id, ...h.attributes })) : [];
        setHabits(habitsList);

        // Fetch goals
        const goalsRes = await fetch(GOALS_API, {
          headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
        });
        const goalsData = await goalsRes.json();
        const goalsList = Array.isArray(goalsData.data) ? goalsData.data.map(g => ({ id: g.id, ...g.attributes })) : [];
        setGoals(goalsList);

        // Fetch users
        const usersRes = await fetch(USERS_API, {
          headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
        });
        const usersData = await usersRes.json();
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (err) {
        setError('Failed to fetch analytics data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Analytics Calculations ---
  // 1. Overall Habit Completion Rate
  const getOverallCompletionRate = (habits) => {
    let totalPossible = 0;
    let totalCompleted = 0;
    habits.forEach(habit => {
      if (!habit.startDate || !habit.endDate) return;
      const start = dayjs(habit.startDate);
      const end = dayjs(habit.endDate);
      const possible = end.diff(start, 'day') + 1;
      totalPossible += possible;
      totalCompleted += (habit.completedDates?.length || 0);
    });
    return totalPossible === 0 ? 0 : Math.round((totalCompleted / totalPossible) * 100);
  };
  const overallCompletionRate = getOverallCompletionRate(habits);

  // 2. Total Number of Users Under Each Role
  const getUserCountsByRole = (users) => {
    const counts = {};
    users.forEach(user => {
      const role = user.role?.name || user.role || 'Unknown';
      counts[role] = (counts[role] || 0) + 1;
    });
    return counts;
  };
  const userCountsByRole = getUserCountsByRole(users);

  // --- Additional Simple Analytics ---
  // 1. Total Habits Created
  const totalHabits = habits.length;
  // 2. Total Goals Created
  const totalGoals = goals.length;
  // 3. Total Habit Completions
  const totalHabitCompletions = habits.reduce((sum, h) => sum + (h.completedDates?.length || 0), 0);

  const [modalOpened, setModalOpened] = React.useState(false);
  const totalUsers = users.length;

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
          p="xl"
          shadow="xl"
          radius="lg"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid #ffe0b2',
            boxShadow: '0 4px 32px 0 rgba(255,146,43,0.10)',
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
              Analytics & Insights
            </Title>
            <Text size="lg" color="#222" mb="sm" style={{ fontWeight: 500 }}>
              View user statistics, habit completion rates, and other key metrics.
            </Text>
            <Blockquote
              color="#ff922b"
              cite="Peter Drucker"
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
              <strong>"What gets measured gets managed."</strong>
            </Blockquote>
          </div>

          <Divider my="xl" label="Analytics Overview" labelPosition="center" color="#ff922b" />

          {/* --- Custom Analytics: Total Number of Users --- */}
          <Paper p="md" radius="md" shadow="xs" mb="lg" style={{ background: 'rgba(255,255,255,0.97)', maxWidth: 600, margin: '0 auto 32px auto', border: '1.5px solid #ffe0b2', textAlign: 'center' }}>
            <Title order={3} color="#ff922b" mb={8} style={{ fontWeight: 700 }}>Total Users</Title>
            <Text size="xl" fw={700} color="#ff922b" mb={12}>{totalUsers}</Text>
            <Button color="orange" variant="light" radius="xl" onClick={() => setModalOpened(true)}>
              View All Users
            </Button>
          </Paper>

          {/* Modal to show all users and their details */}
          <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title="All Users" size="lg" centered>
            <ScrollArea h={400}>
              <Table striped highlightOnHover withTableBorder withColumnBorders>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={4}><Text color="dimmed">No users found.</Text></td></tr>
                  ) : (
                    users.map((user, idx) => (
                      <tr key={user.id || user.email || idx}>
                        <td>{idx + 1}</td>
                        <td>{user.username || user.name || '-'}</td>
                        <td>{user.email || '-'}</td>
                        <td>{user.role?.name || user.role || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </ScrollArea>
          </Modal>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={24} mb="lg">
            {loading ? (
              <>
                <Card shadow="md" padding="lg" radius="lg" withBorder style={{ background: 'rgba(255,255,255,0.92)', minHeight: rem(140), height: '100%' }}>
                  <Group gap="md">
                    <IconChartBar size={36} color="#ff922b" />
                    <div>
                      <Text fw={700} size="lg">Total Habits Created</Text>
                      <Text size="xl" fw={700} color="#ff922b">Loading...</Text>
                      <Text c="#222" size="sm">Number of habits created by all users.</Text>
                    </div>
                  </Group>
                </Card>
                <Card shadow="md" padding="lg" radius="lg" withBorder style={{ background: 'rgba(255,255,255,0.92)', minHeight: rem(140), height: '100%' }}>
                  <Group gap="md">
                    <IconUsers size={36} color="#ff922b" />
                    <div>
                      <Text fw={700} size="lg">Total Goals Created</Text>
                      <Text size="xl" fw={700} color="#ff922b">Loading...</Text>
                      <Text c="#222" size="sm">Number of goals set by all users.</Text>
                    </div>
                  </Group>
                </Card>
                <Card shadow="md" padding="lg" radius="lg" withBorder style={{ background: 'rgba(255,255,255,0.92)', minHeight: rem(140), height: '100%' }}>
                  <Group gap="md">
                    <IconTrendingUp size={36} color="#ff922b" />
                    <div>
                      <Text fw={700} size="lg">Total Habit Completions</Text>
                      <Text size="xl" fw={700} color="#ff922b">Loading...</Text>
                      <Text c="#222" size="sm">Total number of times habits have been completed.</Text>
                    </div>
                  </Group>
                </Card>
              </>
            ) : error ? (
              <Card shadow="md" padding="lg" radius="lg" withBorder style={{ background: 'rgba(255,255,255,0.92)', minHeight: rem(140), height: '100%' }}>
                <Text color="red">{error}</Text>
              </Card>
            ) : (
              <>
                <Card shadow="md" padding="lg" radius="lg" withBorder style={{ background: 'rgba(255,255,255,0.92)', minHeight: rem(140), height: '100%' }}>
                  <Group gap="md">
                    <IconChartBar size={36} color="#ff922b" />
                    <div>
                      <Text fw={700} size="lg">Total Habits Created</Text>
                      <Text size="xl" fw={700} color="#ff922b">{totalHabits}</Text>
                      <Text c="#222" size="sm">Number of habits created by all users.</Text>
                    </div>
                  </Group>
                </Card>
                <Card shadow="md" padding="lg" radius="lg" withBorder style={{ background: 'rgba(255,255,255,0.92)', minHeight: rem(140), height: '100%' }}>
                  <Group gap="md">
                    <IconUsers size={36} color="#ff922b" />
                    <div>
                      <Text fw={700} size="lg">Total Goals Created</Text>
                      <Text size="xl" fw={700} color="#ff922b">{totalGoals}</Text>
                      <Text c="#222" size="sm">Number of goals set by all users.</Text>
                    </div>
                  </Group>
                </Card>
                <Card shadow="md" padding="lg" radius="lg" withBorder style={{ background: 'rgba(255,255,255,0.92)', minHeight: rem(140), height: '100%' }}>
                  <Group gap="md">
                    <IconTrendingUp size={36} color="#ff922b" />
                    <div>
                      <Text fw={700} size="lg">Total Habit Completions</Text>
                      <Text size="xl" fw={700} color="#ff922b">{totalHabitCompletions}</Text>
                      <Text c="#222" size="sm">Total number of times habits have been completed.</Text>
                    </div>
                  </Group>
                </Card>
              </>
            )}
          </SimpleGrid>
        </Paper>
      </Container>
    </Box>
  );
}
export default AnalyticsSectionPage;