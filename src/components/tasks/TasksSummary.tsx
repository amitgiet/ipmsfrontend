
import React from 'react';

interface TasksSummaryProps {
  totalTasks: number;
  todoCount: number;
  inProgressCount: number;
  completedCount: number;
}

export const TasksSummary: React.FC<TasksSummaryProps> = ({
  totalTasks,
  todoCount,
  inProgressCount,
  completedCount
}) => {
  return (
    <div className="mt-6 pt-4 border-t">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Total Tasks: {totalTasks}</span>
        <div className="flex items-center gap-4">
          <span>To Do: {todoCount}</span>
          <span>In Progress: {inProgressCount}</span>
          <span>Completed: {completedCount}</span>
        </div>
      </div>
    </div>
  );
};
