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
  RingProgress,
  Button,
  Modal,
  SimpleGrid,
  Divider,
  Tooltip,
  Alert,
  Center,
  Card,
  Loader,
} from '@mantine/core';
import {
  IconBrain,
  IconClock,
  IconTrendingUp,
  IconTrendingDown,
  IconTarget,
  IconCheck,
  IconX,
  IconBulb,
  IconAlertTriangle,
  IconTrophy,
  IconCalendar,
  IconChartBar,
} from '@tabler/icons-react';
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import useStrapiHabits from './habits/useLocalStorage';
import useGoalsStorge from './goals/utils/goalStrapi';
import gamificationService from './habits/utils/GamificationService';
import { getAuthToken } from '../../utils/auth';

const Insights = () => {
  const [showDetailedInsights, setShowDetailedInsights] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const AUTH_TOKEN = getAuthToken() || import.meta.env.VITE_STRAPI_AUTH_TOKEN;
  const { list: habits = [], loading: habitsLoading } = useStrapiHabits(AUTH_TOKEN);
  const { goals, loading: goalsLoading } = useGoalsStorge(AUTH_TOKEN);

  const isLoading = habitsLoading || goalsLoading;

  const insights = useMemo(() => {
    if (!habits || habits.length === 0) return null;

    const safeTotalDays = (start, end) => {
      if (!start || !end) return 0;
      const s = dayjs(start);
      const e = dayjs(end);
      if (!s.isValid() || !e.isValid()) return 0;
      const d = e.diff(s, 'day') + 1;
      return d > 0 ? d : 0;
    };

    // Calculate habit health score
    const calculateHabitHealth = () => {
      const totalHabits = habits.length;
      const activeHabits = habits.filter(h => {
        const endDate = dayjs(h.endDate);
        return endDate.isAfter(dayjs()) || endDate.isSame(dayjs(), 'day');
      }).length;
      
      const completionRates = habits.map(habit => {
        const totalDays = safeTotalDays(habit.startDate, habit.endDate);
        const completedDays = habit.completedDates?.length || 0;
        return totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
      });
      
      const validRates = completionRates.filter((r) => Number.isFinite(r));
      const avgCompletionRate = validRates.length ? validRates.reduce((sum, rate) => sum + rate, 0) / validRates.length : 0;
      const consistencyScore = Math.min(100, avgCompletionRate * 1.2);
      
      return Math.round((activeHabits / totalHabits * 40) + (consistencyScore * 0.6));
    };

    // Analyze time patterns
    const analyzeTimePatterns = () => {
      const timeSlots = {
        'Early Morning (5-9 AM)': 0,
        'Morning (9-12 PM)': 0,
        'Afternoon (12-5 PM)': 0,
        'Evening (5-9 PM)': 0,
        'Night (9 PM-5 AM)': 0,
      };
      
      // Only increment slots for habits that match a keyword
      habits.forEach(habit => {
        const title = habit.title.toLowerCase();
        if (title.includes('morning') || title.includes('exercise')) {
          timeSlots['Early Morning (5-9 AM)']++;
        } else if (title.includes('work') || title.includes('study')) {
          timeSlots['Morning (9-12 PM)']++;
        } else if (title.includes('lunch') || title.includes('break')) {
          timeSlots['Afternoon (12-5 PM)']++;
        } else if (title.includes('evening') || title.includes('dinner')) {
          timeSlots['Evening (5-9 PM)']++;
        } // else: do not increment any slot for unmatched habits
      });
      
      // Always increment the current time slot by 1
      const now = new Date();
      const hour = now.getHours();
      let currentSlot = '';
      if (hour >= 5 && hour < 9) currentSlot = 'Early Morning (5-9 AM)';
      else if (hour >= 9 && hour < 12) currentSlot = 'Morning (9-12 PM)';
      else if (hour >= 12 && hour < 17) currentSlot = 'Afternoon (12-5 PM)';
      else if (hour >= 17 && hour < 21) currentSlot = 'Evening (5-9 PM)';
      else currentSlot = 'Night (9 PM-5 AM)';
      timeSlots[currentSlot] += 1;

      return timeSlots;
    };

    // Identify strengths and weaknesses
    const identifyStrengthsWeaknesses = () => {
      const habitAnalysis = habits.map(habit => {
        const totalDays = safeTotalDays(habit.startDate, habit.endDate);
        const completedDays = habit.completedDates?.length || 0;
        const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
        
        // Calculate streak
        let maxStreak = 0;
        let currentStreak = 0;
        const sortedDates = (habit.completedDates || []).sort();
        
        for (let i = 1; i < sortedDates.length; i++) {
          const prevDate = dayjs(sortedDates[i - 1]);
          const currDate = dayjs(sortedDates[i]);
          
          if (currDate.diff(prevDate, 'day') === 1) {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
          } else {
            currentStreak = 0;
          }
        }
        
        return {
          ...habit,
          completionRate,
          maxStreak,
          status: completionRate >= 70 ? 'strength' : completionRate <= 30 ? 'weakness' : 'neutral'
        };
      });
      
      const strengths = habitAnalysis.filter(h => h.status === 'strength');
      const weaknesses = habitAnalysis.filter(h => h.status === 'weakness');
      
      return { strengths, weaknesses, all: habitAnalysis };
    };

    // Generate personalized recommendations
    const generateRecommendations = (strengths, weaknesses) => {
      const recommendations = [];
      
      if (weaknesses.length > 0) {
        recommendations.push({
          type: 'improvement',
          title: 'Focus on Consistency',
          description: `You have ${weaknesses.length} habits with low completion rates. Try breaking them into smaller, more manageable tasks.`,
          priority: 'high',
          action: 'Review and simplify difficult habits'
        });
      }
      
      if (strengths.length > 0) {
        recommendations.push({
          type: 'leverage',
          title: 'Build on Your Strengths',
          description: `You're doing great with ${strengths.length} habits! Use this momentum to tackle more challenging goals.`,
          priority: 'medium',
          action: 'Add new habits in similar categories'
        });
      }
      
      let avgCompletionRate = 0;
      if (habits.length) {
        const rates = habits.map(h => {
          const totalDays = safeTotalDays(h.startDate, h.endDate);
          const completedDays = h.completedDates?.length || 0;
          return totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
        }).filter((r) => Number.isFinite(r));
        avgCompletionRate = rates.length ? rates.reduce((sum, r) => sum + r, 0) / rates.length : 0;
      }
      
      if (avgCompletionRate < 50) {
        recommendations.push({
          type: 'motivation',
          title: 'Start Small',
          description: 'Your overall completion rate is low. Consider reducing the number of habits and focusing on building consistency.',
          priority: 'high',
          action: 'Reduce habit count temporarily'
        });
      }
      
      return recommendations;
    };

    const habitHealth = calculateHabitHealth();
    const timePatterns = analyzeTimePatterns();
    const { strengths, weaknesses, all } = identifyStrengthsWeaknesses();
    const recommendations = generateRecommendations(strengths, weaknesses);

    return {
      habitHealth,
      timePatterns,
      strengths,
      weaknesses,
      all,
      recommendations,
      summary: {
        totalHabits: habits.length,
        activeHabits: habits.filter(h => dayjs(h.endDate).isAfter(dayjs())).length,
        avgCompletionRate: all.length ? Math.round(all.reduce((sum, h) => sum + h.completionRate, 0) / all.length) : 0,
        bestStreak: Math.max(...all.map(h => h.maxStreak)),
      }
    };
  }, [habits, goals]);

  if (isLoading) {
    return (
      <Container size="lg">
        <Center style={{ height: '50vh' }}>
          <Stack align="center" spacing="md">
            <Loader size="lg" color="orange" />
            <Text size="lg" style={{ color: '#ff922b', fontWeight: 600 }}>
              Loading insights...
            </Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  const getHealthColor = (score) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'orange';
    return 'red';
  };

  const getHealthLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  if (!insights) {
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
            Personalized Insights
          </Title>
          <Text size="lg" color="#666" mb="xl">
            Data-driven insights to optimize your habit-building journey
          </Text>
          
          <Center style={{ padding: '4rem 2rem' }}>
            <Stack align="center" spacing="lg">
              <IconBrain size={64} color="#ddd" />
              <Title order={2} style={{ color: '#ff922b', fontWeight: 700 }}>
                No Data Available
              </Title>
              <Text size="lg" color="#666" ta="center" maw={400}>
                Start tracking habits to get personalized insights and recommendations
              </Text>
            </Stack>
          </Center>
        </Paper>
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
        <Title order={1} style={{ color: '#ff922b', fontWeight: 900, marginBottom: '1rem' }}>
          Personalized Insights
        </Title>
        <Text size="lg" color="#666" mb="xl">
          Data-driven insights to optimize your habit-building journey
        </Text>

        <Stack spacing="lg">
          {/* Habit Health Score */}
          <Card shadow="md" padding="lg" radius="lg" withBorder>
            <Group justify="space-between" mb="md">
              <Text fw={700} size="lg" style={{ color: '#ff922b' }}>
                Habit Health Score
              </Text>
              <Badge 
                color={getHealthColor(insights.habitHealth)} 
                variant="light" 
                leftSection={<IconBrain size={14} />}
              >
                {getHealthLabel(insights.habitHealth)}
              </Badge>
            </Group>

            <Group align="flex-start">
              <RingProgress
                size={120}
                thickness={12}
                sections={[{ 
                  value: insights.habitHealth, 
                  color: getHealthColor(insights.habitHealth) 
                }]}
                label={
                  <Text ta="center" size="lg" fw={700} style={{ color: '#ff922b' }}>
                    {insights.habitHealth}
                  </Text>
                }
              />

              <Stack style={{ flex: 1 }}>
                <Text fw={600} size="md">Overall Performance</Text>
                <Text size="xl" fw={800} style={{ color: '#ff922b' }}>
                  {insights.habitHealth}/100
                </Text>
                
                <Stack spacing="xs">
                  <Group justify="space-between">
                    <Text size="sm">Active Habits</Text>
                    <Text size="sm" fw={600}>{insights.summary.activeHabits}/{insights.summary.totalHabits}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Avg Completion</Text>
                    <Text size="sm" fw={600}>{insights.summary.avgCompletionRate}%</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Best Streak</Text>
                    <Text size="sm" fw={600}>{insights.summary.bestStreak} days</Text>
                  </Group>
                </Stack>
              </Stack>
            </Group>
          </Card>

          {/* Strengths & Weaknesses */}
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            {/* Strengths */}
            <Card shadow="md" padding="lg" radius="lg" withBorder>
              <Group justify="space-between" mb="md">
                <Text fw={600} size="md">Your Strengths</Text>
                <IconTrendingUp size={20} color="#4caf50" />
              </Group>
              
              {insights.strengths.length > 0 ? (
                <Stack spacing="sm">
                  {insights.strengths.slice(0, 3).map((habit) => (
                    <Group key={habit.id} justify="space-between">
                      <Text size="sm" fw={500} style={{ flex: 1 }}>
                        {habit.title}
                      </Text>
                      <Badge color="green" variant="light" size="sm">
                        {Math.round(habit.completionRate)}%
                      </Badge>
                    </Group>
                  ))}
                  {insights.strengths.length > 3 && (
                    <Text size="xs" color="#666">
                      +{insights.strengths.length - 3} more
                    </Text>
                  )}
                </Stack>
              ) : (
                <Text size="sm" color="#666">No strong habits yet. Keep building consistency!</Text>
              )}
            </Card>

            {/* Weaknesses */}
            <Card shadow="md" padding="lg" radius="lg" withBorder>
              <Group justify="space-between" mb="md">
                <Text fw={600} size="md">Areas to Improve</Text>
                <IconTrendingDown size={20} color="#f44336" />
              </Group>
              
              {insights.weaknesses.length > 0 ? (
                <Stack spacing="sm">
                  {insights.weaknesses.slice(0, 3).map((habit) => (
                    <Group key={habit.id} justify="space-between">
                      <Text size="sm" fw={500} style={{ flex: 1 }}>
                        {habit.title}
                      </Text>
                      <Badge color="red" variant="light" size="sm">
                        {Math.round(habit.completionRate)}%
                      </Badge>
                    </Group>
                  ))}
                  {insights.weaknesses.length > 3 && (
                    <Text size="xs" color="#666">
                      +{insights.weaknesses.length - 3} more
                    </Text>
                  )}
                </Stack>
              ) : (
                <Text size="sm" color="#666">Great job! No weak areas identified.</Text>
              )}
            </Card>
          </SimpleGrid>

          {/* Time Analysis */}
          <Card shadow="md" padding="lg" radius="lg" withBorder>
            <Text fw={600} size="md" mb="md">Time of Day Analysis</Text>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={Object.entries(insights.timePatterns).map(([time, count]) => ({
                time,
                habits: count
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="habits" fill="#ff922b" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Recommendations */}
          <Card shadow="md" padding="lg" radius="lg" withBorder>
            <Group justify="space-between" mb="md">
              <Text fw={700} size="lg" style={{ color: '#ff922b' }}>
                Personalized Recommendations
              </Text>
              <Button
                variant="light"
                size="sm"
                color="orange"
                onClick={() => setShowDetailedInsights(true)}
              >
                View Details
              </Button>
            </Group>
            
            <Stack spacing="md">
              {insights.recommendations.slice(0, 2).map((rec, index) => (
                <Alert
                  key={index}
                  variant="light"
                  color={rec.priority === 'high' ? 'red' : 'orange'}
                  title={rec.title}
                  icon={rec.type === 'improvement' ? <IconAlertTriangle /> : <IconBulb />}
                >
                  <Text size="sm">{rec.description}</Text>
                  <Text size="xs" fw={600} mt="xs" style={{ color: '#ff922b' }}>
                    Action: {rec.action}
                  </Text>
                </Alert>
              ))}
            </Stack>
          </Card>
        </Stack>

        {/* Detailed Insights Modal */}
        <Modal
          opened={showDetailedInsights}
          onClose={() => setShowDetailedInsights(false)}
          title="Detailed Insights & Recommendations"
          size="lg"
        >
          <Stack spacing="lg">
            {/* All Habits Analysis */}
            <Box>
              <Text fw={600} size="md" mb="md">All Habits Performance</Text>
              <Stack spacing="sm">
                {insights.all.map((habit) => (
                  <Card
                    key={habit.id}
                    shadow="sm"
                    padding="md"
                    radius="md"
                    withBorder
                    style={{
                      borderLeft: `4px solid ${
                        habit.status === 'strength' ? '#4caf50' : 
                        habit.status === 'weakness' ? '#f44336' : '#ff922b'
                      }`
                    }}
                  >
                    <Group justify="space-between">
                      <Box style={{ flex: 1 }}>
                        <Text fw={600} size="sm">{habit.title}</Text>
                        <Text size="xs" color="#666">{habit.description}</Text>
                      </Box>
                      <Stack align="flex-end" spacing="xs">
                        <Badge
                          color={
                            habit.status === 'strength' ? 'green' : 
                            habit.status === 'weakness' ? 'red' : 'orange'
                          }
                          variant="light"
                          size="sm"
                        >
                          {Math.round(habit.completionRate)}%
                        </Badge>
                        <Text size="xs" color="#666">
                          Best: {habit.maxStreak} days
                        </Text>
                      </Stack>
                    </Group>
                  </Card>
                ))}
              </Stack>
            </Box>

            <Divider />

            {/* All Recommendations */}
            <Box>
              <Text fw={600} size="md" mb="md">All Recommendations</Text>
              <Stack spacing="md">
                {insights.recommendations.map((rec, index) => (
                  <Alert
                    key={index}
                    variant="light"
                    color={rec.priority === 'high' ? 'red' : 'orange'}
                    title={rec.title}
                    icon={rec.type === 'improvement' ? <IconAlertTriangle /> : <IconBulb />}
                  >
                    <Text size="sm">{rec.description}</Text>
                    <Text size="xs" fw={600} mt="xs" style={{ color: '#ff922b' }}>
                      Action: {rec.action}
                    </Text>
                  </Alert>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Modal>
      </Paper>
    </Container>
  );
};

export default Insights; 