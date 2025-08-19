
import { useMemo } from 'react';
import { Project } from '@/types/project';

interface UseProjectFilteringProps {
  projects: Project[];
  searchTerm: string;
  statusFilter: string;
  priorityFilter: string;
  clientFilter: string;
  projectIdFilter: string;
}

export const useProjectFiltering = ({
  projects,
  searchTerm,
  statusFilter,
  priorityFilter,
  clientFilter,
  projectIdFilter,
}: UseProjectFilteringProps) => {
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = !searchTerm || project.project_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Handle status filter - convert "on hold" to "on-hold" for database comparison
      let statusToMatch = statusFilter;
      if (statusFilter === 'on hold') {
        statusToMatch = 'on-hold';
      }
      const matchesStatus = statusFilter === 'all' || project.project_status?.toLowerCase() === statusToMatch.toLowerCase();
      
      const matchesPriority = priorityFilter === 'all' || project.priority?.toLowerCase() === priorityFilter.toLowerCase();
      const matchesClient = !clientFilter || (project.client_name && project.client_name.toLowerCase().includes(clientFilter.toLowerCase()));
      const matchesProjectId = !projectIdFilter || (project.project_id && project.project_id.toLowerCase().includes(projectIdFilter.toLowerCase()));
      
      console.log('Filtering project:', project.project_name, {
        searchTerm,
        statusFilter,
        statusToMatch,
        priorityFilter,
        clientFilter,
        projectIdFilter,
        matchesSearch,
        matchesStatus,
        matchesPriority,
        matchesClient,
        matchesProjectId,
        actualStatus: project.project_status
      });
      
      return matchesSearch && matchesStatus && matchesPriority && matchesClient && matchesProjectId;
    });
  }, [projects, searchTerm, statusFilter, priorityFilter, clientFilter, projectIdFilter]);

  return filteredProjects;
};
