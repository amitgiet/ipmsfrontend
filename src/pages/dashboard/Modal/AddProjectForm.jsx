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

export const AddProjectForm = ({ open, onOpenChange, onSubmitForAdmin }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    projectId: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    backupContact: '',
    allClients: [], // Store all clients as array
    allowClientAccess: false,
    duration: '',
    startDate: undefined,
    endDate: undefined,
    projectStatus: 'planned', 
    projectType: [], // Store as array
    projectNature: [], // Store as array
    documents: '',
    documentFiles: [],
    milestones: [], // Store as array
    milestoneNotes: '',
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
      formDataToSend.append('project_code', formData.projectId || '');  // Assuming projectId is the project code in the API        
      formDataToSend.append('priority', formData.priority || '');
      formDataToSend.append('status', formData.projectStatus || '');
      formDataToSend.append('duration_days', formData.duration || '');
      formDataToSend.append('start_date', formData.startDate ? formData.startDate.toISOString().split('T')[0] : '');
      formDataToSend.append('end_date', formData.endDate ? formData.endDate.toISOString().split('T')[0] : '');
      formDataToSend.append('estimated_budget', formData.estimatedBudget || '');
      formDataToSend.append('budgeted_hours', formData.budgetedHours || '');
      formDataToSend.append('currency', formData.budgetCurrency || 'USD');
      formDataToSend.append('logged_hours', formData.loggedHours || '');
      if(formData.projectType){
         formData.projectType.forEach((type, index) => {
          formDataToSend.append(`types[${index}]`, type || '');
         });
      }
      if(formData.projectNature){
        formData.projectNature.forEach((nature, index) => { 
          formDataToSend.append(`natures[${index}]`, nature || '');
        });
      }
      if(formData.allClients && formData.allClients.length > 0){
        formData.allClients.forEach((client, index) => {
          formDataToSend.append(`client[${index}][name]`, client.name || '');
          formDataToSend.append(`client[${index}][email]`, client.email || '');
          formDataToSend.append(`client[${index}][phone]`, client.phone || '');
          formDataToSend.append(`client[${index}][backup_contact]`, client.backup_contact || '');
          formDataToSend.append(`client[${index}][is_client_dashboard_access_enabled]`, client.is_client_dashboard_access_enabled ? '1' : '0');
        });
      }
      if( formData.milestones && formData.milestones.length > 0){
        formData.milestones.forEach((milestone, index) => {
          formDataToSend.append(`milestones[${index}][deliverable]`, milestone.deliverable || '');
          formDataToSend.append(`milestones[${index}][amount]`, milestone.amount || '');
          formDataToSend.append(`milestones[${index}][currency]`, milestone.currency || '');
          formDataToSend.append(`milestones[${index}][client_dependency]`, milestone.client_dependency || '');
          formDataToSend.append(`milestones[${index}][estimated_completion_date]`, milestone.estimated_completion_date || '');
          formDataToSend.append(`milestones[${index}][name]`, milestone.name || '');
        });
      } 
      formDataToSend.append('client_dependencies', formData.clientDependencies || '');
      formDataToSend.append('tags', formData.tagsLabels || '');
      
      if (formData.documentFiles && formData.documentFiles.length > 0) {
        formData.documentFiles.forEach((file, index) => {
          if (file instanceof File) {
            formDataToSend.append('documents[]', file);
          } else {
          }
        });
      }
      
      let toastId = toast.loading("Creating project...");
      // Make API call to create project
      const response = await projectService.createProject(formDataToSend);
      
      if (response.success) {
        
        toast.update(toastId, {
          render: "Operation completed successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
        });   
        
        // Call parent's onSubmit with the created project data
        if (onSubmitForAdmin) {
          onSubmitForAdmin(response.data);
        }
        
        // Close the modal
        onOpenChange();
        
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
          projectType: [],
          projectNature: [],
          documents: '',
          documentFiles: [],
          milestones: [],
          milestoneNotes: '',
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
          
          toast.update(toastId, {
            render: response.message || "Please fix the validation errors below.",
            type: "error",
            isLoading: false,
            autoClose: 5000,
            closeOnClick: true,
          });
        } else {
          // General API error
          toast.update(toastId, {
            render: response.message || "Failed to create project. Please try again.",
            type: "error",
            isLoading: false,
            autoClose: 5000,
            closeOnClick: true,
          });
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

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={()=>onOpenChange()}>
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