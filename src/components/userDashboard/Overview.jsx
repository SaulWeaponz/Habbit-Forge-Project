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
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const Overview = () => {
  const [userStats, setUserStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    totalGoals: 0,
    completedGoals: 0,
    streakDays: 0,
    totalQuotes: 0,
  });

  useEffect(() => {
    // Get stats from localStorage
    try {
      const habits = JSON.parse(localStorage.getItem('habits') || '[]');
      const goals = JSON.parse(localStorage.getItem('goals') || '[]');
      
      setUserStats({
        totalHabits: habits.length,
        completedToday: habits.filter(h => h.completedDates?.includes(new Date().toISOString().split('T')[0])).length,
        totalGoals: goals.length,
        completedGoals: goals.filter(g => g.completed).length,
        streakDays: Math.floor(Math.random() * 30) + 1, // Mock data
        totalQuotes: Math.floor(Math.random() * 50) + 10, // Mock data
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  }, []);

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
        {/* Welcome Section */}
        <Group justify="space-between" mb="xl">
          <div>
            <Title
              order={1}
              style={{
                color: '#ff922b',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                marginBottom: '0.5rem'
              }}
            >
              Welcome back, {user.name || 'User'}! 👋
            </Title>
            <Text size="lg" color="#222" style={{ fontWeight: 500 }}>
              Track your progress and continue building amazing habits
            </Text>
          </div>
          <Avatar
            src={user.picture || 'https://i.pravatar.cc/150?img=13'}
            size="xl"
            radius="xl"
            style={{ border: '3px solid #fff', boxShadow: '0 4px 12px rgba(255,146,43,0.2)' }}
          />
        </Group>

        {/* Stats Grid */}
        <Title order={3} style={{ color: '#ff922b', fontWeight: 700, marginBottom: '1.5rem' }}>
          Your Progress Overview
        </Title>
        
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" mb="xl">
          <StatCard
            icon={IconTarget}
            title="Total Habits"
            value={userStats.totalHabits}
            subtitle="Active habits you're tracking"
            color="#ff922b"
          />
          <StatCard
            icon={IconCheck}
            title="Completed Today"
            value={userStats.completedToday}
            subtitle={`${userStats.totalHabits > 0 ? Math.round((userStats.completedToday / userStats.totalHabits) * 100) : 0}% of daily goal`}
            color="#4caf50"
            progress={userStats.totalHabits > 0 ? (userStats.completedToday / userStats.totalHabits) * 100 : 0}
          />
          <StatCard
            icon={IconTrophy}
            title="Current Streak"
            value={userStats.streakDays}
            subtitle="Days in a row"
            color="#ff9800"
          />
          <StatCard
            icon={IconTarget}
            title="Total Goals"
            value={userStats.totalGoals}
            subtitle="Goals you've set"
            color="#2196f3"
          />
          <StatCard
            icon={IconCheck}
            title="Completed Goals"
            value={userStats.completedGoals}
            subtitle={`${userStats.totalGoals > 0 ? Math.round((userStats.completedGoals / userStats.totalGoals) * 100) : 0}% completed`}
            color="#4caf50"
            progress={userStats.totalGoals > 0 ? (userStats.completedGoals / userStats.totalGoals) * 100 : 0}
          />
          <StatCard
            icon={IconQuote}
            title="Motivational Quotes"
            value={userStats.totalQuotes}
            subtitle="Quotes available"
            color="#9c27b0"
          />
        </SimpleGrid>

        {/* Quick Actions */}
        <Title order={3} style={{ color: '#ff922b', fontWeight: 700, marginBottom: '1.5rem' }}>
          Quick Actions
        </Title>
        
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          <QuickActionCard
            icon={IconTarget}
            title="Manage Habits"
            description="Create, edit, and track your daily habits"
            path="/user-dashboard/habbits-management"
            color="#ff922b"
          />
          <QuickActionCard
            icon={IconTarget}
            title="Set Goals"
            description="Define and track your personal goals"
            path="/user-dashboard/goals-management"
            color="#2196f3"
          />
          <QuickActionCard
            icon={IconQuote}
            title="Get Motivated"
            description="Read inspiring quotes to stay motivated"
            path="/user-dashboard/motivational-quotes"
            color="#9c27b0"
          />
          <QuickActionCard
            icon={IconBulb}
            title="Daily Tips"
            description="Get helpful tips for building better habits"
            path="/user-dashboard/tips"
            color="#ff9800"
          />
          <QuickActionCard
            icon={IconUser}
            title="Profile Settings"
            description="Update your profile and preferences"
            path="/user-dashboard/profile"
            color="#4caf50"
          />
          <QuickActionCard
            icon={IconTrendingUp}
            title="View Progress"
            description="See your habit and goal progress over time"
            path="/user-dashboard/habbits-management"
            color="#ff5722"
          />
        </SimpleGrid>

        {/* Motivation Section */}
        <Box
          mt="xl"
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

export default Overview;