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
import { format } from 'date-fns';

export const EditProjectForm = ({ open, onOpenChange, project, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    projectId: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    backupContact: '',
    allowClientAccess: false,
    duration: '',
    startDate: undefined,
    endDate: undefined,
    projectStatus: '',
    projectType: '',
    documents: '',
    documentFiles: [],
    existingDocuments: [], // Store existing documents from API
    removedDocumentIds: [], // Track removed document IDs
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

  // Auto-calculate end date when start date or duration changes
  useEffect(() => {
    if (formData.startDate && formData.duration && !isNaN(Number(formData.duration))) {
      const endDate = calculateEndDate(formData.startDate, Number(formData.duration));
      setFormData(prev => ({ ...prev, endDate }));
    }
  }, [formData.startDate, formData.duration]);

  // Load project data when modal opens
  useEffect(() => {
    if (project && open) {
      console.log('📝 Setting form data for project:', project.id);
      console.log('📝 Project data:', project);
      console.log('🔍 Available project fields:', Object.keys(project));
      console.log('🔍 Budget hours field:', project.budgeted_hours);
      console.log('🔍 Budget hours field (alternative):', project.budgetedHours, project.budgeted_hours);
      
      // Map API response structure to form fields
      setFormData({
        projectName: project.project_name || '',
        projectId: project.project_id || '',
        clientName: project.client_name || '',
        clientEmail: project.client_email || '',
        clientPhone: project.client_phone || '',
        backupContact: project.backup_contact || '',
        allowClientAccess: project.allow_client_access || false,
        duration: project.duration?.toString() || '',
        startDate: project.start_date ? new Date(project.start_date) : undefined,
        endDate: project.end_date ? new Date(project.end_date) : undefined,
        projectStatus: project.project_status || '',
        projectType: project.project_type || '',
        documents: '',
        documentFiles: [], // New files to upload
        existingDocuments: project.documents || [], // Existing documents from API
        removedDocumentIds: [], // Initialize empty array for removed documents
        milestones: project.milestones || '',
        clientDependencies: project.client_dependencies || '',
        estimatedBudget: project.estimated_budget?.toString() || '',
        budgetCurrency: project.budget_currency || 'USD',
        priority: project.priority || '',
        
        budgetedHours: project.budgeted_hours?.toString() || project.budgetedHours?.toString() || '',
        loggedHours: project.logged_hours?.toString() || project.loggedHours?.toString() || '',
        tagsLabels: project.tags_labels || '',
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
    
    console.log('📝 Form submitted with data:', formData);
    
    if (isSubmitting) {
      console.log('⏳ Already submitting, ignoring...');
      return;
    }
    
    setIsSubmitting(true);
    setErrors({}); // Clear previous errors
    
    try {
      // Client-side validation first
      const validationErrors = validateProjectForm(formData);
      console.log('🔍 Client validation result:', validationErrors);
      
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
      formDataToSend.append('priority', formData.priority || '');
      formDataToSend.append('status', formData.projectStatus || '');
      formDataToSend.append('client_name', formData.clientName || '');
      formDataToSend.append('client_email', formData.clientEmail || '');
      formDataToSend.append('client_phone', formData.clientPhone || '');
      formDataToSend.append('backup_contact', formData.backupContact || '');
      formDataToSend.append('_method', 'put');
      formDataToSend.append('is_client_dashboard_access_enabled', formData.allowClientAccess ? '1' : '0');
      formDataToSend.append('duration_days', formData.duration || '');
      formDataToSend.append('start_date', formData.startDate ? formData.startDate.toISOString().split('T')[0] : '');
      formDataToSend.append('end_date', formData.endDate ? formData.endDate.toISOString().split('T')[0] : '');
      formDataToSend.append('estimated_budget', formData.estimatedBudget || '');
      formDataToSend.append('budgeted_hours', formData.budgetedHours || '');
      formDataToSend.append('logged_hours', formData.loggedHours || '');
      formDataToSend.append('milestones', formData.milestones || '');
      formDataToSend.append('client_dependencies', formData.clientDependencies || '');
      formDataToSend.append('tags_labels', formData.tagsLabels || '');
      
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

      // Make API call to update project
      const response = await projectService.updateProject(project.id, formDataToSend);
      
      if (response.success) {
        console.log("✅ Project updated successfully:", response.data);
        
        toast.success("Project updated successfully!");
        
        // Call parent's onSubmit with the updated project data
        if (onSubmit) {
          onSubmit(response.data);
        }
        
        // Close the modal
        onOpenChange(false);
        
      } else {
        console.error("❌ Failed to update project:", response.message || response.error);
        
        // Handle API validation errors
        if (response.errors) {
          console.log("📋 API validation errors:", response.errors);
          
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
          
          toast.error(response.message || "Please fix the validation errors below.");
        } else {
          // General API error
          toast.error(response.message || "Failed to update project. Please try again.");
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
    console.log('🔄 Input changed:', field, value);
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle removing existing documents
  const handleRemoveExistingDocument = (documentId) => {
    console.log(`🗑️ Removing document with ID: ${documentId}`);
    setFormData(prev => ({
      ...prev,
      existingDocuments: prev.existingDocuments.filter(doc => doc.id !== documentId),
      removedDocumentIds: [...prev.removedDocumentIds, documentId]
    }));
  };

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
                          <span className="text-blue-600 text-sm font-medium">
                            {doc.name.split('.').pop()?.toUpperCase() || 'FILE'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
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