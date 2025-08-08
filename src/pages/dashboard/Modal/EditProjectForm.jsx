import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { PROJECT_TYPES, PROJECT_STATUSES, PRIORITIES, CURRENCIES } from '@/constants/projectConstants';
import { calculateEndDate } from '@/utils/dateCalculations';

export const EditProjectForm = ({ open, onOpenChange, project, onSubmit }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    project_name: '',
    project_id: '',
    project_status: '',
    project_type: '',
    priority: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    backup_contact: '',
    allow_client_access: false,
    estimated_budget: '',
    budget_currency: 'USD',
    budgeted_hours: '',
    logged_hours: '',
    start_date: undefined,
    end_date: undefined,
    duration: '',
    documents: '',
    milestones: '',
    client_dependencies: '',
    tags_labels: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Auto-calculate end date when start date or duration changes
  useEffect(() => {
    if (formData.start_date && formData.duration && !isNaN(Number(formData.duration))) {
      const endDate = calculateEndDate(formData.start_date, Number(formData.duration));
      setFormData(prev => ({ ...prev, end_date: endDate }));
    }
  }, [formData.start_date, formData.duration]);

  useEffect(() => {
    if (project && open) {
      console.log('📝 Setting form data for project:', project.id);
      setFormData({
        project_name: project.project_name || '',
        project_id: project.project_id || '',
        project_status: project.project_status || '',
        project_type: project.project_type || '',
        priority: project.priority || '',
        client_name: project.client_name || '',
        client_email: project.client_email || '',
        client_phone: project.client_phone || '',
        backup_contact: project.backup_contact || '',
        allow_client_access: project.allow_client_access || false,
        estimated_budget: project.estimated_budget?.toString() || '',
        budget_currency: project.budget_currency || 'USD',
        budgeted_hours: project.actual_budget_used?.toString() || '', // Using actual_budget_used field for budgeted hours
        logged_hours: project.logged_hours?.toString() || '',
        start_date: project.start_date ? new Date(project.start_date) : undefined,
        end_date: project.end_date ? new Date(project.end_date) : undefined,
        duration: project.duration?.toString() || '',
        documents: project.documents || '',
        milestones: project.milestones || '',
        client_dependencies: project.client_dependencies || '',
        tags_labels: project.tags_labels || '',
      });
      setErrors({});
    }
  }, [project, open]);

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.project_status) {
      newErrors.project_status = 'Project status is required';
    }

    if (!formData.project_type) {
      newErrors.project_type = 'Project type is required';
    }

    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }

    if (!formData.client_name.trim()) {
      newErrors.client_name = 'Client name is required';
    }

    if (!formData.client_email.trim()) {
      newErrors.client_email = 'Client email is required';
    } else if (!isValidEmail(formData.client_email)) {
      newErrors.client_email = 'Please enter a valid email address';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project) {
      console.error('❌ No project selected for update');
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive"
      });
      return;
    }

    console.log('🔄 Starting project update for:', project.id);
    setLoading(true);
    
    try {
      const updateData = {
        project_name: formData.project_name.trim(),
        project_id: formData.project_id.trim(),
        project_status: formData.project_status,
        project_type: formData.project_type,
        priority: formData.priority,
        client_name: formData.client_name.trim(),
        client_email: formData.client_email.trim(),
        client_phone: formData.client_phone.trim() || null,
        backup_contact: formData.backup_contact.trim() || null,
        allow_client_access: formData.allow_client_access,
        estimated_budget: formData.estimated_budget ? parseFloat(formData.estimated_budget) : null,
        budget_currency: formData.budget_currency,
        actual_budget_used: formData.budgeted_hours ? parseFloat(formData.budgeted_hours) : null,
        logged_hours: formData.logged_hours ? parseFloat(formData.logged_hours) : null,
        start_date: formData.start_date ? format(formData.start_date, 'yyyy-MM-dd') : null,
        end_date: formData.end_date ? format(formData.end_date, 'yyyy-MM-dd') : null,
        duration: formData.duration ? parseInt(formData.duration) : null,
        documents: formData.documents || null,
        milestones: formData.milestones || null,
        client_dependencies: formData.client_dependencies || null,
        tags_labels: formData.tags_labels || null,
        updated_at: new Date().toISOString(),
      };

      console.log('📤 Sending update data:', updateData);

      // Mock API call - replace with your actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      console.log('✅ Project updated successfully:', updateData);

      // Handle client access (mock)
      if (formData.client_email) {
        console.log('🔑 Syncing client project access...');
        // Mock client access sync
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('✅ Client project access synced successfully');
      }

      toast({
        title: "Success",
        description: "Project updated successfully",
      });

      onSubmit();
      onOpenChange(false);
    } catch (error) {
      console.error('❌ Unexpected error during update:', error);
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!project) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Project</DialogTitle>
          <DialogDescription>
            Update the project details below. Project ID: {project.id}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Project Name & Project ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project_name">Project Name</Label>
                <Input
                  id="project_name"
                  value={formData.project_name}
                  onChange={(e) => handleInputChange('project_name', e.target.value)}
                  placeholder="Enter project name"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project_id">Project ID</Label>
                <Input
                  id="project_id"
                  value={formData.project_id}
                  onChange={(e) => handleInputChange('project_id', e.target.value)}
                  placeholder="Enter project ID"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Project Type & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Project Type *</Label>
                <Select 
                  value={formData.project_type} 
                  onValueChange={(value) => handleInputChange('project_type', value)}
                  disabled={loading}
                >
                  <SelectTrigger className={errors.project_type ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.project_type && <p className="text-sm text-red-500">{errors.project_type}</p>}
              </div>

              <div className="space-y-2">
                <Label>Priority *</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => handleInputChange('priority', value)}
                  disabled={loading}
                >
                  <SelectTrigger className={errors.priority ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.priority && <p className="text-sm text-red-500">{errors.priority}</p>}
              </div>
            </div>

            {/* Project Status */}
            <div className="space-y-2">
              <Label>Project Status *</Label>
              <Select 
                value={formData.project_status} 
                onValueChange={(value) => handleInputChange('project_status', value)}
                disabled={loading}
              >
                <SelectTrigger className={errors.project_status ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.project_status && <p className="text-sm text-red-500">{errors.project_status}</p>}
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_name">Client Name *</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => handleInputChange('client_name', e.target.value)}
                  placeholder="Enter client name"
                  disabled={loading}
                  className={errors.client_name ? 'border-red-500' : ''}
                />
                {errors.client_name && <p className="text-sm text-red-500">{errors.client_name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_email">Client Email *</Label>
                <Input
                  id="client_email"
                  type="email"
                  value={formData.client_email}
                  onChange={(e) => handleInputChange('client_email', e.target.value)}
                  placeholder="Enter client email"
                  disabled={loading}
                  className={errors.client_email ? 'border-red-500' : ''}
                />
                {errors.client_email && <p className="text-sm text-red-500">{errors.client_email}</p>}
              </div>
            </div>

            {/* Phone and Backup Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_phone">Client Phone</Label>
                <Input
                  id="client_phone"
                  type="tel"
                  value={formData.client_phone}
                  onChange={(e) => handleInputChange('client_phone', e.target.value)}
                  placeholder="Enter client phone number"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup_contact">Backup Contact</Label>
                <Input
                  id="backup_contact"
                  value={formData.backup_contact}
                  onChange={(e) => handleInputChange('backup_contact', e.target.value)}
                  placeholder="Enter backup contact"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Allow Client Access */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="allow_client_access"
                checked={formData.allow_client_access}
                onChange={(e) => handleInputChange('allow_client_access', e.target.checked)}
                className="rounded border-gray-300"
                disabled={loading}
              />
              <Label htmlFor="allow_client_access">Allow Client Access</Label>
              {formData.allow_client_access && (
                <span className="text-sm text-gray-600">(Password: Dots123)</span>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <div className="flex">
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="Enter duration"
                  className={`rounded-r-none ${errors.duration ? 'border-red-500' : ''}`}
                  disabled={loading}
                />
                <div className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md text-sm text-gray-600">
                  days
                </div>
              </div>
              {errors.duration && <p className="text-sm text-red-500">{errors.duration}</p>}
            </div>

            {/* Start Date & End Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={loading}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.start_date && "text-muted-foreground",
                        errors.start_date && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.start_date ? format(formData.start_date, "PPP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.start_date}
                      onSelect={(date) => handleInputChange('start_date', date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.start_date && <p className="text-sm text-red-500">{errors.start_date}</p>}
              </div>

              <div className="space-y-2">
                <Label>End Date (Auto-calculated)</Label>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-gray-50",
                    !formData.end_date && "text-muted-foreground"
                  )}
                  disabled={true}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.end_date ? format(formData.end_date, "PPP") : "Auto-calculated"}
                </Button>
              </div>
            </div>

            {/* Budget Section */}
            <div className="space-y-2">
              <Label>Estimated Budget</Label>
              <div className="flex">
                <Select value={formData.budget_currency} onValueChange={(value) => handleInputChange('budget_currency', value)} disabled={loading}>
                  <SelectTrigger className="w-20 rounded-r-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.estimated_budget}
                  onChange={(e) => handleInputChange('estimated_budget', e.target.value)}
                  placeholder="0.00"
                  className="rounded-l-none"
                  disabled={loading}
                />
                <div className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md text-sm text-gray-600">
                  h
                </div>
              </div>
            </div>

            {/* Budgeted Hours & Logged Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Budgeted Hours</Label>
                <div className="flex">
                  <Input
                    type="number"
                    step="0.5"
                    value={formData.budgeted_hours}
                    onChange={(e) => handleInputChange('budgeted_hours', e.target.value)}
                    placeholder="0"
                    className="rounded-r-none"
                    disabled={loading}
                  />
                  <div className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md text-sm text-gray-600">
                    h
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Logged Hours</Label>
                <div className="flex">
                  <Input
                    type="number"
                    step="0.5"
                    value={formData.logged_hours}
                    onChange={(e) => handleInputChange('logged_hours', e.target.value)}
                    placeholder="0"
                    className="rounded-r-none"
                    disabled={loading}
                  />
                  <div className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md text-sm text-gray-600">
                    h
                  </div>
                </div>
              </div>
            </div>

            {/* Documents & Milestones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="documents">Documents</Label>
                <Textarea
                  id="documents"
                  value={formData.documents}
                  onChange={(e) => handleInputChange('documents', e.target.value)}
                  placeholder="Enter documents"
                  rows={3}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="milestones">Milestones</Label>
                <Textarea
                  id="milestones"
                  value={formData.milestones}
                  onChange={(e) => handleInputChange('milestones', e.target.value)}
                  placeholder="Enter milestones"
                  rows={3}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Client Dependencies */}
            <div className="space-y-2">
              <Label htmlFor="client_dependencies">Client Dependencies</Label>
              <Textarea
                id="client_dependencies"
                value={formData.client_dependencies}
                onChange={(e) => handleInputChange('client_dependencies', e.target.value)}
                placeholder="Enter client dependencies"
                rows={2}
                disabled={loading}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags_labels">Tags / Labels</Label>
              <Input
                id="tags_labels"
                value={formData.tags_labels}
                onChange={(e) => handleInputChange('tags_labels', e.target.value)}
                placeholder="Enter tags"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 