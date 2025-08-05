import dayjs from "dayjs";

export const isTodayMatchingFrequency = (habit) => {
  const today = dayjs().startOf("day");
  const start = dayjs(habit.startDate).startOf("day");
  const end = dayjs(habit.endDate).startOf("day");

  console.log(`Checking frequency for habit "${habit.title}":`, {
    today: today.format('YYYY-MM-DD'),
    start: start.format('YYYY-MM-DD'),
    end: end.format('YYYY-MM-DD'),
    frequency: habit.frequency,
    isBeforeStart: today.isBefore(start),
    isAfterEnd: today.isAfter(end)
  });

  if (today.isBefore(start) || today.isAfter(end)) return false;

  switch (habit.frequency) {
    case "Daily":
      console.log(`Habit "${habit.title}" matches Daily frequency`);
      return true;
    case "Weekly":
      const weeklyMatch = today.day() === start.day();
      console.log(`Habit "${habit.title}" Weekly check: today.day()=${today.day()}, start.day()=${start.day()}, match=${weeklyMatch}`);
      return weeklyMatch;
    case "Monthly":
      const monthlyMatch = today.date() === start.date();
      console.log(`Habit "${habit.title}" Monthly check: today.date()=${today.date()}, start.date()=${start.date()}, match=${monthlyMatch}`);
      return monthlyMatch;
    default:
      console.log(`Habit "${habit.title}" has unknown frequency: ${habit.frequency}`);
      return false;
  }
};
export const getHabitProgress = (habit) => {
  const today = dayjs().startOf("day"); 
  const startDate = dayjs(habit.startDate).startOf("day");
  const endDate = dayjs(habit.endDate).startOf("day");

  if (today.isBefore(startDate) || today.isAfter(endDate)) {
    return 0; // Not in the range of the habit  

  }
  const totalDays = endDate.diff(startDate, "day") + 1; // Include both start and end dates
  const completedDays = habit.completedDates?.length || 0;
  const progress = (completedDays / totalDays) * 100;
  return Math.round(progress); // Ensure progress does not exceed 100%
}