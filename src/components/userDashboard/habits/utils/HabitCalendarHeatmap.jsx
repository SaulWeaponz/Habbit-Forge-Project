import React, { useState, useMemo } from 'react';
import {
  Card,
  Text,
  Group,
  Badge,
  Tooltip,
  Stack,
  Box,
  Modal,
  List,
  Divider,
} from '@mantine/core';
import {
  IconCalendar,
  IconCheck,
  IconX,
  IconTarget,
  IconTrophy,
} from '@tabler/icons-react';
import dayjs from 'dayjs';

const HabitCalendarHeatmap = ({ habits, selectedMonth = null }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  
  const currentMonth = selectedMonth || dayjs();
  const startOfMonth = currentMonth.startOf('month');
  const endOfMonth = currentMonth.endOf('month');
  const startOfCalendar = startOfMonth.startOf('week');
  const endOfCalendar = endOfMonth.endOf('week');

  const getCompletionRate = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    const applicableHabits = habits.filter(habit => {
      const startDate = dayjs(habit.startDate);
      const endDate = dayjs(habit.endDate);
      return date.isBetween(startDate, endDate, 'day', '[]');
    });

    if (applicableHabits.length === 0) return 0;

    const completedHabits = applicableHabits.filter(habit => 
      habit.completedDates?.includes(dateStr)
    );

    return (completedHabits.length / applicableHabits.length) * 100;
  };

  const getCompletionColor = (rate) => {
    if (rate === 0) return '#f5f5f5';
    if (rate < 25) return '#ffebee';
    if (rate < 50) return '#ffcdd2';
    if (rate < 75) return '#ef9a9a';
    if (rate < 100) return '#e57373';
    return '#4caf50';
  };

  const getHabitsForDate = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    return habits.filter(habit => {
      const startDate = dayjs(habit.startDate);
      const endDate = dayjs(habit.endDate);
      return date.isBetween(startDate, endDate, 'day', '[]');
    }).map(habit => ({
      ...habit,
      completed: habit.completedDates?.includes(dateStr) || false
    }));
  };

  const calendarDays = useMemo(() => {
    const days = [];
    let currentDate = startOfCalendar;
    
    while (currentDate.isBefore(endOfCalendar) || currentDate.isSame(endOfCalendar, 'day')) {
      days.push(currentDate);
      currentDate = currentDate.add(1, 'day');
    }
    
    return days;
  }, [startOfCalendar, endOfCalendar]);

  const handleDateClick = (date) => {
    const habitsForDate = getHabitsForDate(date);
    if (habitsForDate.length > 0) {
      setSelectedDate({ date, habits: habitsForDate });
      setShowDateModal(true);
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <>
      <Card shadow="md" padding="lg" radius="lg" withBorder>
        <Group justify="space-between" mb="md">
          <Text fw={700} size="lg" style={{ color: '#ff922b' }}>
            Habit Completion Calendar
          </Text>
          <Badge color="orange" variant="light" leftSection={<IconCalendar size={14} />}>
            {currentMonth.format('MMMM YYYY')}
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
              {calendarDays.map((date, index) => {
                const isCurrentMonth = date.isSame(currentMonth, 'month');
                const isToday = date.isSame(dayjs(), 'day');
                const completionRate = getCompletionRate(date);
                const habitsForDate = getHabitsForDate(date);
                const hasHabits = habitsForDate.length > 0;

                return (
                  <Tooltip
                    key={index}
                    label={
                      hasHabits 
                        ? `${date.format('MMM D, YYYY')} - ${Math.round(completionRate)}% completed (${habitsForDate.length} habits)`
                        : `${date.format('MMM D, YYYY')} - No habits scheduled`
                    }
                    disabled={!hasHabits}
                  >
                    <Box
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: hasHabits ? getCompletionColor(completionRate) : '#f9f9f9',
                        border: isToday ? '2px solid #ff922b' : '1px solid #e0e0e0',
                        borderRadius: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: hasHabits ? 'pointer' : 'default',
                        opacity: isCurrentMonth ? 1 : 0.3,
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        '&:hover': hasHabits ? {
                          transform: 'scale(1.1)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        } : {}
                      }}
                      onClick={() => hasHabits && handleDateClick(date)}
                    >
                      <Text
                        size="xs"
                        fw={isToday ? 700 : 500}
                        style={{
                          color: isToday ? '#ff922b' : (isCurrentMonth ? '#333' : '#999')
                        }}
                      >
                        {date.date()}
                      </Text>
                      
                      {/* Completion indicator */}
                      {hasHabits && completionRate > 0 && (
                        <Box
                          style={{
                            position: 'absolute',
                            top: 2,
                            right: 2,
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: completionRate === 100 ? '#4caf50' : '#ff922b',
                          }}
                        />
                      )}
                    </Box>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </Box>

        {/* Legend */}
        <Group mt="md" justify="center" gap="xs">
          <Text size="xs" fw={600}>Completion Rate:</Text>
          {[0, 25, 50, 75, 100].map(rate => (
            <Group key={rate} gap={4}>
              <Box
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: getCompletionColor(rate),
                  borderRadius: 2,
                }}
              />
              <Text size="xs">{rate}%</Text>
            </Group>
          ))}
        </Group>
      </Card>

      {/* Date Details Modal */}
      <Modal
        opened={showDateModal}
        onClose={() => setShowDateModal(false)}
        title={`Habits for ${selectedDate?.date.format('dddd, MMMM D, YYYY')}`}
        size="md"
      >
        {selectedDate && (
          <Stack>
            <Group justify="space-between">
              <Text size="sm" color="#666">
                {selectedDate.habits.length} habit{selectedDate.habits.length !== 1 ? 's' : ''} scheduled
              </Text>
              <Badge 
                color={selectedDate.habits.every(h => h.completed) ? 'green' : 'orange'}
                variant="light"
              >
                {Math.round((selectedDate.habits.filter(h => h.completed).length / selectedDate.habits.length) * 100)}% completed
              </Badge>
            </Group>

            <Divider />

            <List spacing="sm">
              {selectedDate.habits.map(habit => (
                <List.Item
                  key={habit.id}
                  icon={
                    habit.completed ? (
                      <IconCheck size={16} color="#4caf50" />
                    ) : (
                      <IconX size={16} color="#f44336" />
                    )
                  }
                >
                  <Group justify="space-between">
                    <Text fw={600} size="sm">
                      {habit.title}
                    </Text>
                    <Badge
                      color={habit.completed ? 'green' : 'red'}
                      variant="light"
                      size="sm"
                    >
                      {habit.completed ? 'Completed' : 'Not completed'}
                    </Badge>
                  </Group>
                  {habit.description && (
                    <Text size="xs" color="#666" mt={4}>
                      {habit.description}
                    </Text>
                  )}
                </List.Item>
              ))}
            </List>
          </Stack>
        )}
      </Modal>
    </>
  );
};

export default HabitCalendarHeatmap; 