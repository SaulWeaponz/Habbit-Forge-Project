import React from 'react';
import { Container, Title, Text, Card, Grid, Group, Badge, Divider, List } from '@mantine/core';

const AboutPage = () => {
  return (
    <Container size="md" py="xl">
      <Title order={2} align="center" mb="md">
        About HabitForge
      </Title>

      <Text align="center" color="dimmed" size="md" mb="xl">
        HabitForge helps you build better habits, set meaningful goals, and stay motivated with daily quotes and productivity tips.
      </Text>

      <Card shadow="sm" padding="lg" radius="md" mb="xl" withBorder>
        <Title order={3} mb="sm">🚀 Key Features</Title>
        <List spacing="xs" size="sm" withPadding>
          <List.Item><b>Habit Tracker</b> – Set habits with frequency, start & end dates, and track your progress.</List.Item>
          <List.Item><b>Goal Management</b> – Define personal or professional goals and monitor completion timelines.</List.Item>
          <List.Item><b>Motivational Quotes</b> – Stay inspired with curated daily or random quotes.</List.Item>
          <List.Item><b>Productivity Tips</b> – Learn bite-sized tips to stay focused, organized, and consistent.</List.Item>
        </List>
      </Card>

      <Grid>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Card withBorder shadow="sm" padding="lg" radius="md">
            <Group position="apart" mb="sm">
              <Title order={4}>💪 Habits & Goals</Title>
              <Badge color="teal" variant="light">Core</Badge>
            </Group>
            <Text size="sm" color="dimmed">
              Build consistent routines, stay accountable, and visualize progress. Daily reminders keep you on track.
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Card withBorder shadow="sm" padding="lg" radius="md">
            <Group position="apart" mb="sm">
              <Title order={4}>✨ Motivation & Tips</Title>
              <Badge color="blue" variant="light">Support</Badge>
            </Group>
            <Text size="sm" color="dimmed">
              Fuel your growth with uplifting quotes and helpful tips. Whether you're starting or restarting, we’ve got your back.
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      <Divider my="xl" />

      <Card shadow="xs" padding="md" withBorder>
        <Title order={4} mb="sm">📘 Our Mission</Title>
        <Text size="sm">
          HabitForge is more than just an app. It's a personal companion on your journey to becoming your best self—
          whether you're building discipline, reducing procrastination, or simply finding daily joy in small wins.
        </Text>
      </Card>
    </Container>
  );
};

export default AboutPage;
