
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
import { apiCall } from '@/services/apiCall';
import { useToast } from '@/hooks/use-toast';
import { AddProjectForm } from '@/pages/dashboard/Modal/AddProjectForm';

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
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [projectIdFilter, setProjectIdFilter] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [addProjectModalOpen, setAddProjectModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  });

  // Demo data for when no projects are available
  const demoProjects = useMemo<Project[]>(() => [
    {
      id: '1',
      project_name: 'E-commerce Platform Redesign',
      project_id: 'ECOM-001',
      project_status: 'in-progress',
      project_type: 'Web Development',
      priority: 'high',
      client_name: 'TechCorp Solutions',
      client_email: 'contact@techcorp.com',
      allow_client_access: true,
      estimated_budget: 50000,
      budget_currency: 'USD',
      actual_budget_used: 25000,
      logged_hours: 120,
      start_date: '2024-01-15',
      end_date: '2024-06-30',
      duration: 165,
      documents: 'Requirements, Design Mockups',
      milestones: 'Design Phase, Development Phase, Testing Phase',
      client_dependencies: 'Content approval, Payment schedule',
      tags_labels: 'ecommerce, redesign, responsive',
      created_at: '2024-01-10T10:00:00Z',
      created_by: 'admin',
      progress_percent: 45
    },
    {
      id: '2',
      project_name: 'Mobile App Development',
      project_id: 'MOBILE-002',
      project_status: 'planned',
      project_type: 'Mobile Development',
      priority: 'medium',
      client_name: 'InnovateMobile Inc',
      client_email: 'dev@innovatemobile.com',
      allow_client_access: true,
      estimated_budget: 75000,
      budget_currency: 'USD',
      actual_budget_used: 0,
      logged_hours: 0,
      start_date: '2024-03-01',
      end_date: '2024-08-31',
      duration: 180,
      documents: 'App Requirements, UI/UX Design',
      milestones: 'Design, Development, Testing, Launch',
      client_dependencies: 'App store approval',
      tags_labels: 'mobile, ios, android, react-native',
      created_at: '2024-02-15T14:30:00Z',
      created_by: 'admin',
      progress_percent: 0
    },
    {
      id: '3',
      project_name: 'Website Migration Project',
      project_id: 'WEB-003',
      project_status: 'completed',
      project_type: 'Web Development',
      priority: 'low',
      client_name: 'Global Enterprises',
      client_email: 'it@globalenterprises.com',
      allow_client_access: false,
      estimated_budget: 30000,
      budget_currency: 'USD',
      actual_budget_used: 28000,
      logged_hours: 200,
      start_date: '2023-11-01',
      end_date: '2024-01-31',
      duration: 90,
      documents: 'Migration Plan, Backup Strategy',
      milestones: 'Planning, Migration, Testing, Go-live',
      client_dependencies: 'DNS changes, Content review',
      tags_labels: 'migration, wordpress, seo',
      created_at: '2023-10-15T09:15:00Z',
      created_by: 'admin',
      progress_percent: 100
    },
    {
      id: '4',
      project_name: 'CRM System Integration',
      project_id: 'CRM-004',
      project_status: 'on-hold',
      project_type: 'System Integration',
      priority: 'high',
      client_name: 'SalesForce Pro',
      client_email: 'integration@salesforcepro.com',
      allow_client_access: true,
      estimated_budget: 45000,
      budget_currency: 'USD',
      actual_budget_used: 15000,
      logged_hours: 80,
      start_date: '2024-02-01',
      end_date: '2024-05-31',
      duration: 120,
      documents: 'API Documentation, Integration Specs',
      milestones: 'Analysis, Development, Testing, Deployment',
      client_dependencies: 'API access, User training',
      tags_labels: 'crm, integration, api',
      created_at: '2024-01-20T16:45:00Z',
      created_by: 'admin',
      progress_percent: 25
    },
    {
      id: '5',
      project_name: 'Data Analytics Dashboard',
      project_id: 'DATA-005',
      project_status: 'in-progress',
      project_type: 'Data Analytics',
      priority: 'medium',
      client_name: 'DataInsight Corp',
      client_email: 'analytics@datainsight.com',
      allow_client_access: true,
      estimated_budget: 35000,
      budget_currency: 'USD',
      actual_budget_used: 20000,
      logged_hours: 150,
      start_date: '2024-01-01',
      end_date: '2024-04-30',
      duration: 120,
      documents: 'Data Requirements, Dashboard Mockups',
      milestones: 'Data Analysis, Dashboard Development, Testing',
      client_dependencies: 'Data access, User feedback',
      tags_labels: 'analytics, dashboard, bi',
      created_at: '2023-12-15T11:20:00Z',
      created_by: 'admin',
      progress_percent: 60
    }
  ], []);

  // Fetch projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      console.log("🔄 Fetching projects...");

      try {
        const result = await apiCall(`/projects?page=1`, "get");

        if (result.success) {
          console.log("✅ Projects fetched successfully:", result.data);
          const projectsData = result.data.data || result.data || [];
          const meta = result.data.meta || {};
          
          // If no projects returned, use demo data
          if (projectsData.length === 0) {
            console.log("📊 No projects found, using demo data");
            setProjects(demoProjects);
            setFilteredProjects(demoProjects);
            setPagination({
              current_page: 1,
              last_page: 1,
              per_page: 10,
              total: demoProjects.length
            });
            toast({
              title: "Demo Mode",
              description: "No projects found. Showing demo data.",
              variant: "default",
            });
          } else {
            setProjects(projectsData);
            setFilteredProjects(projectsData);
            setPagination({
              current_page: meta.current_page || 1,
              last_page: meta.last_page || 1,
              per_page: meta.per_page || 10,
              total: meta.total || 0
            });
          }
        } else {
          console.error("❌ Failed to fetch projects:", result.error);
          // If API fails, use demo data
          console.log("📊 Using demo data instead");
          setProjects(demoProjects);
          setFilteredProjects(demoProjects);
          setPagination({
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: demoProjects.length
          });
          toast({
            title: "Demo Mode",
            description: "Showing demo data. API connection failed.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("❌ Error fetching projects:", error);
        // If any error occurs, use demo data
        console.log("📊 Using demo data due to error");
        setProjects(demoProjects);
        setFilteredProjects(demoProjects);
        setPagination({
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: demoProjects.length
        });
        toast({
          title: "Demo Mode",
          description: "Showing demo data. Error occurred while fetching projects.",
          variant: "default",
        });
      }

      setLoading(false);
    };

    loadProjects();
  }, []);

  // Filter projects when search or filters change
  useEffect(() => {
    const filtered = projects.filter((project) => {
      const matchesSearch = !searchTerm || 
        project.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.project_id?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || statusFilter === 'all' || 
        project.project_status?.toLowerCase() === statusFilter.toLowerCase();
      
      const matchesPriority = !priorityFilter || priorityFilter === 'all' || 
        project.priority?.toLowerCase() === priorityFilter.toLowerCase();
      
      const matchesClient = !clientFilter || 
        project.client_name?.toLowerCase().includes(clientFilter.toLowerCase());
      
      const matchesProjectId = !projectIdFilter || 
        project.project_id?.toLowerCase().includes(projectIdFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesPriority && matchesClient && matchesProjectId;
    });
    
    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter, priorityFilter, clientFilter, projectIdFilter]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      // For demo data, just update the current page
      if (projects === demoProjects) {
        setPagination(prev => ({ ...prev, current_page: newPage }));
      } else {
        // For real data, would need to implement pagination
        console.log("Pagination not implemented for real data yet");
      }
    }
  };

  const handleRefreshProjects = () => {
    // Reload projects
    const loadProjects = async () => {
      setLoading(true);
      console.log("🔄 Refreshing projects...");

      try {
        const result = await apiCall(`/projects?page=1`, "get");

        if (result.success) {
          console.log("✅ Projects refreshed successfully:", result.data);
          const projectsData = result.data.data || result.data || [];
          const meta = result.data.meta || {};
          
          if (projectsData.length === 0) {
            console.log("📊 No projects found, using demo data");
            setProjects(demoProjects);
            setFilteredProjects(demoProjects);
            setPagination({
              current_page: 1,
              last_page: 1,
              per_page: 10,
              total: demoProjects.length
            });
            toast({
              title: "Demo Mode",
              description: "No projects found. Showing demo data.",
              variant: "default",
            });
          } else {
            setProjects(projectsData);
            setFilteredProjects(projectsData);
            setPagination({
              current_page: meta.current_page || 1,
              last_page: meta.last_page || 1,
              per_page: meta.per_page || 10,
              total: meta.total || 0
            });
          }
        } else {
          console.error("❌ Failed to refresh projects:", result.error);
          setProjects(demoProjects);
          setFilteredProjects(demoProjects);
          setPagination({
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: demoProjects.length
          });
          toast({
            title: "Demo Mode",
            description: "Showing demo data. API connection failed.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("❌ Error refreshing projects:", error);
        setProjects(demoProjects);
        setFilteredProjects(demoProjects);
        setPagination({
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: demoProjects.length
        });
        toast({
          title: "Demo Mode",
          description: "Showing demo data. Error occurred while refreshing projects.",
          variant: "default",
        });
      }

      setLoading(false);
    };

    loadProjects();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPriorityFilter('');
    setClientFilter('');
    setProjectIdFilter('');
  };

  const handleAddProject = () => {
    setAddProjectModalOpen(true);
  };

  const handleProjectSubmit = (newProject) => {
    // Add the new project to the list
    const projectWithId = {
      ...newProject,
      id: newProject.id || Date.now().toString(),
      created_at: newProject.created_at || new Date().toISOString(),
      created_by: newProject.created_by || 'admin'
    };
    
    setProjects(prev => [projectWithId, ...prev]);
    setFilteredProjects(prev => [projectWithId, ...prev]);
    
    toast({
      title: "Success",
      description: `Project "${newProject.projectName}" created successfully!`,
    });
    
    setAddProjectModalOpen(false);
  };

  const handleEditProject = (project: Project) => {
    // This would open edit modal or navigate to edit page
    console.log("Edit project:", project);
  };

  const handleManageProject = (project: Project) => {
    // This would navigate to project management page
    console.log("Manage project:", project);
  };
  
  const getProjectStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'planned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'on-hold':
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
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
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

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Projects Management</h2>
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects Management</h2>
        <Button onClick={handleAddProject}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
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
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
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
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
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
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      </div>
      
      <div className="grid gap-6">
        {filteredProjects.length > 0 ? (
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

      <AddProjectForm
        isOpen={addProjectModalOpen}
        onClose={() => setAddProjectModalOpen(false)}
        onSubmit={handleProjectSubmit}
      />
    </div>
  );
};
