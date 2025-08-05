import dayjs from 'dayjs';
import { notifications } from '@mantine/notifications';
import { IconTrophy, IconBolt, IconFlame, IconCrown, IconCheck } from '@tabler/icons-react';

class GamificationService {
  constructor() {
    this.storageKey = 'userGamificationStats';
    this.completionHistoryKey = 'habitCompletionHistory';
    this.initializeStats();
  }

  // Initialize user stats if they don't exist
  initializeStats() {
    const existingStats = localStorage.getItem(this.storageKey);
    if (!existingStats) {
      const initialStats = {
        level: 1,
        xp: 0,
        totalXP: 0,
        streak: 0,
        badges: [],
        achievements: [],
        earlyCompletions: 0,
        totalCompletions: 0,
        lastCompletionTime: null,
        perfectDays: 0,
        consistencyStreak: 0,
        habitsCreated: 0,
      };
      localStorage.setItem(this.storageKey, JSON.stringify(initialStats));
    }
  }

  // Get current user stats
  getStats() {
    const stats = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    return {
      ...stats,
      level: this.calculateLevel(stats.totalXP || 0).level,
      xp: this.calculateLevel(stats.totalXP || 0).currentXP,
      xpNeeded: this.calculateLevel(stats.totalXP || 0).xpNeeded,
    };
  }

  // Calculate level based on total XP
  calculateLevel(totalXP) {
    let level = 1;
    let xpNeeded = 0;
    
    while (totalXP >= this.xpForLevel(level)) {
      totalXP -= this.xpForLevel(level);
      level++;
    }
    
    return { 
      level, 
      currentXP: totalXP, 
      xpNeeded: this.xpForLevel(level) 
    };
  }

