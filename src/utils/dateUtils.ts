
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

// Function to convert date to IST (UTC+5:30)
export const convertToIST = (date: Date): Date => {
  // Create a new date with IST timezone string
  return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
};

// Function to determine business day (4am to next day 4am) in IST
export const getBusinessDay = (date: Date): Date => {
  // Convert to IST
  const istDate = convertToIST(date);
  const hours = istDate.getHours();
  
  // If time is before 4am IST, consider it part of the previous day
  if (hours < 4) {
    const previousDay = new Date(istDate);
    previousDay.setDate(istDate.getDate() - 1);
    return previousDay;
  }
  return istDate;
};

// Format for business day display in IST
export const formatBusinessDay = (date: Date): string => {
  // We'll format directly using the IST date object
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Kolkata' // This ensures it's displayed in IST
  });
};
