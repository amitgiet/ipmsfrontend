
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Plus, CheckSquare } from 'lucide-react';
import { PermissionWrapper } from '@/components/common/PermissionWrapper';

interface TasksHeaderProps {
  userRole: string | null;
  onAddTask: () => void;
  isAddDisabled: boolean;
}

export const TasksHeader: React.FC<TasksHeaderProps> = ({
  userRole,
  onAddTask,
  isAddDisabled
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          {userRole === 'developer' ? 'My Tasks' : 'Tasks'}
        </CardTitle>
        <CardDescription>
          {userRole === 'developer' 
            ? 'Tasks assigned to you'
            : 'Break down the story into manageable tasks'
          }
        </CardDescription>
      </div>
      <PermissionWrapper action="createTask">
        <Button 
          onClick={onAddTask}
          disabled={isAddDisabled}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </PermissionWrapper>
    </div>
  );
};
