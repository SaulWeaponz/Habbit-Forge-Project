import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  Center,
  Loader,
  Group,
  Badge,
  Box,
  Card,
  Tooltip,
  Divider,
  SimpleGrid,
  Progress,
  ActionIcon,
  Button,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCalendar, IconCheck, IconX, IconChartBar, IconTrophy, IconBolt } from '@tabler/icons-react';
import useStrapiHabits from './useLocalStorage';
import gamificationService from './utils/GamificationService';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { LineChart } from '@mantine/charts';

dayjs.extend(isBetween);

const InteractiveHabits = () => {
  const authToken = import.meta.env.VITE_STRAPI_AUTH_TOKEN;
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [selectedHabit, setSelectedHabit] = useState(null);
  const {
    list,
    loading,
    updateItem,
  } = useStrapiHabits(authToken);

  // Enhanced completion tracking with gamification
  const handleDateToggle = async (habit, date) => {
    // Ensure we're working with the local timezone
    const localDate = dayjs(date).startOf('day');
    const dateStr = localDate.format('YYYY-MM-DD');
    const completionTime = new Date();
    
    console.log('Toggling date:', {
      clickedDate: date.format('YYYY-MM-DD HH:mm:ss'),
      localDate: localDate.format('YYYY-MM-DD HH:mm:ss'),
      dateStr,
      habitStartDate: habit.startDate,
      habitEndDate: habit.endDate,
      currentCompletedDates: habit.completedDates
    });

    const completedDates = habit.completedDates || [];
    const isCompleted = completedDates.includes(dateStr);
    
    const updatedHabit = {
      ...habit,
      completedDates: isCompleted
        ? completedDates.filter(d => d !== dateStr)
        : [...completedDates, dateStr].sort() // Sort dates for consistency
    };
    
    console.log('Updated habit:', {
      newCompletedDates: updatedHabit.completedDates,
      added: !isCompleted,
      removed: isCompleted
    });

    try {
      await updateItem(habit.documentId, updatedHabit);
      
      // Track completion for gamification using the service
      if (!isCompleted) {
        gamificationService.trackHabitCompletion(habit, completionTime);
      } else {
        // Handle uncompletion (optional - could track this too)
        console.log('Habit uncompleted:', habit.title);
      }
      
      // Update the selected habit to reflect changes immediately
      setSelectedHabit(updatedHabit);
      
    } catch (error) {
      console.error('Error updating habit:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update habit completion. Please try again.',
        color: 'red',
      });
    }
  };



  // Calculate current streak across all habits using the service
  const calculateCurrentStreak = () => {
    return gamificationService.calculateCurrentStreak(list);
  };

  const getCompletionRate = (habit) => {
    if (!habit) return 0;
    const completedDates = habit.completedDates || [];
    const startDate = dayjs(habit.startDate);
    const endDate = dayjs(habit.endDate);
    const totalDays = endDate.diff(startDate, 'day') + 1;
    return Math.round((completedDates.length / totalDays) * 100);
  };

  const getCurrentStreak = (habit) => {
    if (!habit?.completedDates) return 0;
    const sortedDates = [...habit.completedDates].sort();
    let streak = 0;
    let currentDate = dayjs();
    
    while (sortedDates.includes(currentDate.format('YYYY-MM-DD'))) {
      streak++;
      currentDate = currentDate.subtract(1, 'day');
    }
    
    return streak;
  };

  const getCompletionColor = (rate) => {
    if (rate === 0) return '#f5f5f5';
    if (rate < 25) return '#ffebee';
    if (rate < 50) return '#ffcdd2';
    if (rate < 75) return '#ef9a9a';
    if (rate < 100) return '#e57373';
    return '#4caf50';
  };

  const buildChartData = (habit) => {
    if (!habit) return [];
    
    console.log('Building chart data for habit:', {
      title: habit.title,
      startDate: habit.startDate,
      endDate: habit.endDate,
      completedDates: habit.completedDates
    });
    
    // Ensure we have valid dates and they're in local timezone
    const startDate = dayjs(habit.startDate).startOf('day');
    const endDate = dayjs(habit.endDate).startOf('day');
    const today = dayjs().startOf('day');

    console.log('Parsed dates:', {
      startDate: startDate.format('YYYY-MM-DD HH:mm:ss'),
      endDate: endDate.format('YYYY-MM-DD HH:mm:ss'),
      today: today.format('YYYY-MM-DD HH:mm:ss')
    });

    // Validate date range
    if (!startDate.isValid() || !endDate.isValid()) {
      console.error('Invalid date range for habit:', habit.title);
      return [];
    }

    // Sort and normalize completed dates for consistent lookup
    const normalizedCompletedDates = (habit.completedDates || []).map(date => 
      dayjs(date).startOf('day').format('YYYY-MM-DD')
    );
    const completedDatesSet = new Set(normalizedCompletedDates);
    
    console.log('Normalized completed dates:', {
      original: habit.completedDates,
      normalized: normalizedCompletedDates
    });

    const data = [];
    let currentDate = startDate;

    // Build data points for each day in the range
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
      const dateStr = currentDate.format('YYYY-MM-DD');
      const isCompleted = completedDatesSet.has(dateStr);
      const isFuture = currentDate.isAfter(today);

      data.push({
        date: dateStr,
        completed: isCompleted ? 1 : 0,
        label: isFuture ? 'Future Date' : (isCompleted ? 'Completed' : 'Not Completed'),
        isFuture
      });
      currentDate = currentDate.add(1, 'day');
    }

    console.log('Generated chart data:', {
      dataPoints: data.length,
      completedPoints: data.filter(d => d.completed).length,
      firstPoint: data[0],
      lastPoint: data[data.length - 1]
    });

    return data;
  };

  const currentMonth = selectedMonth;
  const startOfMonth = currentMonth.startOf('month');
  const endOfMonth = currentMonth.endOf('month');
  const startOfCalendar = startOfMonth.startOf('week');
  const endOfCalendar = endOfMonth.endOf('week');

  const calendarDays = [];
  let currentDate = startOfCalendar;
  while (currentDate.isBefore(endOfCalendar) || currentDate.isSame(endOfCalendar, 'day')) {
    calendarDays.push(currentDate);
    currentDate = currentDate.add(1, 'day');
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <Container size="lg">
        <Center style={{ height: '50vh' }}>
          <Stack align="center" spacing="md">
            <Loader size="lg" color="orange" />
            <Text size="lg" color="#666">Loading your habits...</Text>
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
        <Title order={1} style={{ color: '#ff922b', fontWeight: 900, marginBottom: '1rem' }}>
          Interactive Habit Tracker
        </Title>
        <Text size="lg" color="#666" mb="xl">
          Select a habit to view and track your progress
        </Text>

        {/* Overall Stats Summary */}
        {list?.length > 0 && (
          <Card shadow="md" padding="lg" radius="lg" withBorder mb="xl">
            <Group position="apart" mb="md">
              <Text fw={700} size="lg" style={{ color: '#ff922b' }}>
                Overall Progress
              </Text>
              <Badge color="orange" variant="light" leftSection={<IconTrophy size={14} />}>
                {calculateCurrentStreak()} Day Streak
              </Badge>
            </Group>
            
            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
              <Box textAlign="center">
                <Text size="2xl" fw={800} style={{ color: '#ff922b' }}>
                  {list.length}
                </Text>
                <Text size="sm" color="dimmed">Total Habits</Text>
              </Box>
              <Box textAlign="center">
                <Text size="2xl" fw={800} style={{ color: '#4caf50' }}>
                  {list.filter(h => h.completedDates?.length > 0).length}
                </Text>
                <Text size="sm" color="dimmed">Active Habits</Text>
              </Box>
              <Box textAlign="center">
                <Text size="2xl" fw={800} style={{ color: '#2196f3' }}>
                  {list.reduce((sum, h) => sum + (h.completedDates?.length || 0), 0)}
                </Text>
                <Text size="sm" color="dimmed">Total Completions</Text>
              </Box>
              <Box textAlign="center">
                <Text size="2xl" fw={800} style={{ color: '#ffc107' }}>
                  {Math.round(list.reduce((sum, h) => sum + getCompletionRate(h), 0) / list.length)}%
                </Text>
                <Text size="sm" color="dimmed">Avg. Completion</Text>
              </Box>
            </SimpleGrid>
          </Card>
        )}

        {list?.length === 0 ? (
          <Center style={{ padding: '4rem 2rem' }}>
            <Stack align="center" spacing="lg">
              <Title order={2} style={{ color: '#ff922b', fontWeight: 700 }}>
                No Habits Yet
              </Title>
              <Text size="lg" color="#666" ta="center" maw={400}>
                Create some habits in the Habits Management section to start tracking them interactively!
              </Text>
            </Stack>
          </Center>
        ) : (
          <>
            {/* Habits List */}
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
              {list.map(habit => (
                <Card
                  key={habit.documentId}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{
                    cursor: 'pointer',
                    border: selectedHabit?.documentId === habit.documentId ? '2px solid #ff922b' : undefined,
                  }}
                  onClick={() => setSelectedHabit(habit)}
                >
                  <Stack>
                    <Text fw={700} size="lg" style={{ color: '#ff922b' }}>
                      {habit.title}
                    </Text>
                    <Text size="sm" color="dimmed" lineClamp={2}>
                      {habit.description}
                    </Text>
                    <Group position="apart">
                      <Badge color="blue" variant="light">
                        {habit.frequency}
                      </Badge>
                      <Badge 
                        color={getCompletionRate(habit) >= 75 ? 'green' : 'orange'} 
                        variant="light"
                      >
                        {getCompletionRate(habit)}% Complete
                      </Badge>
                    </Group>
                    <Progress 
                      value={getCompletionRate(habit)} 
                      color={getCompletionRate(habit) >= 75 ? 'green' : 'orange'}
                    />
                    <Group position="apart" mt="xs">
                      <Text size="xs" color="dimmed">
                        Streak: {getCurrentStreak(habit)} days
                      </Text>
                      <Text size="xs" color="dimmed">
                        {habit.completedDates?.length || 0} completions
                      </Text>
                    </Group>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>

            {/* Selected Habit View */}
            {selectedHabit && (
              <>
                <Divider my="xl" />
                
                <Stack spacing="xl">
                  <Group position="apart">
                    <Stack spacing={4}>
                      <Title order={2} style={{ color: '#ff922b' }}>
                        {selectedHabit.title}
                      </Title>
                      <Text size="sm" color="dimmed">
                        {selectedHabit.description}
                      </Text>
                    </Stack>
                    <Group>
                      <Badge color="blue" size="lg">
                        Current Streak: {getCurrentStreak(selectedHabit)} days
                      </Badge>
                      <Badge color="green" size="lg">
                        Completion Rate: {getCompletionRate(selectedHabit)}%
                      </Badge>
                    </Group>
                  </Group>

                  {/* Calendar View */}
                  <Card shadow="md" padding="lg" radius="lg" withBorder>
                    <Group justify="space-between" mb="md">
                      <Text fw={700} size="lg" style={{ color: '#ff922b' }}>
                        Habit Calendar
                      </Text>
                      <Badge color="orange" variant="light" leftSection={<IconCalendar size={14} />}>
                        {selectedMonth.format('MMMM YYYY')}
                      </Badge>
                    </Group>

                    <Box style={{ overflowX: 'auto' }}>
                      <div style={{ minWidth: '600px' }}>
                        {/* Week day headers */}
                        <Group gap={4} mb="xs">
                          {weekDays.map(day => (
                            <Box
                              key={day}
                              style={{
                                width: 40,
                                height: 30,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 600,
                                fontSize: '12px',
                                color: '#666'
                              }}
                            >
                              {day}
                            </Box>
                          ))}
                        </Group>

                        {/* Calendar grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                          {(() => {
                            const days = [];
                            const startOfMonth = dayjs(selectedMonth).startOf('month');
                            const endOfMonth = dayjs(selectedMonth).endOf('month');
                            const startOfCalendar = dayjs(startOfMonth).startOf('week');
                            const endOfCalendar = dayjs(endOfMonth).endOf('week');
                            
                            // Calculate total weeks and days
                            const totalDays = endOfCalendar.diff(startOfCalendar, 'day') + 1;
                            
                            // Generate calendar grid
                            for (let i = 0; i < totalDays; i++) {
                              // Calculate the date for this grid position
                              const dateObj = dayjs(startOfCalendar).add(i, 'day');
                              const isCurrentMonth = dateObj.isSame(selectedMonth, 'month');
                              const isToday = dateObj.isSame(dayjs(), 'day');
                              const dateStr = dateObj.format('YYYY-MM-DD');
                              const isCompleted = selectedHabit.completedDates?.includes(dateStr);
                              const today = dayjs().startOf('day');
                              const isFutureDate = dateObj.isAfter(today);
                              const isInRange = dateObj.isBetween(
                                dayjs(selectedHabit.startDate),
                                dayjs(selectedHabit.endDate),
                                'day',
                                '[]'
                              );
                              const isClickable = isInRange && !isFutureDate;

                              days.push(
                                <Tooltip
                                  key={dateStr}
                                  label={
                                    isFutureDate
                                      ? "Cannot mark future dates"
                                      : !isInRange 
                                        ? "Outside habit date range"
                                        : isCompleted
                                          ? "Click to unmark as completed"
                                          : "Click to mark as completed"
                                  }
                                  disabled={!isCurrentMonth}
                                >
                                  <Box
                                    style={{
                                      width: 40,
                                      height: 40,
                                      backgroundColor: isCompleted ? '#2ecc71' : '#f9f9f9',
                                      color: isCompleted ? 'white' : 'inherit',
                                      border: isToday ? '2px solid #ff922b' : '1px solid #e0e0e0',
                                      borderRadius: 6,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: isClickable ? 'pointer' : 'default',
                                      opacity: isCurrentMonth && (isInRange || isFutureDate) ? 1 : 0.3,
                                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                      position: 'relative',
                                      transform: isCompleted ? 'scale(1.05)' : 'scale(1)',
                                      boxShadow: isCompleted ? '0 2px 8px rgba(46, 204, 113, 0.2)' : 'none',
                                      '&:hover': isClickable && {
                                        transform: 'scale(1.1)',
                                        boxShadow: '0 4px 12px rgba(46, 204, 113, 0.3)',
                                        backgroundColor: isCompleted ? '#27ae60' : '#e8f5e9',
                                      }
                                    }}
                                    onClick={() => {
                                      if (isClickable) {
                                        console.log('Clicking date:', {
                                          date: dateObj.format('YYYY-MM-DD'),
                                          isCurrentMonth,
                                          isToday,
                                          isFutureDate
                                        });
                                        handleDateToggle(selectedHabit, dateObj);
                                      }
                                    }}
                                  >
                                    {dateObj.date()}
                                    {isCompleted && (
                                      <IconCheck
                                        size={12}
                                        style={{
                                          position: 'absolute',
                                          top: 2,
                                          right: 2,
                                          color: 'white'
                                        }}
                                      />
                                    )}
                                    {isClickable && !isCompleted && (
                                      <Box
                                        style={{
                                          position: 'absolute',
                                          top: 2,
                                          right: 2,
                                          width: 12,
                                          height: 12,
                                          borderRadius: '50%',
                                          border: '2px dashed #ccc',
                                          opacity: 0.5
                                        }}
                                      />
                                    )}
                                  </Box>
                                </Tooltip>
                              );
                              currentDate = currentDate.add(1, 'day');
                            }
                            return days;
                          })()}
                        </div>
                      </div>
                    </Box>
                  </Card>

                  {/* Progress Chart */}
                  <Card shadow="md" padding="lg" radius="lg" withBorder>
                    <Text fw={700} size="lg" style={{ color: '#ff922b' }} mb="md">
                      Progress Over Time
                    </Text>
                    <Card.Section>
                      <Group position="apart" p="sm">
                        <Text size="sm" color="dimmed">
                          {dayjs(selectedHabit.startDate).format('MMM D, YYYY')} - {dayjs(selectedHabit.endDate).format('MMM D, YYYY')}
                        </Text>
                        <Badge>
                          {buildChartData(selectedHabit).filter(d => d.completed).length} days completed
                        </Badge>
                      </Group>
                    </Card.Section>
                    <LineChart
                      h={300}
                      data={buildChartData(selectedHabit)}
                      dataKey="date"
                      series={[
                        { 
                          name: 'completed', 
                          color: '#2ecc71',
                          label: 'Completion Status'
                        }
                      ]}
                      curveType="monotone"
                      tickLine="y"
                      withLegend
                      gridAxis="xy"
                      xAxisProps={{
                        tickFormatter: (value) => dayjs(value).format('MMM D'),
                        style: { fontSize: 10 },
                        tickMargin: 10
                      }}
                      yAxisProps={{
                        tickFormatter: (value) => value === 1 ? 'Done' : 'Not Done',
                        style: { fontSize: 10 }
                      }}
                      tooltipProps={{
                        content: ({ payload }) => {
                          if (payload && payload.length > 0) {
                            const data = payload[0].payload;
                            return (
                              <div style={{ 
                                background: 'white', 
                                padding: '8px', 
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                              }}>
                                <div style={{ fontWeight: 'bold' }}>
                                  {dayjs(data.date).format('MMM D, YYYY')}
                                </div>
                                <div style={{ 
                                  color: data.isFuture ? '#666' : (data.completed ? '#2ecc71' : '#ff6b6b'),
                                  marginTop: '4px'
                                }}>
                                  {data.label}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }
                      }}
                    />
                  </Card>
                </Stack>
              </>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default InteractiveHabits;