import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { validateProjectForm } from '@/utils/formValidation';
import { calculateEndDate } from '@/utils/dateCalculations';
import { ProjectInfoSection } from '@/components/forms/ProjectInfoSection';
import { ClientInfoSection } from '@/components/forms/ClientInfoSection';
import { DateDurationSection } from '@/components/forms/DateDurationSection';
import { BudgetSection } from '@/components/forms/BudgetSection';
import { AdditionalDetailsSection } from '@/components/forms/AdditionalDetailsSection.tsx';

export const AddProjectForm = ({ open, onOpenChange, onSubmit }) => {
  const { toast } = useToast();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('📝 Form submitted with data:', formData);
    
    if (isSubmitting) {
      console.log('⏳ Already submitting, ignoring...');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const validationErrors = validateProjectForm(formData);
      console.log('🔍 Validation result:', validationErrors);
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields correctly.",
          variant: "destructive"
        });
        return;
      }
      
      // Mock API call - replace with your actual API call
      console.log('🚀 Creating project...');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      // Mock project data
      const mockProjectData = {
        id: Date.now().toString(),
        ...formData,
        created_at: new Date().toISOString(),
        created_by: 'admin'
      };

      // Handle file uploads if there are any
      if (formData.documentFiles.length > 0) {
        console.log('📁 Uploading project documents...');
        console.log('📄 Selected files:', formData.documentFiles.map(f => f.name));
        // Mock file upload
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Prepare success message
      let successMessage = `Project "${formData.projectName}" created successfully!`;
      
      if (formData.clientEmail && formData.clientName) {
        if (formData.allowClientAccess) {
          successMessage += ' Client profile created and access granted with default password: Dots123';
        } else {
          successMessage += ' Client profile created (access can be enabled later)';
        }
      }
      
      if (formData.documentFiles.length > 0) {
        successMessage += ` ${formData.documentFiles.length} document(s) selected for upload.`;
      }

      toast({
        title: "Success",
        description: successMessage,
      });

      onSubmit(mockProjectData);
      onOpenChange(false);
      
      // Reset form
      setFormData({
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
    } catch (error) {
      console.error('❌ Error creating project:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
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