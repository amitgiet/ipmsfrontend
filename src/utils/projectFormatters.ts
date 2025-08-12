
import { format } from 'date-fns';

export const formatBudget = (amount: number | null, currency: string | null) => {
  if (!amount) return 'Not set';
  const currencySymbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
  return `${currencySymbol}${amount.toLocaleString()}`;
};

export const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Not set';
  return format(new Date(dateString), 'MMM dd, yyyy');
};

export const statusColors = {
  planned: 'bg-blue-100 text-blue-800 border-blue-200',
  'in-progress': 'bg-green-100 text-green-800 border-green-200',
  'on-hold': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  completed: 'bg-gray-100 text-gray-800 border-gray-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export const priorityColors = {
  low: 'bg-green-50 text-green-700',
  medium: 'bg-yellow-50 text-yellow-700',
  high: 'bg-orange-50 text-orange-700',
  urgent: 'bg-red-50 text-red-700',
};
