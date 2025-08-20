import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Group,
  Badge,
  Progress,
  Stack,
  Box,
  Button,
  Modal,
  Textarea,
  Select,
  Divider,
  RingProgress,
  Tooltip,
  Center,
  Card,
  Loader,
  List,
} from '@mantine/core';
import {
  IconTarget,
  IconCheck,
  IconClock,
  IconTrendingUp,
  IconTrendingDown,
  IconBulb,
  IconCalendar,
  IconFlag,
  IconBolt,
} from '@tabler/icons-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import useGoalsStorge from './goals/utils/goalStrapi';
import useStrapiHabits from './habits/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../../utils/auth';

const GoalTracking = () => {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const navigate = useNavigate();
  const AUTH_TOKEN = getAuthToken() || import.meta.env.VITE_STRAPI_AUTH_TOKEN;
  const { goals, loading: goalsLoading } = useGoalsStorge(AUTH_TOKEN);
  const { list: habits = [], loading: habitsLoading } = useStrapiHabits(AUTH_TOKEN);

  const today = dayjs();

  // DEBUG: Log the structure of all goals and their associatedHabits
  useEffect(() => {
    if (goals.data && goals.data.length > 0) {
      goals.data.forEach((goal, idx) => {
      });
    }
    if (habits && habits.length > 0) {
    }
  }, [goals, habits]);

  // Helper to get associated habit objects from Strapi's nested relation format
  const getAssociatedHabitObjects = (goal) => {
    // Support both raw Strapi relation shapes and arrays
    const assoc = goal?.associatedHabits ?? goal?.attributes?.associatedHabits;
    if (!assoc) return [];
    if (Array.isArray(assoc)) {
      return assoc.map((h) => (h?.attributes ? { id: h.id, ...h.attributes } : h));
    }
    if (assoc?.data && Array.isArray(assoc.data)) {
      return assoc.data.map((h) => (h?.attributes ? { id: h.id, ...h.attributes } : h));
    }
    return [];
  };

  // Helper: Calculate progress for a habit (by id or object)
  const calculateHabitProgress = (habit) => {
    if (!habit) return 0;
    const h = habit.attributes ? { ...habit.attributes, id: habit.id } : habit;
    if (!h.completedDates || !h.startDate || !h.endDate) return 0;
    const totalDays = dayjs(h.endDate).diff(dayjs(h.startDate), 'day') + 1;
    if (totalDays <= 0) return 0;
    return Math.round(((h.completedDates?.length || 0) / totalDays) * 100);
  };

  // Helper: Calculate goal progress based on associated habits
  const calculateGoalProgressFromHabits = (goal) => {
    const associated = getAssociatedHabitObjects(goal);
    if (associated.length === 0) return 0;
    const total = associated.reduce((sum, habit) => sum + calculateHabitProgress(habit), 0);
    return Math.round(total / associated.length);
  };

  // Helper: Generate smart suggestions for a goal
  const generateGoalSuggestions = (goal) => {
    const suggestions = [];
    const associated = getAssociatedHabitObjects(goal);
    if (associated.length === 0) return suggestions;
    // Suggestion: If any habit is below 30% progress
    associated.forEach(habit => {
      const progress = calculateHabitProgress(habit);
      const title = habit.attributes ? habit.attributes.title : habit.title;
      if (progress < 30) {
        suggestions.push({
          type: 'improvement',
          text: `Habit "${title}" is below 30% completion. Try to focus on it for better goal progress.`
        });
      }
    });
    // Suggestion: If all habits are above 80%
    if (associated.length > 0 && associated.every(habit => calculateHabitProgress(habit) > 80)) {
      suggestions.push({
        type: 'success',
        text: 'All associated habits are above 80% completion. Great job!'
      });
    }
    // Suggestion: If no habits are associated
    if (associated.length === 0) {
      suggestions.push({
        type: 'info',
        text: 'No associated habits. Consider linking habits to this goal for better tracking.'
      });
    }
    return suggestions;
  };

  if (goalsLoading || habitsLoading) {
    return (
      <Container size="lg">
        <Center style={{ height: '50vh' }}>
          <Stack align="center" spacing="md">
            <Loader size="lg" color="orange" />
            <Text size="lg" style={{ color: '#ff922b', fontWeight: 600 }}>
              Loading your goals...
            </Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  // UI for goal list and details
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
        <Title order={1} style={{ color: '#ff922b', fontWeight: 900, marginBottom: '1rem' }}>
          Track Your Goals
        </Title>
        <Text size="lg" color="#666" mb="xl">
          Click on a goal to view its progress and smart suggestions based on associated habits.
        </Text>
        {(goals.data || []).length === 0 && (
          <Box style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <IconTarget size={48} color="#ddd" style={{ marginBottom: '1rem' }} />
            <Text size="lg" fw={600}>No goals set yet</Text>
            <Text size="sm">Start by creating your first goal to track progress</Text>
          </Box>
        )}
        <List spacing="md" size="lg" center>
          {(goals.data || []).map(goal => {
            const progress = calculateGoalProgressFromHabits(goal);
            return (
              <List.Item
                key={goal.id}
                style={{
                  cursor: 'pointer',
                  padding: '1rem',
                  borderBottom: '1px solid #ffe0b2',
                  background: 'transparent',
                  transition: 'background 0.2s',
                }}
                onClick={() => navigate(`/user-dashboard/goal-tracking/${goal.id}`)}
              >
                <Group justify="space-between">
                  <Box>
                    <Text fw={700} size="lg" style={{ color: '#222' }}>{goal.title || goal.attributes?.title}</Text>
                    <Text size="sm" color="#666">{goal.description || goal.attributes?.description}</Text>
                  </Box>
                  <Badge color="orange" variant="light">{progress}%</Badge>
                </Group>
              </List.Item>
            );
          })}
        </List>
        {/* Goal Details Modal */}
        {/* Modal removed: navigation now used for details */}
      </Paper>
    </Container>
  );
};

export default GoalTracking; 