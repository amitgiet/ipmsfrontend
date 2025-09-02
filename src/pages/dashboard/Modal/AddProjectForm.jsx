import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import { validateProjectForm } from '@/utils/formValidation';
import { calculateEndDate } from '@/utils/dateCalculations';
import { ProjectInfoSection } from '@/components/forms/ProjectInfoSection';
import { ClientInfoSection } from '@/components/forms/ClientInfoSection';
import { DateDurationSection } from '@/components/forms/DateDurationSection';
import { BudgetSection } from '@/components/forms/BudgetSection';
import { AdditionalDetailsSection } from '@/components/forms/AdditionalDetailsSection.tsx';
import { projectService } from '@/services/ProjectService/projectService';

export const AddProjectForm = ({ open, onOpenChange, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    projectId: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    backupContact: '',
    allClients: [], // Store all clients
    allowClientAccess: false,
    duration: '',
    startDate: undefined,
    endDate: undefined,
    projectStatus: 'planned', // Default to planned for new projects
    projectType: '',
    projectNature: '',
    documents: '',
    documentFiles: [],
    milestones: '',
    clientDependencies: '',
    estimatedBudget: '',
    budgetCurrency: 'USD',
    priority: '',
    budgetedHours: '',
    loggedHours: '',
    tagsLabels: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (formData.startDate && formData.duration && !isNaN(Number(formData.duration))) {
      const endDate = calculateEndDate(formData.startDate, Number(formData.duration));
      setFormData(prev => ({ ...prev, endDate }));
    }
  }, [formData.startDate, formData.duration]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    setErrors({}); // Clear previous errors
    
    try {
      // Client-side validation first
      const validationErrors = validateProjectForm(formData);
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        toast.error("Please fill in all required fields correctly.");
        setIsSubmitting(false);
        return;
      }

      // Prepare form data according to the API specification
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.projectName || '');
      formDataToSend.append('project_code', formData.projectId || '');
      formDataToSend.append('type', formData.projectType || '');
      formDataToSend.append('nature', formData.projectNature || '');
      formDataToSend.append('priority', formData.priority || '');
      formDataToSend.append('status', formData.projectStatus || '');
      
      // Handle multiple clients
      if (formData.allClients && formData.allClients.length > 0) {
        // Primary client (first client)
        const primaryClient = formData.allClients[0];
        formDataToSend.append('client_name', primaryClient.name || '');
        formDataToSend.append('client_email', primaryClient.email || '');
        formDataToSend.append('client_phone', primaryClient.phone || '');
        formDataToSend.append('backup_contact', primaryClient.backupContact || '');
        
        // Additional clients (if any)
        if (formData.allClients.length > 1) {
          const additionalClients = formData.allClients.slice(1);
          formDataToSend.append('additional_clients', JSON.stringify(additionalClients));
        }
      } else {
        // Fallback to single client data
        formDataToSend.append('client_name', formData.clientName || '');
        formDataToSend.append('client_email', formData.clientEmail || '');
        formDataToSend.append('client_phone', formData.clientPhone || '');
        formDataToSend.append('backup_contact', formData.backupContact || '');
      }
      
      formDataToSend.append('is_client_dashboard_access_enabled', formData.allowClientAccess ? '1' : '0');
      formDataToSend.append('duration_days', formData.duration || '');
      formDataToSend.append('start_date', formData.startDate ? formData.startDate.toISOString().split('T')[0] : '');
      formDataToSend.append('end_date', formData.endDate ? formData.endDate.toISOString().split('T')[0] : '');
      formDataToSend.append('estimated_budget', formData.estimatedBudget || '');
      formDataToSend.append('budgeted_hours', formData.budgetedHours || '');
      formDataToSend.append('logged_hours', formData.loggedHours || '');
      formDataToSend.append('milestones', formData.milestones || '');
      formDataToSend.append('client_dependencies', formData.clientDependencies || '');
      formDataToSend.append('tags', formData.tagsLabels || '');
      formDataToSend.append('nature', formData.projectNature || '');
      formDataToSend.append('type', formData.projectType || '');
      
      if (formData.documentFiles && formData.documentFiles.length > 0) {
        formData.documentFiles.forEach((file, index) => {
          if (file instanceof File) {
            formDataToSend.append('documents[]', file);
          } else {
          }
        });
      }
      
      // Make API call to create project
      const response = await projectService.createProject(formDataToSend);
      
      if (response.success) {
        
        toast.success("Project created successfully!");
        
        // Call parent's onSubmit with the created project data
        if (onSubmit) {
          onSubmit(response.data);
        }
        
        // Close the modal
        onOpenChange(false);
        
        // Reset form
        setFormData({
          projectName: '',
          projectId: '',
          clientName: '',
          clientEmail: '',
          clientPhone: '',
          backupContact: '',
          allClients: [],
          allowClientAccess: false,
          duration: '',
          startDate: undefined,
          endDate: undefined,
          projectStatus: 'planned', // Reset to planned for new projects
          projectType: '',
          projectNature: '',
          documents: '',
          documentFiles: [],
          milestones: '',
          clientDependencies: '',
          estimatedBudget: '',
          budgetCurrency: 'USD',
          priority: '',
          budgetedHours: '',
          loggedHours: '',
          tagsLabels: '',
        });
        setErrors({});
        
      } else {
        console.error("❌ Failed to create project:", response.message || response.error);
        
        // Handle API validation errors
        if (response.errors) {
          
          // Map API field names to form field names
          const apiErrors = {};
          Object.keys(response.errors).forEach(apiField => {
            let formField = apiField;
            
            // Map API field names to form field names
            switch (apiField) {
              case 'duration_days':
                formField = 'duration';
                break;
              case 'end_date':
                formField = 'endDate';
                break;
              case 'start_date':
                formField = 'startDate';
                break;
              case 'project_code':
                formField = 'projectId';
                break;
              case 'is_client_dashboard_access_enabled':
                formField = 'allowClientAccess';
                break;
              default:
                formField = apiField;
            }
            
            apiErrors[formField] = response.errors[apiField][0]; // Take first error message
          });
          
          setErrors(apiErrors);
          
          toast.error(response.message || "Please fix the validation errors below.");
        } else {
          // General API error
          toast.error(response.message || "Failed to create project. Please try again.");
        }
      }
      
    } catch (error) {
      console.error('❌ Error in form submission:', error);
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <ProjectInfoSection 
              formData={formData} 
              errors={errors} 
              onInputChange={handleInputChange}
              isEditMode={false}
            />
            
            <ClientInfoSection 
              formData={formData} 
              errors={errors} 
              onInputChange={handleInputChange} 
            />
            
            <DateDurationSection 
              formData={formData} 
              errors={errors} 
              onInputChange={handleInputChange} 
            />
            
            <BudgetSection 
              formData={formData} 
              onInputChange={handleInputChange}
              errors={errors}
            />
            
            <AdditionalDetailsSection 
              formData={formData} 
              onInputChange={handleInputChange} 
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button type="submit" size="lg" className="px-12" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 