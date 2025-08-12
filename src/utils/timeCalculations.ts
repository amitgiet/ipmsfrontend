
export const calculateDurationMinutes = (start: string, end: string): number => {
  if (!start || !end) return 0;
  
  try {
    const startDate = new Date(`1970-01-01T${start}:00`);
    const endDate = new Date(`1970-01-01T${end}:00`);
    
    // Handle case where end time is next day
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }
    
    const diffMs = endDate.getTime() - startDate.getTime();
    return Math.round(diffMs / (1000 * 60)); // Convert to minutes
  } catch (error) {
    console.error('Error calculating duration:', error);
    return 0;
  }
};

export const formatDurationDisplay = (minutes: number): string => {
  return minutes > 0 
    ? `${Math.floor(minutes / 60)}h ${minutes % 60}m`
    : '0h 0m';
};

export const createTimestamp = (date: string, time: string): string => {
  return `${date}T${time}:00`;
};
