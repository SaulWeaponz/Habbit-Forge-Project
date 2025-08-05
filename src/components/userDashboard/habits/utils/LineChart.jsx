import dayjs from "dayjs";

export const buildChartData = (habit) => {
  const start = dayjs(habit.startDate);
  const end = dayjs(habit.endDate);
  const days = end.diff(start, "day");

  return Array.from({ length: days + 1 }, (_, i) => {
    const date = start.add(i, "day");
    const dateStr = date.format("YYYY-MM-DD");
    return {
      date: date.format("MMM D"),
      Completed: habit.completedDates?.includes(dateStr) ? 1 : 0,
    };
  });
};