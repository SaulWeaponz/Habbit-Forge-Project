import React, { useState, useEffect, useCallback } from 'react';
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
  Avatar,
  Divider,
  Tooltip,
  notifications,
} from '@mantine/core';
import {
  IconTrophy,
  IconFlame,
  IconTarget,
  IconStar,
  IconCrown,
  IconMedal,
  IconAward,
  IconZap,
  IconTrendingUp,
  IconCheck,
  IconBell,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';

const GamificationSystem = ({ habits, goals, onHabitCompleted, onBadgeEarned }) => {
  const [userStats, setUserStats] = useState({
    level: 1,
    xp: 0,
    totalXP: 0,
    streak: 0,
    badges: [],
    achievements: [],
    lastCompletionTime: null,
    earlyCompletions: 0,
  });
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [newBadge, setNewBadge] = useState(null);
  const [completionHistory, setCompletionHistory] = useState([]);

  // XP requirements for each level
  const xpForLevel = (level) => Math.floor(100 * Math.pow(1.5, level - 1));
  
  // Calculate current level and progress
  const calculateLevel = (totalXP) => {
    let level = 1;
    let xpNeeded = 0;
    
    while (totalXP >= xpForLevel(level)) {
      totalXP -= xpForLevel(level);
      level++;
    }
    
    return { level, currentXP: totalXP, xpNeeded: xpForLevel(level) };
  };

  // Enhanced badge system with more detailed tracking
  const availableBadges = [
    {
      id: 'first_habit',
      name: 'First Steps',
      description: 'Complete your first habit',
      icon: IconTarget,
      color: '#4caf50',
      requirement: 1,
      type: 'habits_completed',
      xpReward: 50
    },
    {
      id: 'streak_7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: IconFlame,
      color: '#ff9800',
      requirement: 7,
      type: 'streak',
      xpReward: 100
    },
    {
      id: 'streak_30',
      name: 'Monthly Master',
      description: 'Maintain a 30-day streak',
      icon: IconTrophy,
      color: '#ff5722',
      requirement: 30,
      type: 'streak',
      xpReward: 500
    },
    {
      id: 'streak_100',
      name: 'Century Club',
      description: 'Maintain a 100-day streak',
      icon: IconCrown,
      color: '#9c27b0',
      requirement: 100,
      type: 'streak',
      xpReward: 2000
    },
    {
      id: 'goal_completed',
      name: 'Goal Getter',
      description: 'Complete your first goal',
      icon: IconStar,
      color: '#2196f3',
      requirement: 1,
      type: 'goals_completed',
      xpReward: 200
    },
    {
      id: 'perfect_week',
      name: 'Perfect Week',
      description: 'Complete all habits for 7 days straight',
      icon: IconCheck,
      color: '#4caf50',
      requirement: 7,
      type: 'perfect_days',
      xpReward: 300
    },
    {
      id: 'habit_master',
      name: 'Habit Master',
      description: 'Complete 50 habits total',
      icon: IconMedal,
      color: '#ff922b',
      requirement: 50,
      type: 'habits_completed',
      xpReward: 1000
    },
    {
      id: 'early_bird',
      name: 'Early Bird',
      description: 'Complete 5 habits before 8 AM',
      icon: IconZap,
      color: '#ffc107',
      requirement: 5,
      type: 'early_completions',
      xpReward: 150
    },
    {
      id: 'consistency_king',
      name: 'Consistency King',
      description: 'Complete the same habit for 14 consecutive days',
      icon: IconTrendingUp,
      color: '#00bcd4',
      requirement: 14,
      type: 'consistency_streak',
      xpReward: 400
    },
    {
      id: 'habit_creator',
      name: 'Habit Creator',
      description: 'Create 10 different habits',
      icon: IconTarget,
      color: '#795548',
      requirement: 10,
      type: 'habits_created',
      xpReward: 250
    }
  ];

  // Enhanced completion tracking
  const trackHabitCompletion = useCallback((habit, completionTime = new Date()) => {
    const completion = {
      habitId: habit.id,
      habitTitle: habit.title,
      completionTime: completionTime.toISOString(),
      date: dayjs(completionTime).format('YYYY-MM-DD'),
      hour: completionTime.getHours(),
      isEarly: completionTime.getHours() < 8,
    };

    setCompletionHistory(prev => [...prev, completion]);

    // Check for early completion
    if (completion.isEarly) {
      setUserStats(prev => ({
        ...prev,
        earlyCompletions: prev.earlyCompletions + 1
      }));
    }

    // Trigger achievement check
    checkForAchievements();

    // Notify parent component
    if (onHabitCompleted) {
      onHabitCompleted(habit, completion);
    }

    // Show completion notification
    notifications.show({
      title: 'Habit Completed! 🎉',
      message: `Great job completing "${habit.title}"! +10 XP`,
      color: 'green',
      icon: <IconCheck size={16} />,
      autoClose: 3000,
    });
  }, [onHabitCompleted]);

  // Enhanced achievement checking
  const checkForAchievements = useCallback(() => {
    const currentStats = calculateCurrentStats();
    const earnedBadges = checkForNewBadges(currentStats);
    const newBadges = earnedBadges.filter(badge => 
      !userStats.badges.some(earned => earned.id === badge.id)
    );

    if (newBadges.length > 0) {
      const badge = newBadges[0];
      setNewBadge(badge);
      setShowBadgeModal(true);
      
      // Award XP for new badge
      const xpGained = badge.xpReward || 50;
      setUserStats(prev => ({
        ...prev,
        totalXP: prev.totalXP + xpGained,
        badges: earnedBadges
      }));

      // Show badge notification
      notifications.show({
        title: '🏆 New Achievement Unlocked!',
        message: `${badge.name} - ${badge.description} (+${xpGained} XP)`,
        color: 'orange',
        icon: <IconTrophy size={16} />,
        autoClose: 5000,
      });

      // Notify parent component
      if (onBadgeEarned) {
        onBadgeEarned(badge);
      }
    }
  }, [userStats.badges, onBadgeEarned]);

  // Enhanced stats calculation
  const calculateCurrentStats = useCallback(() => {
    if (!habits || habits.length === 0) return {};

    const completedHabits = habits.filter(h => h.completedDates?.length > 0).length;
    const completedGoals = goals?.filter(g => g.completed)?.length || 0;
    const totalHabitCompletions = habits.reduce((sum, h) => sum + (h.completedDates?.length || 0), 0);
    
    // Calculate current streak
    let currentStreak = 0;
    const today = dayjs().format('YYYY-MM-DD');
    let checkDate = dayjs();
    
    while (true) {
      const dateStr = checkDate.format('YYYY-MM-DD');
      const hasCompletedHabits = habits.some(habit => 
        habit.completedDates?.includes(dateStr)
      );
      
      if (hasCompletedHabits) {
        currentStreak++;
        checkDate = checkDate.subtract(1, 'day');
      } else {
        break;
      }
    }

    // Calculate consistency streak (same habit)
    const consistencyStreak = calculateConsistencyStreak();

    return {
      habits_completed: totalHabitCompletions,
      goals_completed: completedGoals,
      streak: currentStreak,
      perfect_days: calculatePerfectDays(),
      early_completions: userStats.earlyCompletions,
      consistency_streak: consistencyStreak,
      habits_created: habits.length,
    };
  }, [habits, goals, userStats.earlyCompletions]);

  // Calculate consistency streak for individual habits
  const calculateConsistencyStreak = useCallback(() => {
    let maxConsistencyStreak = 0;
    
    habits.forEach(habit => {
      if (!habit.completedDates || habit.completedDates.length === 0) return;
      
      const sortedDates = [...habit.completedDates].sort();
      let currentStreak = 0;
      let maxStreak = 0;
      
      for (let i = 0; i < sortedDates.length; i++) {
        const currentDate = dayjs(sortedDates[i]);
        const nextDate = i < sortedDates.length - 1 ? dayjs(sortedDates[i + 1]) : null;
        
        if (nextDate && currentDate.add(1, 'day').isSame(nextDate, 'day')) {
          currentStreak++;
        } else {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
          currentStreak = 0;
        }
      }
      
      maxConsistencyStreak = Math.max(maxConsistencyStreak, maxStreak);
    });
    
    return maxConsistencyStreak;
  }, [habits]);

  // Enhanced perfect days calculation
  const calculatePerfectDays = useCallback(() => {
    let perfectDays = 0;
    const today = dayjs();
    
    for (let i = 0; i < 7; i++) {
      const checkDate = today.subtract(i, 'day');
      const dateStr = checkDate.format('YYYY-MM-DD');
      
      const scheduledHabits = habits.filter(habit => {
        const startDate = dayjs(habit.startDate);
        const endDate = dayjs(habit.endDate);
        return checkDate.isBetween(startDate, endDate, 'day', '[]');
      });
      
      if (scheduledHabits.length > 0) {
        const completedHabits = scheduledHabits.filter(habit => 
          habit.completedDates?.includes(dateStr)
        );
        
        if (completedHabits.length === scheduledHabits.length) {
          perfectDays++;
        }
      }
    }
    
    return perfectDays;
  }, [habits]);

  // Enhanced stats calculation with real-time updates
  const calculateUserStats = useCallback(() => {
    const savedStats = JSON.parse(localStorage.getItem('userGamificationStats') || '{}');
    const currentStats = calculateCurrentStats();
    
    // Calculate XP with more granular rewards
    let totalXP = savedStats.totalXP || 0;
    const newXP = (
      (currentStats.habits_completed * 10) + 
      (currentStats.goals_completed * 50) + 
      (currentStats.streak * 5) +
      (currentStats.perfect_days * 20) +
      (currentStats.early_completions * 15)
    );
    
    if (newXP > totalXP) {
      totalXP = newXP;
    }

    const { level, currentXP, xpNeeded } = calculateLevel(totalXP);

    // Check for new badges
    const earnedBadges = checkForNewBadges(currentStats);

    const updatedStats = {
      level,
      xp: currentXP,
      totalXP,
      xpNeeded,
      streak: currentStats.streak,
      badges: earnedBadges,
      achievements: savedStats.achievements || [],
      earlyCompletions: currentStats.early_completions,
      lastCompletionTime: savedStats.lastCompletionTime,
    };

    setUserStats(updatedStats);
    localStorage.setItem('userGamificationStats', JSON.stringify(updatedStats));
  }, [calculateCurrentStats]);

  const checkForNewBadges = (stats) => {
    return availableBadges.filter(badge => {
      const currentValue = stats[badge.type] || 0;
      return currentValue >= badge.requirement;
    });
  };

  // Auto-refresh stats when habits change
  useEffect(() => {
    calculateUserStats();
  }, [habits, goals, calculateUserStats]);

  // Check for achievements when completion history changes
  useEffect(() => {
    if (completionHistory.length > 0) {
      checkForAchievements();
    }
  }, [completionHistory, checkForAchievements]);

  const getLevelRewards = (level) => {
    const rewards = {
      5: 'Unlock habit categories',
      10: 'Custom theme colors',
      15: 'Advanced analytics',
      20: 'Priority support',
      25: 'Exclusive content',
      30: 'Habit coach access',
      35: 'Premium features',
      40: 'Community leader status',
      45: 'Expert badge',
      50: 'Legendary status',
    };
    return rewards[level] || null;
  };

  // Expose completion tracking function
  useEffect(() => {
    if (window.trackHabitCompletion) {
      window.trackHabitCompletion = trackHabitCompletion;
    }
  }, [trackHabitCompletion]);

  return (
    <>
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

        {/* Streak and Badges */}
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
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

        {/* Recent Completions */}
        {completionHistory.length > 0 && (
          <Card shadow="md" padding="lg" radius="lg" withBorder>
            <Text fw={600} size="md" mb="md">Recent Activity</Text>
            <Stack spacing="xs">
              {completionHistory.slice(-5).reverse().map((completion, index) => (
                <Group key={index} position="apart">
                  <Text size="sm" fw={500}>
                    {completion.habitTitle}
                  </Text>
                  <Group spacing="xs">
                    {completion.isEarly && (
                      <Badge color="yellow" size="xs" leftSection={<IconZap size={10} />}>
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
        )}
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
    </>
  );
};

export default GamificationSystem; 