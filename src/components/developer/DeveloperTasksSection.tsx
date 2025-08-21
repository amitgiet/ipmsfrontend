import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Play, CheckCircle, ArrowRight } from 'lucide-react';
import { useDeveloperTasks } from '@/hooks/useDeveloperTasks';
import { useToast } from '@/hooks/use-toast';

interface DeveloperTasksSectionProps {
  currentUserEmail: string;
  onLogTimeClick?: (task: any) => void;
}

export const DeveloperTasksSection = ({ currentUserEmail, onLogTimeClick }: DeveloperTasksSectionProps) => {
  const { tasks, loading, updateTaskStatus } = useDeveloperTasks(currentUserEmail);
  const { toast } = useToast();

  const todoTasks = tasks.filter(task => task.status === 'to_do');
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'to_do':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'to_do':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <Play className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: 'to_do' | 'in_progress' | 'completed') => {
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

    await updateTaskStatus(taskId, newStatus);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Tasks</CardTitle>
          <CardDescription>Tasks assigned to you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const TaskCard = ({ task }: { task: any }) => {
    const canChangeStatus = !task.assignedTo || task.assignedTo === currentUserEmail;
    
    return (
      <div className="p-3 border rounded-lg hover:bg-gray-50">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm">{task.title}</h4>
          <div className="flex items-center gap-1">
            <Badge className={getStatusColor(task.status)}>
              {getStatusIcon(task.status)}
            </Badge>
            {onLogTimeClick && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLogTimeClick(task)}
                className="h-8 w-8 p-0"
                title="Log Time"
              >
                <Clock className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        {task.description && (
          <p className="text-xs text-gray-600 mb-2">{task.description}</p>
        )}
        
        {/* Status change buttons - only show if user can change status */}
        {canChangeStatus && (
          <div className="flex gap-1 mb-2">
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
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange(task.id, 'to_do')}
                  className="text-xs h-6"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  To Do
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange(task.id, 'completed')}
                  className="text-xs h-6"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Complete
                </Button>
              </>
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

        {!canChangeStatus && (
          <p className="text-xs text-gray-500 mb-2">
            Status can only be changed by assigned user: {task.assignedTo}
          </p>
        )}
        
        <p className="text-xs text-gray-500">
          Created: {new Date(task.created_at).toLocaleDateString()}
          {task.created_by && (
            <span className="ml-2">by {task.created_by}</span>
          )}
        </p>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* To Do Tasks */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-600" />
            To Do ({todoTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todoTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No tasks to do</p>
          ) : (
            todoTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </CardContent>
      </Card>

      {/* In Progress Tasks */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Play className="h-5 w-5 text-blue-600" />
            In Progress ({inProgressTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {inProgressTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No tasks in progress</p>
          ) : (
            inProgressTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </CardContent>
      </Card>

      {/* Completed Tasks */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Completed ({completedTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {completedTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No completed tasks</p>
          ) : (
            completedTasks.slice(0, 5).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
          {completedTasks.length > 5 && (
            <p className="text-xs text-gray-500 text-center pt-2">
              And {completedTasks.length - 5} more completed tasks...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
