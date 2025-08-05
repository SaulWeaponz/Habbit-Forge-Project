import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Text,
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
} from '@tabler/icons-react';
import { LineChart } from '@mantine/charts';
import dayjs from 'dayjs';

const GoalVisualization = ({ goals, habits }) => {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const today = dayjs();

  const calculateGoalProgress = (goal) => {
    if (!goal.subgoals || goal.subgoals.length === 0) {
      return goal.completed ? 100 : 0;
    }
    
    const completedSubgoals = goal.subgoals.filter(sub => sub.completed).length;
    return Math.round((completedSubgoals / goal.subgoals.length) * 100);
  };

  const getGoalStatus = (goal) => {
    const progress = calculateGoalProgress(goal);
    const targetDate = dayjs(goal.targetDate);
    const daysRemaining = targetDate.diff(today, 'day');
    
    if (goal.completed) return { status: 'completed', color: 'green', icon: IconCheck };
    if (progress >= 100) return { status: 'ready', color: 'blue', icon: IconTarget };
    if (daysRemaining < 0) return { status: 'overdue', color: 'red', icon: IconClock };
    if (daysRemaining <= 7) return { status: 'urgent', color: 'orange', icon: IconFlag };
    if (progress >= 75) return { status: 'on-track', color: 'teal', icon: IconTrendingUp };
    return { status: 'in-progress', color: 'gray', icon: IconTarget };
  };

  const generateBurnDownData = (goal) => {
    if (!goal.targetDate) return [];
    
    const startDate = dayjs(goal.startDate || goal.createdAt || today.subtract(30, 'day'));
    const endDate = dayjs(goal.targetDate);
    const totalDays = endDate.diff(startDate, 'day');
    const totalSubgoals = goal.subgoals?.length || 1;
    
    const data = [];
    let currentDate = startDate;
    let remainingSubgoals = totalSubgoals;
    
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
      const daysElapsed = currentDate.diff(startDate, 'day');
      const idealRemaining = Math.max(0, totalSubgoals - (daysElapsed * totalSubgoals / totalDays));
      
      // Calculate actual remaining based on completion dates
      if (goal.subgoals) {
        const completedByDate = goal.subgoals.filter(sub => {
          if (!sub.completedDate) return false;
          return dayjs(sub.completedDate).isBefore(currentDate) || dayjs(sub.completedDate).isSame(currentDate, 'day');
        }).length;
        remainingSubgoals = Math.max(0, totalSubgoals - completedByDate);
      }
      
      data.push({
        date: currentDate.format('MMM D'),
        ideal: Math.round(idealRemaining),
        actual: remainingSubgoals,
      });
      
      currentDate = currentDate.add(1, 'day');
    }
    
    return data;
  };

  const generateGoalSuggestions = () => {
    const newSuggestions = [];
    
    // Analyze habit patterns
    const habitCategories = {};
    habits.forEach(habit => {
      const category = habit.category || 'General';
      if (!habitCategories[category]) {
        habitCategories[category] = 0;
      }
      habitCategories[category]++;
    });
    
    // Suggest goals based on habit categories
    Object.entries(habitCategories).forEach(([category, count]) => {
      if (count >= 3) {
        newSuggestions.push({
          type: 'category_goal',
          title: `Master ${category}`,
          description: `You have ${count} ${category.toLowerCase()} habits. Consider setting a goal to improve in this area.`,
          priority: 'medium',
          estimatedTime: '30 days',
        });
      }
    });
    
    // Suggest goals based on completion patterns
    const lowCompletionHabits = habits.filter(habit => {
      const progress = (habit.completedDates?.length || 0) / Math.max(1, dayjs(habit.endDate).diff(dayjs(habit.startDate), 'day'));
      return progress < 0.3;
    });
    
    if (lowCompletionHabits.length > 0) {
      newSuggestions.push({
        type: 'improvement_goal',
        title: 'Improve Consistency',
        description: `You have ${lowCompletionHabits.length} habits with low completion rates. Focus on building consistency.`,
        priority: 'high',
        estimatedTime: '21 days',
      });
    }
    
    // Suggest goals based on streaks
    const maxStreak = Math.max(...habits.map(habit => {
      let streak = 0;
      let maxStreak = 0;
      const sortedDates = (habit.completedDates || []).sort();
      
      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = dayjs(sortedDates[i - 1]);
        const currDate = dayjs(sortedDates[i]);
        
        if (currDate.diff(prevDate, 'day') === 1) {
          streak++;
          maxStreak = Math.max(maxStreak, streak);
        } else {
          streak = 0;
        }
      }
      
      return maxStreak;
    }));
    
    if (maxStreak >= 7) {
      newSuggestions.push({
        type: 'streak_goal',
        title: 'Extend Your Streak',
        description: `Your best streak is ${maxStreak} days. Try to beat it!`,
        priority: 'medium',
        estimatedTime: '14 days',
      });
    }
    
    return newSuggestions;
  };

  useEffect(() => {
    const newSuggestions = generateGoalSuggestions();
    setSuggestions(newSuggestions);
  }, [goals, habits]);

  const GoalFunnelCard = ({ goal }) => {
    const progress = calculateGoalProgress(goal);
    const { status, color, icon: StatusIcon } = getGoalStatus(goal);
    const targetDate = dayjs(goal.targetDate);
    const daysRemaining = targetDate.diff(today, 'day');
    
    return (
      <Card
        shadow="md"
        padding="lg"
        radius="lg"
        withBorder
        style={{
          background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
          border: `2px solid ${status === 'completed' ? '#4caf50' : '#ffd180'}`,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onClick={() => setSelectedGoal(goal)}
      >
        <Group justify="space-between" mb="md">
          <Text fw={700} size="lg" style={{ color: '#222' }}>
            {goal.title}
          </Text>
          <Badge color={color} variant="light" leftSection={<StatusIcon size={14} />}>
            {status.replace('-', ' ')}
          </Badge>
        </Group>
        
        <Text size="sm" color="#666" mb="md">
          {goal.description}
        </Text>
        
        <Stack spacing="sm">
          <Group justify="space-between">
            <Text size="sm" fw={600}>Progress</Text>
            <Text size="sm" fw={600} style={{ color: '#ff922b' }}>
              {progress}%
            </Text>
          </Group>
          
          <Progress
            value={progress}
            color={color}
            size="md"
            radius="xl"
          />
          
          <Group justify="space-between">
            <Text size="xs" color="#666">
              {goal.subgoals?.filter(s => s.completed).length || 0} of {goal.subgoals?.length || 1} subgoals
            </Text>
            {daysRemaining >= 0 && (
              <Text size="xs" color={daysRemaining <= 7 ? '#f44336' : '#666'}>
                {daysRemaining} days left
              </Text>
            )}
          </Group>
        </Stack>
      </Card>
    );
  };

  return (
    <>
      <Stack spacing="lg">
        {/* Goal Funnel Overview */}
        <Card shadow="md" padding="lg" radius="lg" withBorder>
          <Group justify="space-between" mb="md">
            <Text fw={700} size="lg" style={{ color: '#ff922b' }}>
              Goal Funnel
            </Text>
            <Badge color="orange" variant="light" leftSection={<IconTarget size={14} />}>
              {goals.length} Goals
            </Badge>
          </Group>
          
          <Stack spacing="md">
            {goals.map((goal) => (
              <GoalFunnelCard key={goal.id} goal={goal} />
            ))}
            
            {goals.length === 0 && (
              <Box
                style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#666',
                }}
              >
                <IconTarget size={48} color="#ddd" style={{ marginBottom: '1rem' }} />
                <Text size="lg" fw={600}>No goals set yet</Text>
                <Text size="sm">Start by creating your first goal to track progress</Text>
              </Box>
            )}
          </Stack>
        </Card>

        {/* Goal Suggestions */}
        {suggestions.length > 0 && (
          <Card shadow="md" padding="lg" radius="lg" withBorder>
            <Group justify="space-between" mb="md">
              <Text fw={700} size="lg" style={{ color: '#ff922b' }}>
                Smart Suggestions
              </Text>
              <Button
                variant="light"
                size="sm"
                color="orange"
                leftSection={<IconBulb size={14} />}
                onClick={() => setShowSuggestionModal(true)}
              >
                View All
              </Button>
            </Group>
            
            <Stack spacing="sm">
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <Card
                  key={index}
                  shadow="sm"
                  padding="md"
                  radius="md"
                  withBorder
                  style={{
                    background: '#f8f9fa',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <Group justify="space-between">
                    <Box style={{ flex: 1 }}>
                      <Text fw={600} size="sm">
                        {suggestion.title}
                      </Text>
                      <Text size="xs" color="#666">
                        {suggestion.description}
                      </Text>
                    </Box>
                    <Badge
                      color={suggestion.priority === 'high' ? 'red' : 'orange'}
                      variant="light"
                      size="sm"
                    >
                      {suggestion.priority}
                    </Badge>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Card>
        )}
      </Stack>

      {/* Goal Details Modal */}
      <Modal
        opened={!!selectedGoal}
        onClose={() => setSelectedGoal(null)}
        title={selectedGoal?.title}
        size="lg"
      >
        {selectedGoal && (
          <Stack>
            <Text size="sm" color="#666">
              {selectedGoal.description}
            </Text>
            
            <Divider />
            
            {/* Burn-down Chart */}
            <Box>
              <Text fw={600} size="md" mb="md">Progress Timeline</Text>
              <LineChart
                h={300}
                data={generateBurnDownData(selectedGoal)}
                dataKey="date"
                series={[
                  { name: 'Ideal Progress', color: '#ff922b' },
                  { name: 'Actual Progress', color: '#4caf50' }
                ]}
                curveType="monotone"
              />
            </Box>
            
            {/* Subgoals */}
            {selectedGoal.subgoals && selectedGoal.subgoals.length > 0 && (
              <Box>
                <Text fw={600} size="md" mb="md">Subgoals</Text>
                <Stack spacing="sm">
                  {selectedGoal.subgoals.map((subgoal, index) => (
                    <Group key={index} justify="space-between">
                      <Text size="sm" style={{ textDecoration: subgoal.completed ? 'line-through' : 'none' }}>
                        {subgoal.title}
                      </Text>
                      <Badge
                        color={subgoal.completed ? 'green' : 'gray'}
                        variant="light"
                        size="sm"
                      >
                        {subgoal.completed ? 'Completed' : 'Pending'}
                      </Badge>
                    </Group>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        )}
      </Modal>

      {/* Suggestions Modal */}
      <Modal
        opened={showSuggestionModal}
        onClose={() => setShowSuggestionModal(false)}
        title="Smart Goal Suggestions"
        size="lg"
      >
        <Stack>
          <Text size="sm" color="#666" mb="md">
            Based on your habits and progress, here are some goal suggestions to help you grow:
          </Text>
          
          {suggestions.map((suggestion, index) => (
            <Card
              key={index}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
            >
              <Group justify="space-between" mb="sm">
                <Text fw={600} size="md">
                  {suggestion.title}
                </Text>
                <Badge
                  color={suggestion.priority === 'high' ? 'red' : 'orange'}
                  variant="light"
                >
                  {suggestion.priority} priority
                </Badge>
              </Group>
              
              <Text size="sm" color="#666" mb="md">
                {suggestion.description}
              </Text>
              
              <Group justify="space-between">
                <Text size="xs" color="#666">
                  Estimated time: {suggestion.estimatedTime}
                </Text>
                <Button size="xs" variant="light" color="orange">
                  Create Goal
                </Button>
              </Group>
            </Card>
          ))}
        </Stack>
      </Modal>
    </>
  );
};

export default GoalVisualization; 