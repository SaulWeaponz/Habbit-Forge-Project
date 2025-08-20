import React, { useState, useEffect } from "react";
import {
  Button,
  Text,
  Container,
  ScrollArea,
  Loader,
  Stack,
  Paper,
  Title,
  Group,
  Box,
  Alert,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from '@mantine/notifications';
import "@mantine/dates/styles.css";
import { IconPlus, IconTrash, IconRefresh, IconAlertCircle, IconTarget, IconCheck, IconClock } from '@tabler/icons-react';

import HabbitForm from "./HabbitForm";
import useStrapiHabits from "./useLocalStorage";
import { HabbitsList } from "./HabbitsList.jsx";
import { getAuthToken } from '../../../utils/auth';

const HabbitsManagement = () => {
  const [editingHabit, setEditingHabit] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);

  const [authToken, setAuthToken] = useState(() => {
    // Get token using the auth utility
    const token = getAuthToken();
    return token;
  });

  // Update token when component mounts or user logs in
  useEffect(() => {
    const updateToken = () => {
      const newToken = getAuthToken();
      if (newToken && newToken !== authToken) {
        setAuthToken(newToken);
      }
    };

    // Check for token changes
    const interval = setInterval(updateToken, 1000);
    return () => clearInterval(interval);
  }, [authToken]);

  const {
    list,
    loading,
    error,
    addItem,
    removeItem,
    clearList,
    updateItem,
    refreshHabits,
    toggleHabbitCompletion,
  } = useStrapiHabits(authToken);

  // Calculate stats
  const stats = {
    total: list?.length || 0,
    completedToday: list?.filter(habit => {
      const today = new Date().toISOString().split('T')[0];
      return habit.completedDates?.includes(today);
    }).length || 0,
    active: list?.filter(habit => {
      const today = new Date();
      const start = new Date(habit.startDate);
      const end = new Date(habit.endDate);
      return today >= start && today <= end;
    }).length || 0,
  };

  const handleSubmit = async (habit) => {
    try {
      if (editingHabit) {
        await updateItem(editingHabit.documentId, habit);
        notifications.show({
          title: 'Habit Updated',
          message: 'Your habit was updated successfully.',
          color: 'green',
        });
      } else {
        await addItem(habit);
        notifications.show({
          title: 'Habit Created',
          message: 'Your new habit was created successfully.',
          color: 'green',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error?.message || 'Failed to add or update habit. Please try again.',
        color: 'red',
      });
    } finally {
      setEditingHabit(null);
      close();
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshHabits();
      notifications.show({
        title: 'Refreshed',
        message: 'Habits list has been refreshed.',
        color: 'blue',
      });
    } catch (error) {
      notifications.show({
        title: 'Refresh Failed',
        message: 'Failed to refresh habits. Please try again.',
        color: 'red',
      });
    }
  };

  const handleClearAll = async () => {
    try {
      await clearList();
      notifications.show({
        title: 'Cleared',
        message: 'All habits have been cleared.',
        color: 'blue',
      });
    } catch (error) {
      notifications.show({
        title: 'Clear Failed',
        message: 'Failed to clear habits. Please try again.',
        color: 'red',
      });
    }
  };

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
              Habits Management
            </Title>
            <Text size="lg" color="#222" style={{ fontWeight: 500 }}>
              Create, track, and manage your daily habits
            </Text>
          </div>
          
          {/* Refresh button */}
          <Button
            variant="light"
            color="blue"
            onClick={handleRefresh}
            disabled={loading}
            leftSection={<IconRefresh size={16} />}
          >
            Refresh
          </Button>
        </Group>

        {/* Stats Section */}
        {list?.length > 0 && (
          <Group mb="xl" grow>
            <Paper
              p="md"
              style={{
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                border: '1px solid #90caf9'
              }}
            >
              <Group>
                <IconTarget size={24} color="#1976d2" />
                <div>
                  <Text size="lg" weight={700} color="#1976d2">
                    {stats.total}
                  </Text>
                  <Text size="sm" color="dimmed">Total Habits</Text>
                </div>
              </Group>
            </Paper>
            
            <Paper
              p="md"
              style={{
                background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                border: '1px solid #a5d6a7'
              }}
            >
              <Group>
                <IconCheck size={24} color="#388e3c" />
                <div>
                  <Text size="lg" weight={700} color="#388e3c">
                    {stats.completedToday}
                  </Text>
                  <Text size="sm" color="dimmed">Completed Today</Text>
                </div>
              </Group>
            </Paper>
            
            <Paper
              p="md"
              style={{
                background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                border: '1px solid #ffd180'
              }}
            >
              <Group>
                <IconClock size={24} color="#ff9800" />
                <div>
                  <Text size="lg" weight={700} color="#ff9800">
                    {stats.active}
                  </Text>
                  <Text size="sm" color="dimmed">Active Habits</Text>
                </div>
              </Group>
            </Paper>
          </Group>
        )}

        {/* Authentication Alert */}
        {!authToken && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Authentication Required"
            color="yellow"
            mb="md"
          >
            Please log in to create and manage your habits.
          </Alert>
        )}

        <HabbitForm
          opened={opened}
          onClose={() => {
            setEditingHabit(null);
            close();
          }}
          initialValues={editingHabit}
          onSubmit={handleSubmit}
        />

        <Button
          variant="gradient"
          gradient={{ from: '#ff922b', to: '#ffa726', deg: 45 }}
          fullWidth
          size="lg"
          onClick={() => {
            setEditingHabit(null);
            open();
          }}
          leftSection={<IconPlus size={20} />}
          disabled={!authToken}
          style={{
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(255,146,43,0.25)',
            marginBottom: '2rem',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 16px rgba(255,146,43,0.35)'
            }
          }}
        >
          Add New Habit
        </Button>

        <ScrollArea mt={20} style={{ height: "60vh" }}>
          {loading ? (
            <Stack align="center" mt="md">
              <Loader size="lg" color="orange" />
              <Text size="lg" style={{ color: '#ff922b', fontWeight: 600 }}>
                Loading your habits...
              </Text>
            </Stack>
          ) : error ? (
            <Box
              style={{
                textAlign: 'center',
                padding: '3rem',
                background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                borderRadius: 16,
                border: '2px dashed #ef4444'
              }}
            >
              <Text size="xl" style={{ color: '#dc2626', fontWeight: 700, marginBottom: '1rem' }}>
                Error Loading Habits
              </Text>
              <Text size="md" color="#666" mb="md">
                {error}
              </Text>
              <Button
                variant="light"
                color="red"
                onClick={handleRefresh}
                leftSection={<IconRefresh size={16} />}
              >
                Try Again
              </Button>
            </Box>
          ) : list?.length === 0 ? (
            <Box
              style={{
                textAlign: 'center',
                padding: '3rem',
                background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                borderRadius: 16,
                border: '2px dashed #ffd180'
              }}
            >
              <Text size="xl" style={{ color: '#ff922b', fontWeight: 700, marginBottom: '1rem' }}>
                🚀 Ready to Build Your First Habit?
              </Text>
              <Text size="md" color="#666" mb="md">
                Start your journey to self-improvement by creating your first habit above.
              </Text>
              <Text size="sm" color="dimmed" style={{ maxWidth: '400px', margin: '0 auto' }}>
                💡 <strong>Pro Tips:</strong> Start small with daily habits like "Read 10 pages" or "Drink 8 glasses of water". 
                Set realistic dates and celebrate your progress!
              </Text>
            </Box>
          ) : (
            <HabbitsList
              list={list}
              removeItem={removeItem}
              updateItem={updateItem}
              setEditingHabit={setEditingHabit}
              open={open}
              toggleHabbitCompletion={toggleHabbitCompletion}
            />
          )}

          {list?.length > 0 && (
            <Button
              mt="xl"
              color="red"
              variant="light"
              onClick={handleClearAll}
              leftSection={<IconTrash size={16} />}
              style={{
                background: '#ffebee',
                color: '#d32f2f',
                fontWeight: 600,
                border: '1px solid #ffcdd2'
              }}
            >
              Clear All Habits
            </Button>
          )}
        </ScrollArea>
      </Paper>
    </Container>
  );
};

export default HabbitsManagement;
