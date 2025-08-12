
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProductOwnerTimeLogForm } from './ProductOwnerTimeLogForm';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  project_name: string;
}

interface ProductOwnerTimeLogProps {
  open: boolean;
  onClose: () => void;
  projects: Project[];
  productOwnerEmail: string;
  onTimeLogged: () => void;
}

export const ProductOwnerTimeLog: React.FC<ProductOwnerTimeLogProps> = ({
  open,
  onClose,
  projects,
  productOwnerEmail,
  onTimeLogged
}) => {
  const [projectId, setProjectId] = useState('');
  const [activityType, setActivityType] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setProjectId('');
      setActivityType('');
      setDescription('');
      setStartTime('');
      setEndTime('');
    }
  }, [open]);

  // Demo time log submission function
  const submitTimeLog = async (
    projectId: string,
    activityType: string,
    description: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> => {
    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Demo validation
      if (!projectId || !activityType || !startTime || !endTime) {
        throw new Error('Missing required fields');
      }

      // Calculate duration
      const start = new Date(startTime);
      const end = new Date(endTime);
      const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

      if (durationMinutes <= 0) {
        throw new Error('End time must be after start time');
      }

      // Demo success response
      const demoTimeLog = {
        id: Date.now().toString(),
        product_owner_email: productOwnerEmail,
        project_id: projectId,
        activity_type: activityType,
        description: description || null,
        start_time: startTime,
        end_time: endTime,
        duration_minutes: durationMinutes,
        logged_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        projects: {
          project_name: projects.find(p => p.id === projectId)?.project_name || 'Unknown Project'
        }
      };

      console.log('Demo time log submitted:', demoTimeLog);
      
      toast({
        title: "Success",
        description: `Time logged successfully: ${durationMinutes} minutes`,
      });

      setIsSubmitting(false);
      return true;
    } catch (error) {
      console.error('Demo time log submission error:', error);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit time log",
        variant: "destructive",
      });

      setIsSubmitting(false);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectId || !activityType || !startTime || !endTime) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const success = await submitTimeLog(
      projectId,
      activityType,
      description,
      startTime,
      endTime
    );

    if (success) {
      // Call the callback to notify parent component
      onTimeLogged();
      // Form will be reset when dialog closes due to the effect
      onClose();
    }
  };

  const handleClose = () => {
    setProjectId('');
    setActivityType('');
    setDescription('');
    setStartTime('');
    setEndTime('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Log Time</DialogTitle>
          <DialogDescription>
            Record time spent on project activities
          </DialogDescription>
        </DialogHeader>
        
        <ProductOwnerTimeLogForm
          projects={projects}
          projectId={projectId}
          setProjectId={setProjectId}
          activityType={activityType}
          setActivityType={setActivityType}
          description={description}
          setDescription={setDescription}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};
