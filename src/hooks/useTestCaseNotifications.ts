
import { useEffect } from 'react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';

export const useTestCaseNotifications = () => {
  const { toast } = useToast();
  const { currentUser } = useUserRole();

  const createTaskAssignmentNotification = async (
    taskData: {
      id: string;
      title: string;
      assignedTo: string;
      storyId: string;
    }
  ) => {
    try {
      // Get story and project information
      const { data: storyData, error: storyError } = await apiCall(allRoutes.stories.get(taskData.storyId), 'get');

      if (storyError) {
        console.error('Error fetching story data for notification:', storyError);
        return;
      }

      // Get assigned user details
      const { data: assignedUser, error: userError } = await apiCall(allRoutes.teamMembers.get(taskData.assignedTo), 'get');

      if (userError) {
        console.error('Error fetching assigned user:', userError);
        return;
      }

      // Create notification
      const { error: notificationError } = await apiCall(allRoutes.notifications.create, 'post', {
          user_id: assignedUser.id,
          user_email: assignedUser.email,
          title: 'New Task Assigned',
          message: `Task "${taskData.title}" has been assigned to you in story "${storyData.title}" (Project: ${(storyData.projects as any).project_name})`,
          type: 'task_assigned',
          project_id: storyData.project_id,
          story_id: taskData.storyId
        });

      if (notificationError) {
        console.error('Error creating task assignment notification:', notificationError);
      } else {
        console.log('✅ Task assignment notification created');
      }
    } catch (error) {
      console.error('❌ Error in createTaskAssignmentNotification:', error);
    }
  };

  return {
    createTaskAssignmentNotification
  };
};
