
import React, { useState, useEffect, useMemo } from 'react';
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

interface Project {
  id: string;
  project_name: string;
  project_id: string | null;
  project_status: string | null;
  project_type: string | null;
  priority: string | null;
  client_name: string | null;
  client_email: string | null;
  allow_client_access: boolean | null;
  estimated_budget: number | null;
  budget_currency: string | null;
  actual_budget_used: number | null;
  budgeted_hours: number | null;
  logged_hours: number | null;
  start_date: string | null;
  end_date: string | null;
  duration: number | null;
  documents: string | null;
  milestones: string | null;
  client_dependencies: string | null;
  tags_labels: string | null;
  created_at: string;
  created_by: string | null;
  progress_percent: number | null;
}

export const AdminProjectsSection = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('');
  const [projectIdFilter, setProjectIdFilter] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [addProjectModalOpen, setAddProjectModalOpen] = useState(false);
  const [editProjectModalOpen, setEditProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  });


  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      console.log("🔄 Fetching projects...");

      try {
        // Prepare API parameters with filters
        const apiParams: { [key: string]: any } = {
          page: pagination.current_page,
          limit: pagination.per_page
        };

        // Add filters to API call if they have values
        if (searchTerm.trim()) {
          apiParams.search = searchTerm.trim();
        }
        if (clientFilter.trim()) {
          apiParams.client_name = clientFilter.trim();
        }
        if (statusFilter !== 'all') {
          apiParams.status = statusFilter;
        }
        if (priorityFilter !== 'all') {
          apiParams.priority = priorityFilter;
        }

        console.log("🔍 API params:", apiParams);

        // Use the project service to fetch projects with filters
        const response = await projectService.getProjects(apiParams);
        
        if (response.success) {
          console.log("✅ Projects fetched successfully:", response.data);
          const projectsData = response.data.data || [];
          const meta = response.data.meta || {};
          
          // Transform the data to match our Project interface if needed
          const transformedProjects = projectsData.map((item: any) => ({
            id: item.id?.toString() || Date.now().toString(),
            project_name: item.name || item.title || item.project_name || 'Untitled Project',
            project_id: item.project_code || item.project_id || item.id?.toString(),
            project_status: item.status || 'planned',
            project_type: item.type || 'Web Development',
            priority: item.priority || 'medium',
            client_name: item.client_name || item.customer_name || 'Unknown Client',
            client_email: item.client_email || item.email || '',
            allow_client_access: item.is_client_dashboard_access_enabled === '1' || item.allow_client_access || false,
            estimated_budget: parseFloat(item.estimated_budget) || 0,
            budget_currency: 'USD',
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
            progress_percent: item.progress_percent || 0
          }));
          
          if (transformedProjects.length === 0) {
            console.log("📊 No projects found in API response");
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
          console.error("❌ Failed to fetch projects:", response.message || response.error);
          // If API fails, show empty state
          console.log("📊 API failed, showing empty state");
          setProjects([]);
          setFilteredProjects([]);
          setPagination({
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0
          });
          toast({
            title: "API Error",
            description: "Failed to fetch projects. Please try again later.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("❌ Error fetching projects:", error);
        // If any error occurs, show empty state
        console.log("📊 Error occurred, showing empty state");
        setProjects([]);
        setFilteredProjects([]);
        setPagination({
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0
        });
        toast({
          title: "Error",
          description: "An error occurred while fetching projects.",
          variant: "destructive"
        });
      }

      setLoading(false);
    };

    loadProjects();
  }, [pagination.current_page, pagination.per_page, searchTerm, clientFilter, statusFilter, priorityFilter]);

  useEffect(() => {
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, current_page: 1 }));
    
    // Apply client-side filtering for immediate UI feedback
    const filtered = projects.filter((project) => {
      const matchesSearch = !searchTerm || 
        project.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.project_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || project.project_status === statusFilter;
      
      const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
      
      const matchesClient = !clientFilter || 
        project.client_name?.toLowerCase().includes(clientFilter.toLowerCase());
      
      const matchesProjectId = !projectIdFilter || 
        project.project_id?.toLowerCase().includes(projectIdFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesPriority && matchesClient && matchesProjectId;
    });
    
    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter, priorityFilter, clientFilter, projectIdFilter]);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm || clientFilter || statusFilter !== 'all' || priorityFilter !== 'all') {
        console.log("🔍 Filters changed, refreshing from API...");
        handleRefreshProjects();
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm, clientFilter, statusFilter, priorityFilter]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      setPagination(prev => ({ ...prev, current_page: newPage }));
    }
  };

  const handleRefreshProjects = () => {
    const loadProjects = async () => {
      setLoading(true);
      console.log("🔄 Refreshing projects...");

      try {
        // Prepare API parameters with filters
        const apiParams: { [key: string]: any } = {
          page: pagination.current_page,
          limit: pagination.per_page
        };

        // Add filters to API call if they have values
        if (searchTerm.trim()) {
          apiParams.search = searchTerm.trim();
        }
        if (clientFilter.trim()) {
          apiParams.client_name = clientFilter.trim();
        }
        if (statusFilter !== 'all') {
          apiParams.status = statusFilter;
        }
        if (priorityFilter !== 'all') {
          apiParams.priority = priorityFilter;
        }

        console.log("🔍 Refresh API params:", apiParams);

        const response = await projectService.getProjects(apiParams);

        if (response.success) {
          console.log("✅ Projects refreshed successfully:", response.data);
          const projectsData = response.data.data || [];
          const meta = response.data.meta || {};
          
          // Transform the data to match our Project interface if needed
          const transformedProjects = projectsData.map((item: any) => ({
            id: item.id?.toString() || Date.now().toString(),
            project_name: item.name || item.title || item.project_name || 'Untitled Project',
            project_id: item.project_code || item.project_id || item.id?.toString(),
            project_status: item.status || 'planned',
            project_type: item.type || 'Web Development',
            priority: item.priority || 'medium',
            client_name: item.client_name || item.customer_name || 'Unknown Client',
            client_email: item.client_email || item.email || '',
            allow_client_access: item.is_client_dashboard_access_enabled === '1' || item.allow_client_access || false,
            estimated_budget: parseFloat(item.estimated_budget) || 0,
            budget_currency: 'USD',
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
            progress_percent: item.progress_percent || 0
          }));
          
          if (transformedProjects.length === 0) {
            console.log("📊 No projects found in refresh response");
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
          console.log("📊 API failed during refresh, showing empty state");
          setProjects([]);
          setFilteredProjects([]);
          setPagination({
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0
          });
          toast({
            title: "API Error",
            description: "Failed to refresh projects. Please try again later.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("❌ Error refreshing projects:", error);
        // If any error occurs, show empty state
        console.log("📊 Error occurred during refresh, showing empty state");
        setProjects([]);
        setFilteredProjects([]);
        setPagination({
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0
        });
        toast({
          title: "Error",
          description: "An error occurred while refreshing projects.",
          variant: "destructive"
        });
      }

      setLoading(false);
    };

    loadProjects();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setClientFilter('');
    setProjectIdFilter('');
    
    // Reset pagination to first page when clearing filters
    setPagination(prev => ({ ...prev, current_page: 1 }));
    
    // Refresh projects with cleared filters
    handleRefreshProjects();
  };

  const handleAddProject = () => {
    console.log('🔘 Add Project button clicked');
    console.log('📊 Current modal state:', addProjectModalOpen);
    setAddProjectModalOpen(true);
    console.log('📊 Modal state set to true');
  };

  const handleProjectSubmit = async (newProject) => {
    try {
      console.log("✅ Project created successfully:", newProject);
      
      // Add the new project to the local state
      const newProjectData = {
        id: newProject.id?.toString() || Date.now().toString(),
        project_name: newProject.name || newProject.project_name || 'Untitled Project',
        project_id: newProject.project_code || newProject.project_id || newProject.id?.toString(),
        project_status: newProject.status || 'planned',
        project_type: newProject.type || 'Web Development',
        priority: newProject.priority || 'medium',
        client_name: newProject.client_name || 'Unknown Client',
        client_email: newProject.client_email || '',
        allow_client_access: newProject.is_client_dashboard_access_enabled || false,
        estimated_budget: newProject.estimated_budget || 0,
        budget_currency: newProject.budget_currency || 'USD',
        actual_budget_used: newProject.actual_budget_used || 0,
        budgeted_hours: newProject.budgeted_hours || 0,
        logged_hours: newProject.logged_hours || 0,
        start_date: newProject.start_date || null,
        end_date: newProject.end_date || null,
        duration: newProject.duration_days || newProject.duration || 0,
        documents: newProject.documents || '',
        milestones: newProject.milestones || '',
        client_dependencies: newProject.client_dependencies || '',
        tags_labels: newProject.tags || newProject.tags_labels || '',
        created_at: newProject.created_at || new Date().toISOString(),
        created_by: newProject.created_by || 'admin',
        progress_percent: newProject.progress_percent || 0
      };

      setProjects(prev => [newProjectData, ...prev]);
      setFilteredProjects(prev => [newProjectData, ...prev]);
      
      toast({
        title: "Success!",
        description: "Project created successfully.",
        variant: "default"
      });
      
    } catch (error) {
      console.error("❌ Error handling project creation:", error);
      toast({
        title: "Error",
        description: "An error occurred while processing the new project.",
        variant: "destructive"
      });
    }
  };

  const handleEditProjectSubmit = async (updatedProject) => {
    try {
      console.log("✅ Project updated successfully:", updatedProject);
      
      // Update the project in local state
      setProjects(prev => prev.map(project => 
        project.id === editingProject?.id ? {
          ...project,
          project_name: updatedProject.name || updatedProject.project_name || project.project_name,
          project_id: updatedProject.project_code || updatedProject.project_id || project.project_id,
          project_status: updatedProject.status || project.project_status,
          project_type: updatedProject.type || project.project_type,
          priority: updatedProject.priority || project.priority,
          client_name: updatedProject.client_name || project.client_name,
          client_email: updatedProject.client_email || project.client_email,
          allow_client_access: updatedProject.is_client_dashboard_access_enabled || project.allow_client_access,
          estimated_budget: updatedProject.estimated_budget || project.estimated_budget,
          budget_currency: updatedProject.budget_currency || project.budget_currency,
          budgeted_hours: updatedProject.budgeted_hours || project.budgeted_hours,
          logged_hours: updatedProject.logged_hours || project.logged_hours,
          start_date: updatedProject.start_date || project.start_date,
          end_date: updatedProject.end_date || project.end_date,
          duration: updatedProject.duration_days || updatedProject.duration || project.duration,
          documents: updatedProject.documents || project.documents,
          milestones: updatedProject.milestones || project.milestones,
          client_dependencies: updatedProject.client_dependencies || project.client_dependencies,
          tags_labels: updatedProject.tags || updatedProject.tags_labels || project.tags_labels
        } : project
      ));
      
      setFilteredProjects(prev => prev.map(project => 
        project.id === editingProject?.id ? {
          ...project,
          project_name: updatedProject.name || updatedProject.project_name || project.project_name,
          project_id: updatedProject.project_code || updatedProject.project_id || project.project_id,
          project_status: updatedProject.status || project.project_status,
          project_type: updatedProject.type || project.project_type,
          priority: updatedProject.priority || project.priority,
          client_name: updatedProject.client_name || project.client_name,
          client_email: updatedProject.client_email || project.client_email,
          allow_client_access: updatedProject.is_client_dashboard_access_enabled || project.allow_client_access,
          estimated_budget: updatedProject.estimated_budget || project.estimated_budget,
          budget_currency: updatedProject.budget_currency || project.budget_currency,
          budgeted_hours: updatedProject.budgeted_hours || project.budgeted_hours,
          logged_hours: updatedProject.logged_hours || project.logged_hours,
          start_date: updatedProject.start_date || project.start_date,
          end_date: updatedProject.end_date || project.end_date,
          duration: updatedProject.duration_days || updatedProject.duration || project.duration,
          documents: updatedProject.documents || project.documents,
          milestones: updatedProject.milestones || project.milestones,
          client_dependencies: updatedProject.client_dependencies || project.client_dependencies,
          tags_labels: updatedProject.tags || updatedProject.tags_labels || project.tags_labels
        } : project
      ));
      
      // Close the edit modal
      setEditProjectModalOpen(false);
      setEditingProject(null);
      
      toast({
        title: "Success!",
        description: "Project updated successfully.",
        variant: "default"
      });
      
    } catch (error) {
      console.error("❌ Error handling project update:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the project.",
        variant: "destructive"
      });
    }
  };

  const handleEditProject = (project: Project) => {
    console.log("Edit project:", project);
    setEditingProject(project);
    setEditProjectModalOpen(true);
  };

  const handleManageProject = (project: Project) => {
    // This would navigate to project management page
    console.log("Manage project:", project);
  };
  
  const getProjectStatusColor = (status: string | null) => {
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

  const getPriorityColor = (priority: string | null) => {
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

  const formatCurrency = (amount: number | null, currency: string | null) => {
    if (!amount) return 'N/A';
    return `${currency || 'USD'} ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects Management</h2>
        <div className="flex gap-2">
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
      <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
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
                  <Label htmlFor="projectIdFilter">Project ID</Label>
                  <Input
                    id="projectIdFilter"
                    placeholder="Filter by project ID..."
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
                <div className="flex items-end">
                  <Button 
                    onClick={handleRefreshProjects} 
                    className="w-full flex items-center gap-2"
                    disabled={loading}
                  >
                    <Search className="h-4 w-4" />
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                </div>

                {/* Clear Filters Button */}
                <div className="flex items-end">
                  <Button variant="outline" onClick={handleClearFilters} className="w-full">
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      
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
                          {project.project_status || 'Not Set'}
                        </Badge>
                        {project.priority && (
                          <Badge className={getPriorityColor(project.priority)}>
                            {project.priority}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        Project ID: {project.project_id || project.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        Type: {project.project_type || 'Not specified'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleManageProject(project)}
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
                        <span className="font-medium">Client</span>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">{project.client_name || 'No client assigned'}</p>
                        {project.client_email && (
                          <p className="text-gray-500">{project.client_email}</p>
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
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">Budget & Hours</span>
                      </div>
                      <div className="text-sm">
                        <p>Budget: {formatCurrency(project.estimated_budget, project.budget_currency)}</p>
                        <p>Used: {formatCurrency(project.actual_budget_used, project.budget_currency)}</p>
                        <p className="text-gray-500">
                          Hours: {project.logged_hours ? `${project.logged_hours}h` : 'None logged'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
                    <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                    {project.tags_labels && (
                      <div className="flex gap-1">
                        {project.tags_labels.split(',').slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag.trim()}
                          </Badge>
                        ))}
                        {project.tags_labels.split(',').length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.tags_labels.split(',').length - 3}
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
        onOpenChange={setAddProjectModalOpen}
        onSubmit={handleProjectSubmit}
      />

      {/* Edit Project Modal */}
      {editingProject && (
        <EditProjectForm
          open={editProjectModalOpen}
          onOpenChange={setEditProjectModalOpen}
          onSubmit={handleEditProjectSubmit}
          project={editingProject}
        />
      )}
    </div>
  );
};
