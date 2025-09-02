
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, CheckCircle2, AlertCircle, Play, CheckSquare, ArrowRight } from 'lucide-react';
import { useQACreatedTasks } from '@/hooks/useQACreatedTasks';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';

interface QATasksSectionProps {
  currentUserEmail: string;
}

export const QATasksSection: React.FC<QATasksSectionProps> = ({ currentUserEmail }) => {
  const { tasks, loading, refetch } = useQACreatedTasks(currentUserEmail);

  const handleStatusChange = async (taskId: string, newStatus: 'to_do' | 'in_progress' | 'completed') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Check if user is assigned to this task
    const assignedToEmail = typeof task.assigned_to === 'string' ? task.assigned_to : task.assigned_to?.email;
    if (assignedToEmail && assignedToEmail !== currentUserEmail) {
      toast.error("You can only change the status of tasks assigned to you");
      return;
    }

    // Business logic restrictions
    if ((task.status === 'in_progress' || task.status === 'completed') && newStatus === 'to_do') {
   
      return; // Prevent the status change
    }

    try {
      let body = new FormData();
      body.append('status', newStatus);
      body.append('_method', 'patch');

      const { data, error } = await apiCall(allRoutes.tasks.update(taskId), 'patch', body);

      if (error) {
        console.error('❌ Error updating task status:', error);
        return;
      }
 
      
      toast.success("Task status updated successfully");

      // Refresh the tasks
      refetch();
    } catch (error) {
      console.error('❌ Error in handleStatusChange:', error);
        toast.error("Failed to update task status");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'to_do':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      case 'in_progress':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>My Tasks</CardTitle>
          <Badge variant="outline" className="text-sm">
            {tasks.length} tasks
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map((task) => {
              const assignedToEmail = typeof task.assigned_to === 'string' ? task.assigned_to : task.assigned_to?.email;
              const canChangeStatus = !assignedToEmail || assignedToEmail === currentUserEmail;
              
              return (
                <div key={task.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task?.status)}
                      <h3 className="font-medium text-gray-900">{task?.title}</h3>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    {task?.description && (
                      <p className="text-sm text-gray-600">{task?.description}</p>
                    )}

                    {/* Status change buttons - only show if user can change status */}
                    {canChangeStatus && (
                      <div className="flex gap-1 flex-wrap">
                        {task.status === 'to_do' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(task?.id, 'in_progress')}
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

                    {!canChangeStatus && (
                      <p className="text-xs text-gray-500">
                        Status can only be changed by assigned user: {assignedToEmail}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>
                          {assignedToEmail === currentUserEmail ? 'Assigned to me' : `Created by me`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{format(new Date(task.created_at), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {task?.user_stories?.title && (
                        <span><strong>Story:</strong> {task.user_stories.title}</span>
                      )}
                      {task?.user_stories?.projects?.project_name && (
                        <span className="ml-2"><strong>Project:</strong> {task.user_stories.projects.project_name}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No tasks found</p>
            <p className="text-sm">Tasks you create or are assigned to will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
