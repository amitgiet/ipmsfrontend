
import React from 'react';

interface TasksStatusMessagesProps {
  projectStatus: string;
  sprintStatus: 'created' | 'running' | 'completed';
  userRole: string | null;
  tasksCount: number;
}

export const TasksStatusMessages: React.FC<TasksStatusMessagesProps> = ({
  projectStatus,
  sprintStatus,
  userRole,
  tasksCount
}) => {
  return (
    <>
      {projectStatus !== 'in-progress' && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-3">
          <p className="text-orange-800 text-sm">
            Task creation and updates are only available when the project is in progress.
            Current project status: {projectStatus || 'Unknown'}
          </p>
        </div>
      )}
      {sprintStatus !== 'running' && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-3">
          <p className="text-orange-800 text-sm">
            Task creation, updates, and status changes are only available when the sprint is running.
            Current sprint status: {sprintStatus}
          </p>
        </div>
      )}
      {userRole === 'developer' && tasksCount === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
          <p className="text-blue-800 text-sm">
            No tasks are currently assigned to you for this story.
          </p>
        </div>
      )}
    </>
  );
};
