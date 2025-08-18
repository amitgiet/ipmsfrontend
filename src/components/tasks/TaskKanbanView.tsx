
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckSquare, Clock, Trash2, Edit, Play, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'to_do' | 'in_progress' | 'completed';
  assignedTo?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

interface TaskKanbanViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: 'to_do' | 'in_progress' | 'completed') => void;
  onLogTime: (task: Task) => void;
  userRole?: string;
}

const statusColumns = [
  { id: 'to_do', title: 'To Do', status: 'to_do' as const },
  { id: 'in_progress', title: 'In Progress', status: 'in_progress' as const },
  { id: 'completed', title: 'Completed', status: 'completed' as const },
];

export const TaskKanbanView: React.FC<TaskKanbanViewProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onUpdateTaskStatus,
  onLogTime,
  userRole
}) => {
  const { toast } = useToast();
  const { currentUser } = useUserRole();
  const currentUserEmail = currentUser?.email || currentUser?.name || '';

  const getTasksForStatus = (status: 'to_do' | 'in_progress' | 'completed') => {
    return tasks.filter(task => task.status === status);
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed') {
      return <CheckSquare className="h-4 w-4 text-green-600" />;
    }
    return <Clock className="h-4 w-4 text-orange-600" />;
  };

  const handleStatusChange = (taskId: string, newStatus: 'to_do' | 'in_progress' | 'completed') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Check if user is assigned to this task
    if (task.assignedTo && task.assignedTo !== currentUserEmail) {
      toast({
        title: "Permission Denied",
        description: "You can only change the status of tasks assigned to you",
        variant: "destructive",
      });
      return;
    }

    // Business logic restrictions
    if ((task.status === 'in_progress' || task.status === 'completed') && newStatus === 'to_do') {
      console.log('❌ Cannot move task back to "to do" from', task.status);
      return; // Prevent the status change
    }

    onUpdateTaskStatus(taskId, newStatus);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statusColumns.map(column => {
        const columnTasks = getTasksForStatus(column.status);
        
        return (
          <div key={column.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-gray-900">{column.title}</h3>
              <Badge variant="outline" className="text-sm">
                {columnTasks.length}
              </Badge>
            </div>
            
            <div className="space-y-3 min-h-[400px] bg-gray-50 rounded-lg p-3">
              {columnTasks.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No tasks in {column.title.toLowerCase()}</p>
                </div>
              ) : (
                columnTasks.map((task) => {
                  const canChangeStatus = !task.assignedTo || task.assignedTo === currentUserEmail;
                  
                  return (
                    <Card key={task.id} className="bg-white hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 flex-1">
                              {getStatusIcon(task.status)}
                              <h4 className="font-medium text-sm text-gray-900 break-words">
                                {task.title}
                              </h4>
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                              {/* Only show log time button for in_progress tasks */}
                              {task.status === 'in_progress' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onLogTime(task)}
                                  className="h-8 w-8 p-0"
                                  title="Log Time"
                                >
                                  <Clock className="h-3 w-3" />
                                </Button>
                              )}
                              {userRole !== 'developer' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEditTask(task)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDeleteTask(task.id)}
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                          
                          {task.description && (
                            <p className="text-xs text-gray-600 break-words">
                              {task.description}
                            </p>
                          )}
                          
                          {task.assignedTo && (
                            <p className="text-xs text-gray-500">
                              Assigned to: {task.assignedTo}
                            </p>
                          )}

                          {task.created_by && (
                            <p className="text-xs text-gray-500">
                              Created by: {task.created_by}
                            </p>
                          )}
                          
                          {/* Status change buttons - only show if user can change status */}
                          {canChangeStatus && (
                            <div className="flex gap-1 flex-wrap">
                              {task.status === 'to_do' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(task.id, 'in_progress')}
                                  className="text-xs h-6"
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  Start
                                </Button>
                              )}
                              {task.status === 'in_progress' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(task.id, 'completed')}
                                  className="text-xs h-6"
                                >
                                  <CheckSquare className="h-3 w-3 mr-1" />
                                  Complete
                                </Button>
                              )}
                              {task.status === 'completed' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(task.id, 'in_progress')}
                                  className="text-xs h-6"
                                >
                                  <ArrowRight className="h-3 w-3 mr-1" />
                                  Reopen
                                </Button>
                              )}
                            </div>
                          )}

                          {!canChangeStatus && task.assignedTo && (
                            <p className="text-xs text-orange-600">
                              Status can only be changed by assigned user: {task.assignedTo}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
