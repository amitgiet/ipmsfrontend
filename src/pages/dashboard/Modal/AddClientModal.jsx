import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState, useEffect, useCallback } from 'react'
import { validateProjectForm } from '@/utils/formValidation'
import { toast } from 'react-toastify'
import { projectService } from '@/services/ProjectService/projectService'
import { ClientInfoSection } from '@/components/forms/ClientInfoSection'
import { Button } from '@/components/ui/button'

const AddClientModal = ({ open, onOpenChange, project, onSubmitForAdmin }) => {

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
        milestones_remove_ids: [],
        estimatedBudget: '',
        budgetCurrency: 'USD',
        priority: '',
        budgetedHours: '',
        loggedHours: '',
        tagsLabels: '',
    });

    const [errors, setErrors] = useState({});


    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
          setErrors(prev => ({ ...prev, [field]: '' }));
        }
      }, [errors]);

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
            console.log("validationErrors", validationErrors);
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
          if(formData.milestones_remove_ids){
            formData.milestones_remove_ids.forEach((milestone_remove_id, index) => {
              formDataToSend.append(`milestones_remove_ids[${index}]`, milestone_remove_id || '');
            });
          }
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
              if(milestone?.id){
                formDataToSend.append(`milestones[${index}][id]`, milestone.id || '');
              }
              formDataToSend.append(`milestones[${index}][deliverable]`, milestone.deliverable || '');
              formDataToSend.append(`milestones[${index}][amount]`, milestone.amount || '');
              formDataToSend.append(`milestones[${index}][currency]`, milestone.currency || '');
              formDataToSend.append(`milestones[${index}][client_dependency]`, milestone.client_dependency || '');
              formDataToSend.append(`milestones[${index}][estimated_completion_date]`, milestone.estimated_completion_date || '');
              formDataToSend.append(`milestones[${index}][name]`, milestone.name || '');
              formDataToSend.append(`milestones[${index}][status]`, milestone.status || '');
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
    
          let toastId = toast.loading("Adding client...");
          // Make API call to update project
          const response = await projectService.updateProject(project.id, formDataToSend);
    
          console.log("response", response);
          if (response.success) {
            toast.update(toastId, {
              render: "Operation completed successfully!",
              type: "success",
              isLoading: false,
              autoClose: 3000,
              closeOnClick: true,
            });
          
            onOpenChange(false);
          } else{
            toast.dismiss(toastId);
          }
    
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.");
        } finally {
          onSubmitForAdmin();
          setIsSubmitting(false);
        }
      };

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
        onSubmitForAdmin();
      }, [project, open]);
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Client</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="space-y-4">
                        <ClientInfoSection
                            formData={formData}
                            errors={errors}
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
    )
}

export default AddClientModal   