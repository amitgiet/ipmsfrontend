
import { useState } from 'react';

export const useAdminFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState('');
  const [projectIdFilter, setProjectIdFilter] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const updateFilters = (filters: {
    statusFilter?: string;
    priorityFilter?: string;
    clientFilter?: string;
    projectIdFilter?: string;
  }) => {
    if (filters.statusFilter !== undefined) setStatusFilter(filters.statusFilter);
    if (filters.priorityFilter !== undefined) setPriorityFilter(filters.priorityFilter);
    if (filters.clientFilter !== undefined) setClientFilter(filters.clientFilter);
    if (filters.projectIdFilter !== undefined) setProjectIdFilter(filters.projectIdFilter);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setClientFilter('');
    setProjectIdFilter('');
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    clientFilter,
    setClientFilter,
    projectIdFilter,
    setProjectIdFilter,
    filtersOpen,
    setFiltersOpen,
    updateFilters,
    clearFilters,
  };
};
