const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

export const parseDate = (dateString: string | null | undefined): Date | undefined => {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export const formatMonthLabel = (yearMonth: string): string => {
  const [year, month] = yearMonth.split("-");
  const monthIndex = Number(month) - 1;
  const monthLabel = monthIndex >= 0 && monthIndex < MONTH_NAMES.length ? MONTH_NAMES[monthIndex] : month;
  return `${monthLabel} '${year.slice(-2)}`;
};

export const getYearMonthKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

export const getEndOfDay = (date: Date): Date => {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
};

export { MONTH_NAMES };

