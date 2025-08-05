import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  SimpleGrid,
  Card,
  Group,
  Badge,
  Stack,
  Button,
  Box,
  Avatar,
  Progress,
  Loader,
  Center,
} from '@mantine/core';
import {
  IconTarget,
  IconCheck,
  IconQuote,
  IconBulb,
  IconUser,
  IconTrendingUp,
  IconCalendar,
  IconTrophy,
  IconBrain,
  IconChartBar,
  IconFlame,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const EnhancedOverview = () => {
  const [userStats, setUserStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    totalGoals: 0,
    completedGoals: 0,
    streakDays: 0,
    totalQuotes: 0,
  });
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const storedHabits = JSON.parse(localStorage.getItem('habits') || '[]');
      const storedGoals = JSON.parse(localStorage.getItem('goals') || '[]');
      
      setHabits(storedHabits);
      setGoals(storedGoals);
      
      setUserStats({
        totalHabits: storedHabits.length,
        completedToday: storedHabits.filter(h => 
          h.completedDates?.includes(new Date().toISOString().split('T')[0])
        ).length,
        totalGoals: storedGoals.length,
        completedGoals: storedGoals.filter(g => g.completed).length,
        streakDays: calculateCurrentStreak(storedHabits),
        totalQuotes: Math.floor(Math.random() * 50) + 10, // Mock data
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCurrentStreak = (habits) => {
    let streak = 0;
    const today = new Date();
    
    while (true) {
      const dateStr = today.toISOString().split('T')[0];
      const hasCompletedHabits = habits.some(habit => 
        habit.completedDates?.includes(dateStr)
      );
      
      if (hasCompletedHabits) {
        streak++;
        today.setDate(today.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = '#ff922b', progress = null }) => (
    <Card
      shadow="md"
      padding="lg"
      radius="lg"
      withBorder
      style={{
        background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
        border: '1px solid #ffd180',
        transition: 'transform 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-2px)',
        }
      }}
    >
      <Group justify="space-between" mb="xs">
        <Text fw={600} size="lg" style={{ color: '#222' }}>{title}</Text>
        <Icon style={{ width: 24, height: 24, color: color }} stroke={1.5} />
      </Group>
      <Text size="xl" fw={800} style={{ fontSize: '1.8rem', color: '#222', marginBottom: '0.5rem' }}>
        {value}
      </Text>
      {subtitle && (
        <Text size="sm" color="#666" mb="sm">
          {subtitle}
        </Text>
      )}
      {progress !== null && (
        <Progress
          value={progress}
          color={color}
          size="sm"
          style={{ marginTop: '0.5rem' }}
        />
      )}
    </Card>
  );

  const QuickActionCard = ({ title, description, icon: Icon, path, color = '#ff922b' }) => (
    <Card
      shadow="md"
      padding="lg"
      radius="lg"
      withBorder
      component={Link}
      to={path}
      style={{
        background: 'rgba(255,255,255,0.9)',
        border: '1px solid #ffd180',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        textDecoration: 'none',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(255,146,43,0.15)',
        }
      }}
    >
      <Group mb="md">
        <Icon size={28} color={color} />
        <Title order={4} style={{ color: '#ff922b', fontWeight: 700 }}>
          {title}
        </Title>
      </Group>
      <Text size="sm" color="#666" style={{ lineHeight: 1.5 }}>
        {description}
      </Text>
    </Card>
  );

  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  if (loading) {
    return (
      <Container size="lg">
        <Center style={{ height: '50vh' }}>
          <Stack align="center" spacing="md">
            <Loader size="lg" color="orange" />
            <Text size="lg" color="#666">Loading your personalized dashboard...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Paper
        shadow="xl"
        radius="lg"
        p="xl"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid #ffe0b2',
          boxShadow: '0 4px 32px 0 rgba(255,146,43,0.10)',
        }}
      >


        {/* Quick Actions */}
        <Title order={3} style={{ color: '#ff922b', fontWeight: 700, marginBottom: '1.5rem' }}>
          Quick Actions
        </Title>
        
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" mb="xl">
          <QuickActionCard
            icon={IconTarget}
            title="Manage Habits"
            description="Create, edit, and track your daily habits"
            path="/user-dashboard/habbits-management"
            color="#ff922b"
          />
          <QuickActionCard
            icon={IconCheck}
            title="Interactive Habits"
            description="Track habits with real-time feedback and animations"
            path="/user-dashboard/interactive-habits"
            color="#4caf50"
          />
          <QuickActionCard
            icon={IconTrophy}
            title="Achievements"
            description="Earn badges and level up your habit journey"
            path="/user-dashboard/achievements"
            color="#ff9800"
          />
          <QuickActionCard
            icon={IconTarget}
            title="Goal Tracking"
            description="Visualize goals and track progress with charts"
            path="/user-dashboard/goal-tracking"
            color="#9c27b0"
          />
          <QuickActionCard
            icon={IconBrain}
            title="Insights"
            description="Get personalized recommendations and analytics"
            path="/user-dashboard/insights"
            color="#ff5722"
          />
        </SimpleGrid>

        {/* Motivation Section */}
        <Box
          style={{
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
            borderRadius: 16,
            padding: '2rem',
            border: '2px solid #ffd180',
            textAlign: 'center'
          }}
        >
          <IconTrophy size={48} color="#ff922b" style={{ marginBottom: '1rem' }} />
          <Title order={3} style={{ color: '#ff922b', fontWeight: 700, marginBottom: '0.5rem' }}>
            Keep Going! 🚀
          </Title>
          <Text size="lg" color="#222" style={{ fontWeight: 500, marginBottom: '1rem' }}>
            Every small step counts towards your bigger goals. You're doing great!
          </Text>
          <Button
            variant="gradient"
            gradient={{ from: '#ff922b', to: '#ffa726', deg: 45 }}
            size="md"
            component={Link}
            to="/user-dashboard/habbits-management"
            style={{
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(255,146,43,0.25)'
            }}
          >
            Continue Your Journey
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EnhancedOverview; 