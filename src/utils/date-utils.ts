
import { format, isToday, isYesterday, isThisWeek, isThisMonth, isThisYear } from 'date-fns';

export const formatDisplayDate = (date: Date): string => {
  if (isToday(date)) {
    return 'Today';
  }
  
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  
  if (isThisWeek(date)) {
    return format(date, 'EEEE'); // Day name e.g., Monday
  }
  
  if (isThisMonth(date)) {
    return format(date, 'MMMM d'); // Month and day e.g., June 7
  }
  
  if (isThisYear(date)) {
    return format(date, 'MMMM d'); // Month and day e.g., June 7
  }
  
  return format(date, 'MMM d, yyyy'); // e.g., Jun 7, 2023
};

export const formatTime = (date: Date): string => {
  return format(date, 'h:mm a'); // e.g., 2:30 PM
};

export const formatDateTime = (date: Date | null | undefined): string => {
  if (!date) return '';
  return format(date, 'MMM d, yyyy h:mm a'); // e.g., Jun 7, 2023 2:30 PM
};
