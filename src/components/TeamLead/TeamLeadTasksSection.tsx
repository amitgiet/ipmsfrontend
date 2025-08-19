
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTeamLeadCreatedTasks } from '@/hooks/useTeamLeadCreatedTasks';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { Play, CheckSquare, ArrowRight, Clock } from 'lucide-react';

interface TeamLeadTasksSectionProps {
  currentUserEmail: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'to_do':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'to_do':
      return 'To Do';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    default:
      return status;
  }
};

export const TeamLeadTasksSection = ({ currentUserEmail }: TeamLeadTasksSectionProps) => {
  const { tasks, loading, refetch } = useTeamLeadCreatedTasks(currentUserEmail);
  const { toast } = useToast();

  const handleStatusChange = async (taskId: string, newStatus: 'to_do' | 'in_progress' | 'completed') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Check if user is assigned to this task
    if (task.assigned_to && task.assigned_to !== currentUserEmail) {
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

    try {
      console.log('🔄 Updating task status:', taskId, newStatus);

      const { error } = await supabase
        .from('story_tasks')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) {
        console.error('❌ Error updating task status:', error);
        toast({
          title: "Error",
          description: "Failed to update task status",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Task status updated successfully');
      
      toast({
        title: "Success",
        description: "Task status updated successfully",
      });

      // Refresh the tasks
      refetch();
    } catch (error) {
      console.error('❌ Error in handleStatusChange:', error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Tasks</CardTitle>
          <CardDescription>Loading tasks you've created...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Tasks</CardTitle>
        <CardDescription>
          Tasks you've created across all projects ({tasks.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            You haven't created any tasks yet.
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => {
              const canChangeStatus = !task.assigned_to || task.assigned_to === currentUserEmail;
              
              return (
                <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Story: {task.user_stories.title}
                      </p>
                      <p className="text-sm text-blue-600">
                        Project: {task.user_stories.projects.project_name}
                      </p>
                    </div>
                    <Badge className={getStatusColor(task.status)}>
                      {getStatusLabel(task.status)}
                    </Badge>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-gray-700 mb-2">{task.description}</p>
                  )}

                  {/* Status change buttons - only show if user can change status */}
                  {canChangeStatus && (
                    <div className="flex gap-1 flex-wrap mb-2">
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

                  {!canChangeStatus && (
                    <p className="text-xs text-gray-500 mb-2">
                      Status can only be changed by assigned user: {task.assigned_to}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div>
                      {task.assigned_to && (
                        <span>Assigned to: {task.assigned_to}</span>
                      )}
                    </div>
                    <div>
                      Created {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
