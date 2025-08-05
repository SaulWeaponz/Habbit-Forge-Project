import React, { useState } from 'react';
import {
  Card,
  Group,
  Text,
  Progress,
  Badge,
  Stack,
  Box,
  RingProgress,
  ActionIcon,
  Tooltip,
  Button,
  Checkbox,
} from '@mantine/core';
import {
  IconCheck,
  IconTarget,
  IconTrophy,
  IconFlame,
  IconListCheck,
  IconNotes,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';

const InteractiveGoalTracker = ({ 
  goal, 
  onMarkGoalAsCompleted, 
  onToggleSubgoal,
  onAddSubgoal,
  onAddNote,
  onDeleteNotes,
  onDeleteSubgoals,
  onremoveGoal 
}) => {
  const calculateProgress = () => {
    let totalProgress = 0;
    let components = 0;

    // Calculate progress from subgoals
    if (goal.subgoals && goal.subgoals.length > 0) {
      const subgoalProgress = goal.subgoals.filter(sub => sub.completed).length / goal.subgoals.length;
      totalProgress += subgoalProgress;
      components++;
    }

    // Calculate progress from associated habits
    if (goal.associatedHabits && goal.associatedHabits.length > 0) {
      const habitProgress = Object.values(goal.habitProgress || {}).reduce((acc, curr) => acc + curr, 0) / goal.associatedHabits.length;
      totalProgress += habitProgress;
      components++;
    }

    // If no components to track, return based on completion status
    if (components === 0) {
      return goal.completed ? 100 : 0;
    }

    return Math.round((totalProgress / components) * 100);
  };

  const progress = calculateProgress();
  const startDate = dayjs(goal.startDate);
  const endDate = dayjs(goal.endDate);
  const today = dayjs();
  const totalDays = endDate.diff(startDate, 'day');
  const daysLeft = endDate.diff(today, 'day');
  const timeProgress = Math.min(100, Math.round(((totalDays - daysLeft) / totalDays) * 100));

  const getGoalStatus = () => {
    if (goal.completed) return { status: 'Completed', color: 'green', icon: IconCheck };
    if (progress >= 80) return { status: 'Almost There!', color: 'blue', icon: IconTrophy };
    if (progress >= 50) return { status: 'Good Progress', color: 'orange', icon: IconTarget };
    if (progress > 0) return { status: 'In Progress', color: 'yellow', icon: IconFlame };
    return { status: 'Not Started', color: 'gray', icon: IconTarget };
  };

  const { status, color, icon: StatusIcon } = getGoalStatus();

  const renderHabitProgress = () => {
    if (!goal.associatedHabits || goal.associatedHabits.length === 0) {
      return null;
    }

    return (
      <Box mt="md">
        <Text size="sm" weight={500} mb="xs">Associated Habits Progress</Text>
        <Stack spacing="xs">
          {goal.associatedHabits.map(habitId => {
            const progress = (goal.habitProgress?.[habitId] || 0) * 100;
            return (
              <Box key={habitId}>
                <Group position="apart" mb={5}>
                  <Text size="sm">{habitId}</Text>
                  <Text size="xs" color="dimmed">{Math.round(progress)}%</Text>
                </Group>
                <Progress 
                  value={progress} 
                  size="sm" 
                  radius="xl" 
                  color={progress >= 80 ? 'green' : progress >= 50 ? 'yellow' : 'red'} 
                />
              </Box>
            );
          })}
        </Stack>
      </Box>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{
          background: goal.completed 
            ? 'linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%)'
            : 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
          border: `2px solid ${goal.completed ? '#4caf50' : '#ffd180'}`,
          transition: 'all 0.3s ease',
        }}
      >
        <Group position="apart" mb="md">
          <Stack spacing="xs">
            <Group>
              <Text size="xl" weight={700} color={goal.completed ? '#2e7d32' : '#d84315'}>
                {goal.title}
              </Text>
              <Badge color={color} variant="light" size="lg" leftSection={<StatusIcon size={14} />}>
                {status}
              </Badge>
            </Group>
            <Text size="sm" color="dimmed">
              {goal.description}
            </Text>
          </Stack>
          
          <Tooltip label={goal.completed ? "Mark as incomplete" : "Mark as complete"}>
            <ActionIcon
              variant="filled"
              color={goal.completed ? 'green' : 'orange'}
              size="xl"
              onClick={() => onMarkGoalAsCompleted(!goal.completed)}
            >
              {goal.completed ? <IconCheck size={20} /> : <IconTarget size={20} />}
            </ActionIcon>
          </Tooltip>
        </Group>

        <Group spacing="xl" mb="md">
          <RingProgress
            size={80}
            thickness={8}
            sections={[{ value: progress, color: goal.completed ? '#4caf50' : '#ff922b' }]}
            label={
              <Text ta="center" size="xs" weight={700}>
                {progress}%
              </Text>
            }
          />
          
          <Box style={{ flex: 1 }}>
            <Group position="apart" mb={5}>
              <Text size="sm" weight={500}>Overall Progress</Text>
              <Text size="sm" color="dimmed">
                {goal.subgoals?.filter(s => s.completed).length || 0} of {goal.subgoals?.length || 0} tasks
              </Text>
            </Group>
            <Progress
              value={progress}
              color={goal.completed ? 'green' : 'orange'}
              size="md"
              radius="xl"
            />
            <Group position="apart" mt={5}>
              <Text size="xs" color="dimmed">Time Progress</Text>
              <Text size="xs" color="dimmed">{daysLeft} days left</Text>
            </Group>
            <Progress
              value={timeProgress}
              color={timeProgress > 80 ? 'red' : 'blue'}
              size="xs"
              radius="xl"
              mt={2}
            />
          </Box>
        </Group>

        <Group position="apart" mt="xl">
          <Group spacing="xs">
            <Button
              variant="light"
              size="sm"
              leftSection={<IconListCheck size={16} />}
              onClick={() => onAddSubgoal()}
            >
              Add Subtask
            </Button>
            <Button
              variant="light"
              size="sm"
              leftSection={<IconNotes size={16} />}
              onClick={() => onAddNote()}
            >
              Add Note
            </Button>
          </Group>
          <ActionIcon
            color="red"
            variant="subtle"
            onClick={() => onremoveGoal()}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>

        {goal.subgoals && goal.subgoals.length > 0 && (
          <Stack mt="md" spacing="xs">
            <Text size="sm" weight={500}>Subtasks</Text>
            {goal.subgoals.map((subgoal) => (
              <Group key={subgoal.id} position="apart">
                <Group spacing="xs">
                  <Checkbox
                    checked={subgoal.completed}
                    onChange={() => onToggleSubgoal(subgoal.id)}
                    label={subgoal.title}
                  />
                </Group>
                <ActionIcon
                  color="red"
                  variant="subtle"
                  size="sm"
                  onClick={() => onDeleteSubgoals(subgoal.id)}
                >
                  <IconX size={14} />
                </ActionIcon>
              </Group>
            ))}
          </Stack>
        )}

        {goal.notes && goal.notes.length > 0 && (
          <Stack mt="md" spacing="xs">
            <Text size="sm" weight={500}>Notes</Text>
            {goal.notes.map((note) => (
              <Group key={note.id} position="apart">
                <Text size="sm">{note.content}</Text>
                <ActionIcon
                  color="red"
                  variant="subtle"
                  size="sm"
                  onClick={() => onDeleteNotes(note.id)}
                >
                  <IconX size={14} />
                </ActionIcon>
              </Group>
            ))}
          </Stack>
        )}

        {renderHabitProgress()}
      </Card>
    </motion.div>
  );
};

export default InteractiveGoalTracker;