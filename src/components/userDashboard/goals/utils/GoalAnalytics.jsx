import React from 'react';
import {
  Grid,
  Paper,
  Text,
  RingProgress,
  Group,
  Stack,
  Progress,
  Card,
} from '@mantine/core';
import {
  IconTrophy,
  IconTarget,
  IconCalendarTime,
  IconListCheck,
} from '@tabler/icons-react';
import dayjs from 'dayjs';

const GoalAnalytics = ({ goals }) => {
  const calculateOverallProgress = () => {
    if (!goals.length) return 0;
    const totalProgress = goals.reduce((acc, goal) => {
      if (!goal.subgoals || !goal.subgoals.length) {
        return acc + (goal.completed ? 100 : 0);
      }
      const completedSubgoals = goal.subgoals.filter(sub => sub.completed).length;
      return acc + (completedSubgoals / goal.subgoals.length) * 100;
    }, 0);
    return Math.round(totalProgress / goals.length);
  };

  const calculateCompletionRate = () => {
    if (!goals.length) return 0;
    const completedGoals = goals.filter(goal => goal.completed).length;
    return Math.round((completedGoals / goals.length) * 100);
  };

  const calculateTimeProgress = () => {
    const now = dayjs();
    const timeProgress = goals.map(goal => {
      const start = dayjs(goal.startDate);
      const end = dayjs(goal.endDate);
      const total = end.diff(start, 'day');
      const elapsed = now.diff(start, 'day');
      return Math.min(100, Math.max(0, (elapsed / total) * 100));
    });
    return Math.round(timeProgress.reduce((a, b) => a + b, 0) / goals.length);
  };

  const calculateSubtaskCompletion = () => {
    const allSubtasks = goals.flatMap(goal => goal.subgoals || []);
    if (!allSubtasks.length) return 0;
    const completed = allSubtasks.filter(task => task.completed).length;
    return Math.round((completed / allSubtasks.length) * 100);
  };

  const stats = [
    {
      title: 'Overall Progress',
      value: calculateOverallProgress(),
      color: 'blue',
      icon: IconTarget,
    },
    {
      title: 'Completion Rate',
      value: calculateCompletionRate(),
      color: 'green',
      icon: IconTrophy,
    },
    {
      title: 'Time Progress',
      value: calculateTimeProgress(),
      color: 'orange',
      icon: IconCalendarTime,
    },
    {
      title: 'Subtask Completion',
      value: calculateSubtaskCompletion(),
      color: 'grape',
      icon: IconListCheck,
    },
  ];

  return (
    <Stack spacing="xl">
      <Grid>
        {stats.map((stat) => (
          <Grid.Col key={stat.title} span={6}>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Group position="apart" align="flex-start">
                <Stack spacing="xs">
                  <Text size="lg" weight={500}>
                    {stat.title}
                  </Text>
                  <Text size="sm" color="dimmed">
                    {stat.value}% Complete
                  </Text>
                </Stack>
                <stat.icon size={24} color={`var(--mantine-color-${stat.color}-6)`} />
              </Group>
              <Progress
                value={stat.value}
                color={stat.color}
                size="lg"
                radius="xl"
                mt="md"
              />
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Text size="lg" weight={500} mb="md">
          Goal Progress Overview
        </Text>
        <Grid>
          {goals.map((goal) => {
            const progress = goal.subgoals?.length
              ? (goal.subgoals.filter(s => s.completed).length / goal.subgoals.length) * 100
              : goal.completed ? 100 : 0;
            
            return (
              <Grid.Col key={goal.id} span={4}>
                <Paper p="md" radius="md" withBorder>
                  <Stack align="center" spacing="xs">
                    <RingProgress
                      size={80}
                      thickness={8}
                      sections={[{ value: progress, color: goal.completed ? 'green' : 'orange' }]}
                      label={
                        <Text ta="center" fz="sm" fw={700}>
                          {Math.round(progress)}%
                        </Text>
                      }
                    />
                    <Text size="sm" weight={500} align="center">
                      {goal.title}
                    </Text>
                  </Stack>
                </Paper>
              </Grid.Col>
            );
          })}
        </Grid>
      </Card>
    </Stack>
  );
};

export default GoalAnalytics;