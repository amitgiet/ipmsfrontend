// Calculate end date based on start date and duration in days
export const calculateEndDate = (startDate, durationDays) => {
  if (!startDate || !durationDays || isNaN(durationDays)) {
    return null;
  }

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + parseInt(durationDays));
  
  return endDate;
};

// Calculate duration in days between two dates
export const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return 0;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Format date to YYYY-MM-DD
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

// Check if date is in the past
export const isPastDate = (date) => {
  if (!date) return false;
  
  const today = new Date();
  const checkDate = new Date(date);
  
  return checkDate < today;
};

// Check if date is in the future
export const isFutureDate = (date) => {
  if (!date) return false;
  
  const today = new Date();
  const checkDate = new Date(date);
  
  return checkDate > today;
}; 