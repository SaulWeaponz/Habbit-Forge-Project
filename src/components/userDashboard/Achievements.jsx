import React, { useState, useEffect } from 'react';
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
  Avatar,
  Divider,
  Tooltip,
  Center,
  Card,
  Loader,
} from '@mantine/core';
import {
  IconTrophy,
  IconFlame,
  IconTarget,
  IconStar,
  IconCrown,
  IconMedal,
  IconAward,
  IconBolt,
  IconTrendingUp,
  IconCheck,
  IconBrain,
  IconRefresh,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import gamificationService from './habits/utils/GamificationService';
import useStrapiHabits from './habits/useLocalStorage';
import useGoalsStorge from './goals/utils/goalStrapi';
import dayjs from 'dayjs';

const Achievements = () => {
  const [userStats, setUserStats] = useState({
    level: 1,
    xp: 0,
    totalXP: 0,
    streak: 0,
    badges: [],
    achievements: [],
  });
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [newBadge, setNewBadge] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get data from hooks
  const STRAPI_AUTH_TOKEN = import.meta.env.VITE_STRAPI_AUTH_TOKEN;
  const { goals, loading: goalsLoading } = useGoalsStorge(STRAPI_AUTH_TOKEN);
  const { list: habits = [], loading: habitsLoading } = useStrapiHabits(STRAPI_AUTH_TOKEN);

  // Available badges from service
  const availableBadges = gamificationService.getAvailableBadges();

  useEffect(() => {
    calculateUserStats();
  }, [habits, goals]);

  const calculateUserStats = async () => {
    setIsRefreshing(true);
    
    try {
      // Update streak based on current habits
      if (habits && habits.length > 0) {
        gamificationService.updateStreak(habits);
      }

      // Get updated stats from service
      const stats = gamificationService.getStats();
      
      // Calculate additional stats
      const completedHabits = habits.filter(h => h.completedDates?.length > 0).length;
      const completedGoals = goals?.data?.filter(g => g.completed)?.length || 0;
      const totalHabitCompletions = habits.reduce((sum, h) => sum + (h.completedDates?.length || 0), 0);
      const perfectDays = gamificationService.calculatePerfectDays(habits);

      // Update stats with real-time data
      const updatedStats = {
        ...stats,
        completedHabits,
        completedGoals,
        totalHabitCompletions,
        perfectDays,
        habitsCreated: habits.length,
      };

      setUserStats(updatedStats);

      // Check for new achievements based on current data
      checkForNewAchievements(updatedStats);

    } catch (error) {
      console.error('Error calculating user stats:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const checkForNewAchievements = (stats) => {
    const currentBadges = stats.badges || [];
    const newAchievements = [];

    // Check for new badges based on current stats
    availableBadges.forEach(badge => {
      const isEarned = currentBadges.some(b => b.id === badge.id);
      if (!isEarned) {
        let shouldAward = false;
        
        switch (badge.type) {
          case 'habits_completed':
            shouldAward = stats.totalHabitCompletions >= badge.requirement;
            break;
          case 'goals_completed':
            shouldAward = stats.completedGoals >= badge.requirement;
            break;
          case 'streak':
            shouldAward = stats.streak >= badge.requirement;
            break;
          case 'perfect_days':
            shouldAward = stats.perfectDays >= badge.requirement;
            break;
          case 'early_completions':
            shouldAward = stats.earlyCompletions >= badge.requirement;
            break;
          case 'habits_created':
            shouldAward = stats.habitsCreated >= badge.requirement;
            break;
          default:
            break;
        }

        if (shouldAward) {
          newAchievements.push(badge);
        }
      }
    });

    // Award new achievements
    newAchievements.forEach(achievement => {
      gamificationService.awardAchievement(achievement);
    });

    // Show notification for first new achievement
    if (newAchievements.length > 0) {
      setNewBadge(newAchievements[0]);
      setShowBadgeModal(true);
    }
  };

  const getLevelRewards = (level) => {
    return gamificationService.getLevelRewards(level);
  };

  const handleRefresh = () => {
    calculateUserStats();
  };

  const handleResetStats = () => {
    if (window.confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
      gamificationService.resetStats();
      calculateUserStats();
    }
  };

  if (goalsLoading || habitsLoading) {
    return (
      <Container size="lg">
        <Center style={{ height: '50vh' }}>
          <Stack align="center" spacing="md">
            <Loader size="lg" color="orange" />
            <Text size="lg" style={{ color: '#ff922b', fontWeight: 600 }}>
              Loading your achievements...
            </Text>
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
        <Group justify="space-between" mb="xl">
          <div>
            <Title order={1} style={{ color: '#ff922b', fontWeight: 900, marginBottom: '1rem' }}>
              Achievements & Gamification
            </Title>
            <Text size="lg" color="#666">
              Track your progress, earn badges, and level up your habit-building journey
            </Text>
          </div>
          <Group>
            <Button
              variant="light"
              color="orange"
              leftSection={<IconRefresh size={16} />}
              loading={isRefreshing}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            <Button
              variant="light"
              color="red"
              onClick={handleResetStats}
            >
              Reset Stats
            </Button>
          </Group>
        </Group>

        <Stack spacing="lg">
          {/* Level and XP Card */}
          <Card shadow="md" padding="lg" radius="lg" withBorder>
            <Group justify="space-between" mb="md">
              <Text fw={700} size="lg" style={{ color: '#ff922b' }}>
                Your Progress
              </Text>
              <Badge color="orange" variant="light" leftSection={<IconTrendingUp size={14} />}>
                Level {userStats.level}
              </Badge>
            </Group>

            <Group align="flex-start">
              <RingProgress
                size={120}
                thickness={12}
                sections={[{ 
                  value: (userStats.xp / userStats.xpNeeded) * 100, 
                  color: '#ff922b' 
                }]}
                label={
                  <Text ta="center" size="lg" fw={700} style={{ color: '#ff922b' }}>
                    {userStats.level}
                  </Text>
                }
              />

              <Stack style={{ flex: 1 }}>
                <Text fw={600} size="md">Experience Points</Text>
                <Text size="xl" fw={800} style={{ color: '#ff922b' }}>
                  {userStats.xp} / {userStats.xpNeeded} XP
                </Text>
                <Progress
                  value={(userStats.xp / userStats.xpNeeded) * 100}
                  color="orange"
                  size="md"
                  radius="xl"
                />
                <Text size="sm" color="#666">
                  Total XP: {userStats.totalXP}
                </Text>
                
                {getLevelRewards(userStats.level) && (
                  <Badge color="green" variant="light" size="sm">
                    🎁 {getLevelRewards(userStats.level)}
                  </Badge>
                )}
              </Stack>
            </Group>
          </Card>

          {/* Stats Overview */}
          <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="lg">
            {/* Current Streak */}
            <Card shadow="md" padding="lg" radius="lg" withBorder>
              <Group justify="space-between" mb="md">
                <Text fw={600} size="md">Current Streak</Text>
                <IconFlame size={24} color="#ff5722" />
              </Group>
              
              <Text size="2xl" fw={800} style={{ color: '#ff5722', textAlign: 'center' }}>
                {userStats.streak} days
              </Text>
              
              <Text size="sm" color="#666" ta="center">
                Keep the fire burning! 🔥
              </Text>
            </Card>

            {/* Badges Summary */}
            <Card 
              shadow="md" 
              padding="lg" 
              radius="lg" 
              withBorder
              style={{ cursor: 'pointer' }}
              onClick={() => setShowAchievementsModal(true)}
            >
              <Group justify="space-between" mb="md">
                <Text fw={600} size="md">Badges Earned</Text>
                <IconTrophy size={24} color="#ff922b" />
              </Group>
              
              <Text size="2xl" fw={800} style={{ color: '#ff922b', textAlign: 'center' }}>
                {userStats.badges.length}
              </Text>
              
              <Text size="sm" color="#666" ta="center">
                Click to view all achievements
              </Text>
            </Card>

            {/* Total Completions */}
            <Card shadow="md" padding="lg" radius="lg" withBorder>
              <Group justify="space-between" mb="md">
                <Text fw={600} size="md">Total Completions</Text>
                <IconCheck size={24} color="#4caf50" />
              </Group>
              
              <Text size="2xl" fw={800} style={{ color: '#4caf50', textAlign: 'center' }}>
                {userStats.totalHabitCompletions || 0}
              </Text>
              
              <Text size="sm" color="#666" ta="center">
                Habits completed
              </Text>
            </Card>

            {/* Early Bird */}
            <Card shadow="md" padding="lg" radius="lg" withBorder>
              <Group justify="space-between" mb="md">
                <Text fw={600} size="md">Early Bird</Text>
                <IconBolt size={24} color="#ffc107" />
              </Group>
              
              <Text size="2xl" fw={800} style={{ color: '#ffc107', textAlign: 'center' }}>
                {userStats.earlyCompletions || 0}
              </Text>
              
              <Text size="sm" color="#666" ta="center">
                Before 8 AM
              </Text>
            </Card>
          </SimpleGrid>

          {/* Recent Achievements */}
          {userStats.badges.length > 0 && (
            <Card shadow="md" padding="lg" radius="lg" withBorder>
              <Text fw={600} size="md" mb="md">Recent Achievements</Text>
              <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
                {userStats.badges.slice(-4).map((badge) => {
                  const badgeData = availableBadges.find(b => b.id === badge.id);
                  const Icon = badgeData?.icon || IconAward;
                  
                  return (
                    <Tooltip key={badge.id} label={badgeData?.description}>
                      <Box
                        style={{
                          textAlign: 'center',
                          padding: '1rem',
                          borderRadius: 8,
                          backgroundColor: '#f8f9fa',
                          border: `2px solid ${badgeData?.color || '#ff922b'}`,
                        }}
                      >
                        <Icon size={32} color={badgeData?.color || '#ff922b'} />
                        <Text size="xs" fw={600} mt="xs">
                          {badgeData?.name}
                        </Text>
                      </Box>
                    </Tooltip>
                  );
                })}
              </SimpleGrid>
            </Card>
          )}

          {/* Completion History */}
          <Card shadow="md" padding="lg" radius="lg" withBorder>
            <Text fw={600} size="md" mb="md">Recent Activity</Text>
            <Stack spacing="xs">
              {gamificationService.getCompletionHistory().slice(-5).reverse().map((completion, index) => (
                <Group key={index} position="apart">
                  <Text size="sm" fw={500}>
                    {completion.habitTitle}
                  </Text>
                  <Group spacing="xs">
                    {completion.isEarly && (
                      <Badge color="yellow" size="xs" leftSection={<IconBolt size={10} />}>
                        Early
                      </Badge>
                    )}
                    <Text size="xs" color="dimmed">
                      {dayjs(completion.completionTime).format('MMM D, h:mm A')}
                    </Text>
                  </Group>
                </Group>
              ))}
            </Stack>
          </Card>
        </Stack>

        {/* Achievements Modal */}
        <Modal
          opened={showAchievementsModal}
          onClose={() => setShowAchievementsModal(false)}
          title="Achievements & Badges"
          size="lg"
        >
          <Stack>
            <Text size="sm" color="#666" mb="md">
              Track your progress and unlock achievements as you build better habits!
            </Text>

            <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md">
              {availableBadges.map((badge) => {
                const isEarned = userStats.badges.some(b => b.id === badge.id);
                const Icon = badge.icon;
                
                return (
                  <Card
                    key={badge.id}
                    shadow="sm"
                    padding="md"
                    radius="md"
                    withBorder
                    style={{
                      opacity: isEarned ? 1 : 0.6,
                      backgroundColor: isEarned ? '#f8f9fa' : '#f5f5f5',
                      border: `2px solid ${isEarned ? badge.color : '#ddd'}`,
                    }}
                  >
                    <Stack align="center" spacing="xs">
                      <Icon size={32} color={isEarned ? badge.color : '#999'} />
                      <Text size="sm" fw={600} ta="center">
                        {badge.name}
                      </Text>
                      <Text size="xs" color="#666" ta="center">
                        {badge.description}
                      </Text>
                      <Text size="xs" color="orange" fw={600}>
                        +{badge.xpReward} XP
                      </Text>
                      {isEarned && (
                        <Badge color="green" variant="light" size="xs">
                          Earned
                        </Badge>
                      )}
                    </Stack>
                  </Card>
                );
              })}
            </SimpleGrid>
          </Stack>
        </Modal>

        {/* New Badge Modal */}
        <Modal
          opened={showBadgeModal}
          onClose={() => setShowBadgeModal(false)}
          title="🎉 New Achievement Unlocked!"
          size="sm"
          centered
        >
          {newBadge && (
            <Stack align="center" spacing="md">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: newBadge.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                  }}
                >
                  <newBadge.icon size={40} color="white" />
                </Box>
              </motion.div>
              
              <Text fw={700} size="lg" ta="center">
                {newBadge.name}
              </Text>
              
              <Text size="sm" color="#666" ta="center">
                {newBadge.description}
              </Text>

              <Badge color="orange" size="lg">
                +{newBadge.xpReward} XP Earned!
              </Badge>
              
              <Button
                color="orange"
                onClick={() => setShowBadgeModal(false)}
                fullWidth
              >
                Awesome!
              </Button>
            </Stack>
          )}
        </Modal>
      </Paper>
    </Container>
  );
};

export default Achievements; 