  // XP requirements for each level
  xpForLevel(level) {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  // Track habit completion with detailed analytics
  trackHabitCompletion(habit, completionTime = new Date()) {
    const completion = {
      habitId: habit.id,
      habitTitle: habit.title,
      completionTime: completionTime.toISOString(),
      date: dayjs(completionTime).format('YYYY-MM-DD'),
      hour: completionTime.getHours(),
      isEarly: completionTime.getHours() < 8,
      isOnTime: completionTime.getHours() >= 8 && completionTime.getHours() <= 18,
      isLate: completionTime.getHours() > 18,
    };

    // Save completion to history
    this.saveCompletionToHistory(completion);

    // Update stats
    const xpGained = this.calculateXPForCompletion(completion);
    this.updateStats(completion, xpGained);

    // Show completion notification
    this.showCompletionNotification(habit, xpGained);

    // Check for achievements
    this.checkForAchievements(completion, habit);

    return completion;
  }

  // Save completion to history
  saveCompletionToHistory(completion) {
    const history = JSON.parse(localStorage.getItem(this.completionHistoryKey) || '[]');
    history.push(completion);
    
    // Keep only last 100 completions to prevent storage bloat
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
    
    localStorage.setItem(this.completionHistoryKey, JSON.stringify(history));
  }

  // Get completion history
  getCompletionHistory() {
    return JSON.parse(localStorage.getItem(this.completionHistoryKey) || '[]');
  }

  // Calculate XP based on completion timing
  calculateXPForCompletion(completion) {
    let baseXP = 10;
    
    if (completion.isEarly) {
      baseXP += 5; // Bonus for early completion
    } else if (completion.isOnTime) {
      baseXP += 2; // Small bonus for on-time completion
    }
    
    return baseXP;
  }

  // Update user stats
  updateStats(completion, xpGained) {
    const stats = this.getStats();
    
    // Update early completions
    if (completion.isEarly) {
      stats.earlyCompletions = (stats.earlyCompletions || 0) + 1;
    }
    
    // Update total completions
    stats.totalCompletions = (stats.totalCompletions || 0) + 1;
    
    // Update last completion time
    stats.lastCompletionTime = completion.completionTime;
    
    // Update total XP
    stats.totalXP = (stats.totalXP || 0) + xpGained;
    
    // Recalculate level
    const levelInfo = this.calculateLevel(stats.totalXP);
    stats.level = levelInfo.level;
    stats.xp = levelInfo.currentXP;
    stats.xpNeeded = levelInfo.xpNeeded;
    
    localStorage.setItem(this.storageKey, JSON.stringify(stats));
  }

  // Show completion notification
  showCompletionNotification(habit, xpGained) {
    notifications.show({
      title: 'Habit Completed! 🎉',
      message: `Great job completing "${habit.title}"! +${xpGained} XP`,
      color: 'green',
      icon: <IconCheck size={16} />,
      autoClose: 3000,
    });
  }

  // Check for achievements
  checkForAchievements(completion, habit) {
    const stats = this.getStats();
    const newAchievements = [];

    // First Steps Achievement
    if (stats.totalCompletions === 1) {
      newAchievements.push({
        id: 'first_habit',
        name: 'First Steps',
        description: 'You completed your first habit!',
        xpReward: 50,
        icon: IconTrophy,
        color: '#4caf50'
      });
    }

    // Early Bird Achievement
    if (completion.isEarly && stats.earlyCompletions === 5) {
      newAchievements.push({
        id: 'early_bird',
        name: 'Early Bird',
        description: 'You completed 5 habits before 8 AM!',
        xpReward: 150,
        icon: IconBolt,
        color: '#ffc107'
      });
    }

    // Week Warrior Achievement
    if (stats.streak === 7) {
      newAchievements.push({
        id: 'streak_7',
        name: 'Week Warrior',
        description: '7-day streak! You\'re on fire!',
        xpReward: 100,
        icon: IconFlame,
        color: '#ff9800'
      });
    }

    // Monthly Master Achievement
    if (stats.streak === 30) {
      newAchievements.push({
        id: 'streak_30',
        name: 'Monthly Master',
        description: '30-day streak! You\'re unstoppable!',
        xpReward: 500,
        icon: IconCrown,
        color: '#ff5722'
      });
    }

    // Award achievements
    newAchievements.forEach(achievement => {
      this.awardAchievement(achievement);
    });
  }

  // Award an achievement
  awardAchievement(achievement) {
    const stats = this.getStats();
    
    // Add to badges if not already earned
    if (!stats.badges.some(b => b.id === achievement.id)) {
      stats.badges.push(achievement);
      
      // Award XP
      stats.totalXP += achievement.xpReward;
      
      // Recalculate level
      const levelInfo = this.calculateLevel(stats.totalXP);
      stats.level = levelInfo.level;
      stats.xp = levelInfo.currentXP;
      stats.xpNeeded = levelInfo.xpNeeded;
      
      localStorage.setItem(this.storageKey, JSON.stringify(stats));
      
      // Show achievement notification
      this.showAchievementNotification(achievement);
    }
  }

  // Show achievement notification
  showAchievementNotification(achievement) {
    notifications.show({
      title: `🏆 ${achievement.name} Achievement!`,
      message: `${achievement.description} (+${achievement.xpReward} XP)`,
      color: 'orange',
      icon: <achievement.icon size={16} />,
      autoClose: 5000,
    });
  }

  // Calculate current streak from habits data
  calculateCurrentStreak(habits) {
    if (!habits || habits.length === 0) return 0;
    
    let streak = 0;
    const today = dayjs();
    
    while (true) {
      const dateStr = today.subtract(streak, 'day').format('YYYY-MM-DD');
      const hasCompletedHabits = habits.some(habit => 
        habit.completedDates?.includes(dateStr)
      );
      
      if (hasCompletedHabits) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  // Update streak in stats
  updateStreak(habits) {
    const currentStreak = this.calculateCurrentStreak(habits);
    const stats = this.getStats();
    
    if (stats.streak !== currentStreak) {
      stats.streak = currentStreak;
      localStorage.setItem(this.storageKey, JSON.stringify(stats));
    }
    
    return currentStreak;
  }

  // Calculate perfect days
  calculatePerfectDays(habits) {
    if (!habits || habits.length === 0) return 0;
    
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
  }

  // Get level rewards
  getLevelRewards(level) {
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
  }

  // Get available badges
  getAvailableBadges() {
    return [
      {
        id: 'first_habit',
        name: 'First Steps',
        description: 'Complete your first habit',
        icon: IconTrophy,
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
        icon: IconCrown,
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
        icon: IconTrophy,
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
        icon: IconTrophy,
        color: '#ff922b',
        requirement: 50,
        type: 'habits_completed',
        xpReward: 1000
      },
      {
        id: 'early_bird',
        name: 'Early Bird',
        description: 'Complete 5 habits before 8 AM',
        icon: IconBolt,
        color: '#ffc107',
        requirement: 5,
        type: 'early_completions',
        xpReward: 150
      },
      {
        id: 'consistency_king',
        name: 'Consistency King',
        description: 'Complete the same habit for 14 consecutive days',
        icon: IconTrophy,
        color: '#00bcd4',
        requirement: 14,
        type: 'consistency_streak',
        xpReward: 400
      },
      {
        id: 'habit_creator',
        name: 'Habit Creator',
        description: 'Create 10 different habits',
        icon: IconTrophy,
        color: '#795548',
        requirement: 10,
        type: 'habits_created',
        xpReward: 250
      }
    ];
  }

  // Reset all stats (for testing or user reset)
  resetStats() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.completionHistoryKey);
    this.initializeStats();
  }

  // Export stats for backup
  exportStats() {
    const stats = this.getStats();
    const history = this.getCompletionHistory();
    return {
      stats,
      history,
      exportDate: new Date().toISOString()
    };
  }

  // Import stats from backup
  importStats(backupData) {
    if (backupData.stats) {
      localStorage.setItem(this.storageKey, JSON.stringify(backupData.stats));
    }
    if (backupData.history) {
      localStorage.setItem(this.completionHistoryKey, JSON.stringify(backupData.history));
    }
  }
}

// Create singleton instance
const gamificationService = new GamificationService();

export default gamificationService; 