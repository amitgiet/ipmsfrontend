
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Clock, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'to_do' | 'in_progress' | 'completed';
  assignedTo?: string;
  created_by?: string;
  created_at: string;
}

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: 'to_do' | 'in_progress' | 'completed';
  onMoveTask: (taskId: string, newStatus: 'to_do' | 'in_progress' | 'completed') => void;
  onLogTimeClick: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAssignTask: (task: Task) => void;
  canAssignTasks: boolean;
  canLogTimeToTask: (task: Task) => boolean;
  canMoveTask: (task: Task) => boolean;
  taskDeletePermissions: {[key: string]: boolean};
  canManageTasks: boolean;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  tasks,
  status,
  onMoveTask,
  onLogTimeClick,
  onDeleteTask,
  onAssignTask,
  canAssignTasks,
  canLogTimeToTask,
  canMoveTask,
  taskDeletePermissions,
  canManageTasks
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
        <Badge variant="outline" className="text-sm">
          {tasks.length}
        </Badge>
      </div>
      
      <div className="space-y-3 min-h-[200px] bg-gray-50 rounded-lg p-3">
        {tasks.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No tasks in {title.toLowerCase()}</p>
          </div>
        ) : (
          tasks.map((task) => (
            <Card key={task.id} className="bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm text-gray-900">
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-1">
                      {canAssignTasks && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onAssignTask(task)}
                          className="h-8 w-8 p-0"
                          title="Assign Task"
                        >
                          <User className="h-3 w-3" />
                        </Button>
                      )}
                      {canManageTasks && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onLogTimeClick(task)}
                          className="h-8 w-8 p-0"
                          title="Log Time"
                          disabled={!canLogTimeToTask(task)}
                        >
                          <Clock className="h-3 w-3" />
                        </Button>
                      )}
                      {canManageTasks && taskDeletePermissions[task.id] && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteTask(task.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          title="Delete Task (only if you created it and no time logged)"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className="text-xs text-gray-600">
                      {task.description}
                    </p>
                  )}
                  
                  {task.assignedTo && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600">
                        Assigned to: {task.assignedTo}
                      </span>
                    </div>
                  )}
                  
                  {canManageTasks && status !== 'completed' && canMoveTask(task) && (
                    <div className="flex gap-1">
                      {status === 'to_do' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onMoveTask(task.id, 'in_progress')}
                          className="text-xs h-6"
                        >
                          Start
                        </Button>
                      )}
                      {status === 'in_progress' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onMoveTask(task.id, 'completed')}
                          className="text-xs h-6"
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    {task.created_by && (
                      <span>Created by: {task.created_by}</span>
                    )}
                    <span>{new Date(task.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
