
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Plus,
  Edit,
  Calendar,
  DollarSign,
  ExternalLink,
  Search,
  Filter,
  ChevronDown,
  FolderOpen,
  Users,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddProjectForm } from '@/pages/dashboard/Modal/AddProjectForm';
import { EditProjectForm } from '@/pages/dashboard/Modal/EditProjectForm';
import { projectService } from '@/services/ProjectService/projectService';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import AddClientModal from '@/pages/dashboard/Modal/AddClientModal';

export const AdminProjectsSection = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('');
  const [debouncedClientFilter, setDebouncedClientFilter] = useState('');
  const [projectIdFilter, setProjectIdFilter] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [addProjectModalOpen, setAddProjectModalOpen] = useState(false);
  const [editProjectModalOpen, setEditProjectModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  });


  // Debounce search terms for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedClientFilter(clientFilter);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [clientFilter]);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        // Prepare API parameters with filters
        const apiParams: any = {
          page: pagination.current_page,
          limit: pagination.per_page
        };

        // Add filters to API call if they have values (using debounced values)
        if (debouncedSearchTerm.trim()) {
          apiParams.search = debouncedSearchTerm.trim();
        }
        if (debouncedClientFilter.trim()) {
          apiParams.client_name = debouncedClientFilter.trim();
        }
        if (statusFilter !== 'all') {
          apiParams.status = statusFilter;
        }
        if (priorityFilter !== 'all') {
          apiParams.priority = priorityFilter;
        }

        // Use the project service to fetch projects with filters
        const response = await projectService.getProjects(apiParams);

        if (response.success) {
          const projectsData = response.data.data || [];
          const meta = response.data.meta || {};

          // Transform the data to match our Project interface if needed
          const transformedProjects = projectsData.map(item => ({
            id: item.id?.toString() || Date.now().toString(),
            project_name: item.name || item.title || item.project_name || 'Untitled Project',
            project_code: item.project_code || item.project_id || item.id?.toString(),
            project_status: item.status || 'planned',
            project_type: item.types || [],
            project_nature: item.natures || [],
            priority: item.priority || 'medium',
            client_name: item.client_name || item.customer_name || 'Client Not Assigned',
            client_email: item.client_email || item.email || '',
            allow_client_access: item.is_client_dashboard_access_enabled == true || item.allow_client_access || false,
            estimated_budget: parseFloat(item.estimated_budget) || 0,
            budget_currency: item.currency || 'USD',
            actual_budget_used: 0,
            budgeted_hours: parseFloat(item.budgeted_hours) || 0,
            logged_hours: parseFloat(item.logged_hours) || 0,
            start_date: item.start_date || item.created_at,
            end_date: item.end_date || null,
            duration: parseInt(item.duration_days) || null,
            documents: item.documents || '',
            all_clients: item.client || [],
            client_phone: item.client_phone || '',
            backup_contact: item.backup_contact || '',
            milestones: item.milestones || '',
            client_dependencies: item.client_dependencies || '',
            tags_labels: item.tags || item.tags_labels || '',
            created_at: item.created_at || new Date().toISOString(),
            created_by: item.created_by || 'admin',
            progress_percent: item.progress_percent || 0,
            tags: item.tags || '',
            notes: item.notes || '',
          }));

          if (transformedProjects.length === 0) {
            setProjects([]);
            setFilteredProjects([]);
            setPagination({
              current_page: 1,
              last_page: 1,
              per_page: 10,
              total: 0
            });
          } else {
            setProjects(transformedProjects);
            setFilteredProjects(transformedProjects);
            setPagination({
              current_page: meta.current_page || 1,
              last_page: meta.last_page || 1,
              per_page: meta.per_page || 10,
              total: meta.total || transformedProjects.length
            });
          }
        } else {
          console.error("❌ Failed to fetch projects:", response.message || response.error);
          // If API fails, show empty state
          setProjects([]);
          setFilteredProjects([]);
          setPagination({
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0
          });
        }
      } catch (error) {
        console.error("❌ Error fetching projects:", error);
        // If any error occurs, show empty state
        setProjects([]);
        setFilteredProjects([]);
        setPagination({
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0
        });
      }

      setLoading(false);
    };

    loadProjects();
  }, [pagination.current_page, pagination.per_page, debouncedSearchTerm, debouncedClientFilter, statusFilter, priorityFilter]);

  useEffect(() => {
    // Apply client-side filtering using debounced values to prevent local filtering
    const filtered = projects.filter((project) => {
      const matchesSearch = !debouncedSearchTerm ||
        project.project_name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        project.project_code?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        project.client_name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || project.project_status === statusFilter;

      const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;

      const matchesClient = !debouncedClientFilter ||
        project.client_name?.toLowerCase().includes(debouncedClientFilter.toLowerCase());

      const matchesProjectId = !projectIdFilter ||
        project.project_code?.toLowerCase().includes(projectIdFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesPriority && matchesClient && matchesProjectId;
    });

    setFilteredProjects(filtered);
  }, [projects, debouncedSearchTerm, statusFilter, priorityFilter, debouncedClientFilter, projectIdFilter]);

  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      setPagination(prev => ({ ...prev, current_page: newPage }));
    }
  };

  const loadProjects = async () => {
    setLoading(true);

    try {
      // Prepare API parameters with filters
      const apiParams: any = {
        page: pagination.current_page,
        limit: pagination.per_page
      };

      // Add filters to API call if they have values (using debounced values)
      if (debouncedSearchTerm.trim()) {
        apiParams.search = debouncedSearchTerm.trim();
      }
      if (debouncedClientFilter.trim()) {
        apiParams.client_name = debouncedClientFilter.trim();
      }
      if (statusFilter !== 'all') {
        apiParams.status = statusFilter;
      }
      if (priorityFilter !== 'all') {
        apiParams.priority = priorityFilter;
      }

      const response = await projectService.getProjects(apiParams);

      if (response.success) {
        const projectsData = response.data.data || [];
        const meta = response.data.meta || {};

        // Transform the data to match our Project interface if needed
        const transformedProjects = projectsData.map(item => ({
          id: item.id?.toString() || Date.now().toString(),
          project_name: item.name || item.title || item.project_name || 'Untitled Project',
          project_code: item.project_code || item.project_id || item.id?.toString(),
          project_status: item.status || 'planned',
          project_type: item.types || [],
          all_clients: item.client || [],
          project_nature: item.natures || [],
          priority: item.priority || 'medium',
          client_name: item.client_name || item.customer_name || 'Client Not Assigned',
          client_email: item.client_email || item.email || '',
          client_phone: item.client_phone || '',
          backup_contact: item.backup_contact || '',
          allow_client_access: item.is_client_dashboard_access_enabled == true || item.allow_client_access || false,
          estimated_budget: parseFloat(item.estimated_budget) || 0,
          budget_currency: item.currency || 'USD',
          actual_budget_used: 0,
          budgeted_hours: parseFloat(item.budgeted_hours) || 0,
          logged_hours: parseFloat(item.logged_hours) || 0,
          start_date: item.start_date || item.created_at,
          end_date: item.end_date || null,
          duration: parseInt(item.duration_days) || null,
          documents: item.documents || '',
          milestones: item.milestones || '',
          client_dependencies: item.client_dependencies || '',
          tags_labels: item.tags || item.tags_labels || '',
          created_at: item.created_at || new Date().toISOString(),
          created_by: item.created_by || 'admin',
          progress_percent: item.progress_percent || 0,
          tags: item.tags || '',
          notes: item.notes || '',
          }));

        if (transformedProjects.length === 0) {
          setProjects([]);
          setFilteredProjects([]);
          setPagination({
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0
          });
          toast({
            title: "No Projects",
            description: "No projects found. Create your first project to get started!",
            variant: "default"
          });
        } else {
          setProjects(transformedProjects);
          setFilteredProjects(transformedProjects);
          setPagination({
            current_page: meta.current_page || 1,
            last_page: meta.last_page || 1,
            per_page: meta.per_page || 10,
            total: meta.total || transformedProjects.length
          });
        }
      } else {
        console.error("❌ Failed to refresh projects:", response.message || response.error);
        // If API fails, show empty state
        setProjects([]);
        setFilteredProjects([]);
        setPagination({
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0
        });
      }
    } catch (error) {
      console.error("❌ Error refreshing projects:", error);
      // If any error occurs, show empty state
      setProjects([]);
      setFilteredProjects([]);
      setPagination({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
      });
    }

    setLoading(false);
  };

  const handleRefreshProjects = () => {
    loadProjects();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setClientFilter('');
    setDebouncedClientFilter('');
    setProjectIdFilter('');

    // Refresh projects with cleared filters
    handleRefreshProjects();
  };

  const handleAddProject = () => {
    setAddProjectModalOpen(true);
  };

  const handleProjectSubmit = () => {
    try {
      loadProjects();
    } catch (error) {
      console.error("❌ Error handling project creation:", error);
      toast({
        title: "Error",
        description: "An error occurred while processing the new project.",
        variant: "destructive"
      });
    }
  };

  const handleEditProjectSubmit = () => {
    try {
      loadProjects();
    } catch (error) {
      console.error("❌ Error handling project update:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the project.",
        variant: "destructive"
      });
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setEditProjectModalOpen(true);
  };

  const getProjectStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'planned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount, currency) => {
    if (!amount) return 'N/A';
    return `${currency || ''} ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6 w-full p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button onClick={handleAddProject} disabled={loading} className="flex items-center gap-2">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add Project
              </>
            )}
          </Button>

        </div>
      </div>

      {/* Collapsible Filters Section */}
      {showFilters && <Collapsible open={true} onOpenChange={setFiltersOpen}>
        <Card>
          <CollapsibleTrigger asChild>
          </CollapsibleTrigger>
          <CollapsibleContent style={{ marginTop: '20px' }}>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Search by Project Name */}
                <div>
                  <Label htmlFor="search">Search Projects</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="search"
                      placeholder="Search by project name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Filter by Client Name */}
                <div>
                  <Label htmlFor="clientFilter">Client Name</Label>
                  <Input
                    id="clientFilter"
                    placeholder="Filter by client name..."
                    value={clientFilter}
                    onChange={(e) => setClientFilter(e.target.value)}
                  />
                </div>

                {/* Filter by Project ID */}
                <div>
                  <Label htmlFor="projectIdFilter">Project Code</Label>
                  <Input
                    id="projectIdFilter"
                    placeholder="Filter by project code..."
                    value={projectIdFilter}
                    onChange={(e) => setProjectIdFilter(e.target.value)}
                  />
                </div>

                {/* Filter by Status */}
                <div>
                  <Label htmlFor="statusFilter">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filter by Priority */}
                <div>
                  <Label htmlFor="priorityFilter">Priority</Label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Button */}
                <div className="flex items-end gap-2">
                  <Button
                    onClick={handleRefreshProjects}
                    className="w-full flex items-center gap-2"
                    disabled={loading}
                  >
                    <Search className="h-4 w-4" />
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                  <Button variant="outline" onClick={handleClearFilters} className="w-full">
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>}

      <div className="flex gap-2 mb-4">
        <Button onClick={handleRefreshProjects} variant="outline">
          Refresh Projects
        </Button>
        <div className="text-sm text-gray-500 flex items-center">
          Showing {filteredProjects.length} of {pagination.total} projects
          {searchTerm || clientFilter || statusFilter !== 'all' || priorityFilter !== 'all' ? ' (filtered)' : ''}
        </div>
      </div>

      <div className="grid gap-6">
        {loading && (
          <div className="text-center py-8 text-gray-500">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-gray-300" />
            Loading projects...
          </div>
        )}
        {filteredProjects.length > 0 && !loading ? (
          filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-xl">{project.project_name}</h3>
                        <Badge className={getProjectStatusColor(project.project_status)}>
                          {project.project_status?.replace('_', ' ').toUpperCase() || 'Not Set'}
                        </Badge>
                        {project.priority && (
                          <Badge className={getPriorityColor(project.priority)}>
                            {project.priority.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        Project Code: {project.project_code || project.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        Type: {Array.isArray(project.project_type) && project.project_type.length > 0
                          ? project.project_type.map(type => type.name || type).join(', ')
                          : (typeof project.project_type === 'string' ? project.project_type : 'Not specified')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/project/${project.id}`)}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProject(project)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>

                  {/* Project Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                    {/* Client Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">Client <button className="text-blue-500 px-2 py-1 text-xs" onClick={() => { setEditingProject(project); setShowAddClientModal(true) }}>+ Add Client</button></span>
                      </div>
                      <div className="text-sm">
                        {project.all_clients && project.all_clients.length > 0 ? (
                          project.all_clients.slice(0, 3).map((client, index) => (
                            <>
                              <p className="font-medium">{index + 1}. {client.name || 'Client Not Assigned'}</p>
                            </>
                          ))
                        ) : (
                          <p className="font-medium">{project.client_name || 'Client Not Assigned'}</p>
                        )}
                        {project.all_clients.length > 3 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <p className="font-medium">+{project.all_clients.length - 3}</p>
                              </TooltipTrigger>
                              <TooltipContent>
                                {project.all_clients.slice(3).map((client, index) => (
                                  <p className="font-medium">{index + 4}. {client.name || 'Client Not Assigned'}</p>
                                ))}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">Timeline</span>
                      </div>
                      <div className="text-sm">
                        <p>Start: {formatDate(project.start_date)}</p>
                        <p>End: {formatDate(project.end_date)}</p>
                        {project.duration && (
                          <p className="text-gray-500">{project.duration} days</p>
                        )}
                      </div>
                    </div>

                    {/* Budget & Hours */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Budget & Hours</span>
                      </div>
                      <div className="text-sm">
                        <p>Budget: {formatCurrency(project.estimated_budget, project.budget_currency)}</p>
                        <p>Budget Hours: {project.budgeted_hours ? `${project.budgeted_hours}` : "0"}</p>
                        <p >
                          Logged Hours: {project.logged_hours ? `${project.logged_hours}` : '0'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
                    <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                    {project.tags && (
                      <div className="flex gap-1">
                        {project.tags.split(',').slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag.trim()}
                          </Badge>
                        ))}
                        {project.tags.split(',').length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.tags.split(',').length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            {projects.length === 0 ? (
              <>
                <p>No projects found in the database.</p>
                <p className="text-sm mt-2">
                  Try adding a new project or check the database connection.
                </p>
                <p className="text-xs mt-2 text-blue-600">
                  Check the browser console for detailed logs.
                </p>
              </>
            ) : (
              <>
                <p>No projects match the current filters.</p>
                <p className="text-sm mt-2">
                  Try adjusting your search criteria or clear all filters.
                </p>
                <Button variant="outline" onClick={handleClearFilters} className="mt-4">
                  Clear All Filters
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
            {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === pagination.current_page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-8 h-8"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page >= pagination.last_page}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      <AddProjectForm
        open={addProjectModalOpen}
        onOpenChange={() => {
          setAddProjectModalOpen(false);
          handleRefreshProjects();
        }}
        onSubmitForAdmin={(val) => handleProjectSubmit(val)}
      />

      <AddClientModal
        open={showAddClientModal}
        onOpenChange={() => setShowAddClientModal(false)}
        onSubmitForAdmin={(val) => handleProjectSubmit(val)}
        project={editingProject}
      />

      <EditProjectForm
        loadProjects={handleRefreshProjects}
        open={editProjectModalOpen}
        onOpenChange={() => {
          setEditProjectModalOpen(false);
          handleRefreshProjects();
        }}
        onSubmit={(val) => handleEditProjectSubmit(val)}
        project={editingProject}
      />


    </div>
  );
};
