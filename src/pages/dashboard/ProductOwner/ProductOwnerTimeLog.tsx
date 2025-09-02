
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProductOwnerTimeLogForm } from './ProductOwnerTimeLogForm';
import { toast } from 'react-toastify';
import { productOwnerService } from '@/services/ProductOwner/productOwner';

const VALID_ACTIVITY_TYPES = ['grooming', 'meeting', 'sprint_management', 'planning', 'review'];

export const ProductOwnerTimeLog = ({
  open,
  onClose,
  projects,
  onTimeLogged,
  refetchTimeLogs
}) => {
  const [projectId, setProjectId] = useState('');
  const [activityType, setActivityType] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setProjectId('');
      setActivityType('');
      setDescription('');
      setStartTime('');
      setEndTime('');
    }
  }, [open]);

  // time log submission function
  const submitTimeLog = async (
    projectId: string,
    activityType: string,
    description: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> => {
    setIsSubmitting(true);

    try {
      if (!projectId || !activityType || !startTime || !endTime) {
        throw new Error('Missing required fields');
      }

      // Validate activity type - only these are accepted
      if (!VALID_ACTIVITY_TYPES.includes(activityType)) {
        throw new Error(`Invalid activity type. Only ${VALID_ACTIVITY_TYPES.join(', ')} are allowed.`);
      }

      // Calculate duration
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

      if (durationMinutes <= 0) {
        throw new Error('End time must be after start time');
      }

      // Format time to H:i:s format (add seconds if missing)
      const formatTimeToHIS = (timeString: string) => {
        const [hours, minutes, seconds] = timeString.split(':');
        // If seconds are missing, default to 00
        const formattedSeconds = seconds || '00';
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${formattedSeconds.padStart(2, '0')}`;
      };

      const formattedStartTime = formatTimeToHIS(startTime);
      const formattedEndTime = formatTimeToHIS(endTime);

     const result = await productOwnerService.addTimeLog({
        project_id: projectId,
        activity_type: activityType,
        description: description || null,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        is_project_log: 0,
      });

      setIsSubmitting(false);
      return result.success;
    } catch (error) {
      console.error('Time log submission error:', error);

      // Show error toast
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to submit time log");
      }

      setIsSubmitting(false);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectId || !activityType || !startTime || !endTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate time format (H:i or H:i:s)
    const timeFormatRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
    if (!timeFormatRegex.test(startTime) || !timeFormatRegex.test(endTime)) {
      toast.error("Time must be in format HH:MM or HH:MM:SS (e.g., 17:52 or 17:52:00)");
      return;
    }

    // Validate activity type - only these are accepted
    if (!VALID_ACTIVITY_TYPES.includes(activityType)) {
      toast.error(`Only these activity types are allowed: ${VALID_ACTIVITY_TYPES.join(', ')}`);
      return; // Modal stays open, form doesn't submit
    }

    // Validate time logic
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    if (start >= end) {
      toast.error("End time must be after start time");
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
      toast.success("Time log submitted successfully");
      onTimeLogged();
      refetchTimeLogs();
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
