import React, { useState, useEffect, useCallback } from 'react';
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
import { format } from 'date-fns';

export const EditProjectForm = ({ open, onOpenChange, project, onSubmit, loadProjects }) => {
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
    projectStatus: '',
    projectType: [], // Store as array
    projectNature: [], // Store as array
    documents: '',
    documentFiles: [],
    existingDocuments: [], // Store existing documents from API
    removedDocumentIds: [], // Track removed document IDs
    milestones: [], // Store as array
    clientDependencies: '',
    estimatedBudget: '',
    budgetCurrency: 'USD',
    priority: '',
    budgetedHours: '',
    loggedHours: '',
    tagsLabels: '',
  });

  const [errors, setErrors] = useState({});

  // Auto-calculate end date when start date or duration changes
  useEffect(() => {
    if (formData.startDate && formData.duration && !isNaN(Number(formData.duration))) {
      const calculatedEndDate = calculateEndDate(formData.startDate, Number(formData.duration));

      // Only update if the calculated end date is different from the current one
      if (!formData.endDate || calculatedEndDate.getTime() !== formData.endDate.getTime()) {
        setFormData(prev => ({ ...prev, endDate: calculatedEndDate }));
      }
    }
  }, [formData.startDate, formData.duration]);

  useEffect(() => {
    if (project && open) {
      // Map API response structure to form fields
      setFormData({
        projectName: project.project_name || '',
        projectId: project.id || '',
        allClients: project.all_clients && project.all_clients.length > 0 ? project.all_clients.map((client, index) => ({
          id: client.id || index + 1,
          name: client.name || '',
          email: client.email || '',
          phone: client.phone || '',
          backup_contact: client.backup_contact || '',
          is_client_dashboard_access_enabled: client.is_client_dashboard_access_enabled || false
        })) : [],
        duration: project.duration?.toString() || '',
        startDate: project.start_date ? new Date(project.start_date) : undefined,
        endDate: project.end_date ? new Date(project.end_date) : undefined,
        projectStatus: project.project_status || '',
        projectType: project.project_type && project.project_type.length > 0 ? project.project_type.map(type => type.id) : [],
        projectNature: project.project_nature && project.project_nature.length > 0 ? project.project_nature.map(nature => nature.id) : [],
        documents: '',
        documentFiles: [], // New files to upload
        existingDocuments: project.documents || [], // Existing documents from API
        removedDocumentIds: [], // Initialize empty array for removed documents
        milestones: project.milestones && project.milestones.length > 0 ? project.milestones : [],
        clientDependencies: project.client_dependencies || '',
        estimatedBudget: project.estimated_budget?.toString() || '',
        budgetCurrency: project.budget_currency || 'USD',
        priority: project.priority || '',
        budgetedHours: project.budgeted_hours?.toString() || '',
        loggedHours: project.logged_hours?.toString() || '',
        tagsLabels: project.tags || '',
      });
      setErrors({});
    }
  }, [project, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!project) {
      console.error('❌ No project selected for update');
      return;
    }

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
      formDataToSend.append('priority', formData.priority || '');
      formDataToSend.append('status', formData.projectStatus || '');
      formDataToSend.append('duration_days', formData.duration || '');
      formDataToSend.append('start_date', formData.startDate ? formData.startDate.toISOString().split('T')[0] : '');
      formDataToSend.append('end_date', formData.endDate ? formData.endDate.toISOString().split('T')[0] : '');
      formDataToSend.append('estimated_budget', formData.estimatedBudget || '');
      formDataToSend.append('currency', formData.budgetCurrency || 'USD');
      formDataToSend.append('budgeted_hours', formData.budgetedHours || '');
      formDataToSend.append('logged_hours', formData.loggedHours || '');
      formDataToSend.append('client_dependencies', formData.clientDependencies || '');
      formDataToSend.append('tags', formData.tagsLabels || '');
      
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
      formDataToSend.append('_method', 'put');

      // Handle new document files - append each document file
      if (formData.documentFiles && formData.documentFiles.length > 0) {
        formData.documentFiles.forEach((file, index) => {
          if (file instanceof File) {
            formDataToSend.append('documents[]', file);
          } else {
          }
        });
      }

      // Handle removed documents - send IDs to remove them
      if (formData.removedDocumentIds && formData.removedDocumentIds.length > 0) {
        formData.removedDocumentIds.forEach((docId, index) => {
          formDataToSend.append('remove_document_ids[]', docId);
        });
      }

      let toastId = toast.loading("Updating project...");
      // Make API call to update project
      const response = await projectService.updateProject(project.id, formDataToSend);

      if (response.success) {
        toast.update(toastId, {
          render: "Project updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
        });
      
        onOpenChange();
      } else {
        // Handle API validation errors
        if (response.errors) {
          // Map API field names to form field names
          const apiErrors = {};
          Object.keys(response.errors).forEach(apiField => {
            let formField = apiField;

            // Map API field names to form field names
            switch (apiField) {
              case 'name':
                formField = 'projectName';
                break;
              case 'project_code':
                formField = 'projectId';
                break;
              case 'type':
                formField = 'projectType';
                break;
              case 'status':
                formField = 'projectStatus';
                break;
              case 'client_name':
                formField = 'clientName';
                break;
              case 'client_email':
                formField = 'clientEmail';
                break;
              case 'client_phone':
                formField = 'clientPhone';
                break;
              case 'backup_contact':
                formField = 'backupContact';
                break;
              case 'is_client_dashboard_access_enabled':
                formField = 'allowClientAccess';
                break;
              case 'duration_days':
                formField = 'duration';
                break;
              case 'start_date':
                formField = 'startDate';
                break;
              case 'end_date':
                formField = 'endDate';
                break;
              case 'estimated_budget':
                formField = 'estimatedBudget';
                break;
              case 'budgeted_hours':
                formField = 'budgetedHours';
                break;
              case 'logged_hours':
                formField = 'loggedHours';
                break;
              case 'client_dependencies':
                formField = 'clientDependencies';
                break;
              case 'tags_labels':
                formField = 'tagsLabels';
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
            render: response.message || "Failed to update project. Please try again.",
            type: "error",
            isLoading: false,
            autoClose: 5000,
            closeOnClick: true,
          });
        }
      }

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.");
    } finally {
      loadProjects();
      setIsSubmitting(false);
    }
  };

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]); // Add errors to dependencies

  // Handle removing existing documents
  const handleRemoveExistingDocument = useCallback((documentId) => {
    setFormData(prev => ({
      ...prev,
      existingDocuments: prev.existingDocuments.filter(doc => doc.id !== documentId),
      removedDocumentIds: [...prev.removedDocumentIds, documentId]
    }));
  }, []);

  if (!project) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <ProjectInfoSection
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
              isEditMode={true}
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
            {/* Existing Documents Display */}
            {formData.existingDocuments && formData.existingDocuments.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Existing Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formData.existingDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-medium ">
                            {doc.name.split('.').pop()?.toUpperCase() || 'FILE'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 break-words" style={{ width: '250px' }}>{doc.name.length > 60 ? doc.name.slice(0, 25) + '...' : doc.name}</p>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            View File
                          </a>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveExistingDocument(doc.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <AdditionalDetailsSection
              formData={formData}
              onInputChange={handleInputChange}
            />


          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button type="submit" size="lg" className="px-12" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 