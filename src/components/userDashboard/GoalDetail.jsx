import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Title, Text, Paper, Stack, Divider, Badge, Progress, Group, Box, Loader, Button } from '@mantine/core';
import useGoalsStorge from './goals/utils/goalStrapi';
import useStrapiHabits from './habits/useLocalStorage';
import dayjs from 'dayjs';

const GoalDetail = () => {
  const { goalId } = useParams();
  const STRAPI_AUTH_TOKEN = import.meta.env.VITE_STRAPI_AUTH_TOKEN;
  const { goals, loading: goalsLoading } = useGoalsStorge(STRAPI_AUTH_TOKEN);
  const { list: habits = [], loading: habitsLoading } = useStrapiHabits(STRAPI_AUTH_TOKEN);

  if (goalsLoading || habitsLoading) {
    return <Loader size="lg" color="orange" />;
  }

  const goal = (goals.data || []).find(g => String(g.id) === String(goalId));
  if (!goal) {
    return <Text color="red">Goal not found.</Text>;
  }

  // Helper to get associated habit objects from Strapi's nested relation format
  const getAssociatedHabitObjects = (goal) => {
    if (!goal.associatedHabits) return [];
    if (Array.isArray(goal.associatedHabits)) {
      return goal.associatedHabits;
    }
    if (goal.associatedHabits.data && Array.isArray(goal.associatedHabits.data)) {
      return goal.associatedHabits.data;
    }
    return [];
  };

  // Helper: Calculate progress for a habit (by id or object)
  const calculateHabitProgress = (habit) => {
    if (!habit) return 0;
    if (!habit.completedDates || !habit.startDate || !habit.endDate) return 0;
    const totalDays = dayjs(habit.endDate).diff(dayjs(habit.startDate), 'day') + 1;
    return Math.round((habit.completedDates.length / totalDays) * 100);
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
    if (associated.length === 0) {
      suggestions.push({ type: 'info', text: 'No associated habits. Consider linking habits to this goal for better tracking.' });
    }
    associated.forEach(habit => {
      const progress = calculateHabitProgress(habit);
      const title = habit.attributes ? habit.attributes.title : habit.title;
      if (progress < 30) {
        suggestions.push({ type: 'improvement', text: `Habit "${title}" is below 30% completion. Try to focus on it for better goal progress.` });
      }
    });
    if (associated.length > 0 && associated.every(habit => calculateHabitProgress(habit) > 80)) {
      suggestions.push({ type: 'success', text: 'All associated habits are above 80% completion. Great job!' });
    }
    return suggestions;
  };

  const progress = calculateGoalProgressFromHabits(goal);
  const associatedHabits = getAssociatedHabitObjects(goal);
  const suggestions = generateGoalSuggestions(goal);

  return (
    <Container size="sm">
      <Paper shadow="xl" radius="lg" p="xl" style={{ background: 'rgba(255,255,255,0.95)', border: '1.5px solid #ffe0b2' }}>
        <Title order={2} style={{ color: '#ff922b', fontWeight: 900, marginBottom: '1rem' }}>{goal.title}</Title>
        <Text size="md" color="#666" mb="md">{goal.description}</Text>
        <Divider mb="md" />
        <Group justify="space-between" mb="md">
          <Text fw={700} size="lg">Progress</Text>
          <Badge color="orange" variant="light">{progress}%</Badge>
        </Group>
        <Progress value={progress} color="orange" size="md" radius="xl" mb="md" />
        <Text fw={600} size="md" mb="xs">Associated Habits</Text>
        <Stack spacing="xs" mb="md">
          {associatedHabits.length === 0 && <Text size="xs" color="#888">No associated habits.</Text>}
          {associatedHabits.map((habitObj, idx) => {
            const hProgress = calculateHabitProgress(habitObj);
            return (
              <Box key={idx}>
                <Group justify="space-between">
                  <Text size="sm">{habitObj.title}</Text>
                  <Badge color={hProgress > 80 ? 'green' : hProgress > 30 ? 'orange' : 'red'}>{hProgress}%</Badge>
                </Group>
                <Progress value={hProgress} color={hProgress > 80 ? 'green' : hProgress > 30 ? 'orange' : 'red'} size="sm" radius="xl" mb="xs" />
              </Box>
            );
          })}
        </Stack>
        <Divider mb="md" />
        <Text fw={600} size="md" mb="xs">Smart Suggestions</Text>
        <Stack spacing="xs">
          {suggestions.length === 0 && <Text size="xs" color="#888">No suggestions for this goal.</Text>}
          {suggestions.map((s, idx) => (
            <Text key={idx} size="xs" color={s.type === 'success' ? 'green' : s.type === 'improvement' ? 'red' : 'orange'}>
              {s.text}
            </Text>
          ))}
        </Stack>
      </Paper>
    </Container>
  );
};

export default GoalDetail; 