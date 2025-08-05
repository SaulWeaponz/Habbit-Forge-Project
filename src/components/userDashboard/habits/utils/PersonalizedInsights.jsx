import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Text,
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
import { LineChart, BarChart } from '@mantine/charts';
import dayjs from 'dayjs';

const PersonalizedInsights = ({ habits, goals }) => {
  const [showDetailedInsights, setShowDetailedInsights] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState(null);

  const insights = useMemo(() => {
    if (!habits || habits.length === 0) return null;

    // Calculate habit health score
    const calculateHabitHealth = () => {
      const totalHabits = habits.length;
      const activeHabits = habits.filter(h => {
        const endDate = dayjs(h.endDate);
        return endDate.isAfter(dayjs()) || endDate.isSame(dayjs(), 'day');
      }).length;
      
      const completionRates = habits.map(habit => {
        const totalDays = dayjs(habit.endDate).diff(dayjs(habit.startDate), 'day') + 1;
        const completedDays = habit.completedDates?.length || 0;
        return (completedDays / totalDays) * 100;
      });
      
      const avgCompletionRate = completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length;
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
      
      // This would need actual completion time data
      // For now, simulate based on habit types
      habits.forEach(habit => {
        if (habit.title.toLowerCase().includes('morning') || habit.title.toLowerCase().includes('exercise')) {
          timeSlots['Early Morning (5-9 AM)']++;
        } else if (habit.title.toLowerCase().includes('work') || habit.title.toLowerCase().includes('study')) {
          timeSlots['Morning (9-12 PM)']++;
        } else if (habit.title.toLowerCase().includes('lunch') || habit.title.toLowerCase().includes('break')) {
          timeSlots['Afternoon (12-5 PM)']++;
        } else if (habit.title.toLowerCase().includes('evening') || habit.title.toLowerCase().includes('dinner')) {
          timeSlots['Evening (5-9 PM)']++;
        } else {
          timeSlots['Night (9 PM-5 AM)']++;
        }
      });
      
      return timeSlots;
    };

    // Identify strengths and weaknesses
    const identifyStrengthsWeaknesses = () => {
      const habitAnalysis = habits.map(habit => {
        const totalDays = dayjs(habit.endDate).diff(dayjs(habit.startDate), 'day') + 1;
        const completedDays = habit.completedDates?.length || 0;
        const completionRate = (completedDays / totalDays) * 100;
        
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
      
      const avgCompletionRate = habits.reduce((sum, h) => {
        const totalDays = dayjs(h.endDate).diff(dayjs(h.startDate), 'day') + 1;
        const completedDays = h.completedDates?.length || 0;
        return sum + ((completedDays / totalDays) * 100);
      }, 0) / habits.length;
      
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
        avgCompletionRate: Math.round(all.reduce((sum, h) => sum + h.completionRate, 0) / all.length),
        bestStreak: Math.max(...all.map(h => h.maxStreak)),
      }
    };
  }, [habits, goals]);

  if (!insights) {
    return (
      <Card shadow="md" padding="lg" radius="lg" withBorder>
        <Box style={{ textAlign: 'center', padding: '2rem' }}>
          <IconBrain size={48} color="#ddd" style={{ marginBottom: '1rem' }} />
          <Text size="lg" fw={600}>No Data Available</Text>
          <Text size="sm" color="#666">Start tracking habits to get personalized insights</Text>
        </Box>
      </Card>
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

  return (
    <>
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
          <BarChart
            h={200}
            data={Object.entries(insights.timePatterns).map(([time, count]) => ({
              time,
              habits: count
            }))}
            dataKey="time"
            series={[{ name: 'habits', color: '#ff922b' }]}
          />
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
                icon={rec.type === 'improvement' ? IconAlertTriangle : IconBulb}
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
                  icon={rec.type === 'improvement' ? IconAlertTriangle : IconBulb}
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
    </>
  );
};

export default PersonalizedInsights; 