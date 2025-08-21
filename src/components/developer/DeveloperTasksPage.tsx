
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DeveloperHeader } from '@/components/DeveloperHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Play, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useDeveloperTasks } from '@/hooks/useDeveloperTasks';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const DeveloperTasksPage = () => {
  const { user, teamUser, logout } = useAuth();
  const currentUser = user || teamUser;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { tasks, loading, updateTaskStatus } = useDeveloperTasks(currentUser?.email || '');

  if (!currentUser) {
    return null;
  }

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
    if (task.assignedTo && task.assignedTo !== currentUser.email) {
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

    await updateTaskStatus(taskId, newStatus);
  };

  const handleNavigateToStory = async (storyId: string) => {
    // We need to find the project ID for this story
    // For now, we'll navigate to a generic story details page
    // In a real implementation, you'd want to fetch the project ID from the story
    navigate(`/project/placeholder/story/${storyId}/details`);
  };

  const todoTasks = tasks.filter(task => task.status === 'to_do');
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DeveloperHeader currentUser={currentUser} onLogout={logout} />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DeveloperHeader currentUser={currentUser} onLogout={logout} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-gray-600">All tasks assigned to you</p>
          </div>
        </div>

        {tasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks assigned</h3>
              <p className="text-gray-500">You don't have any tasks assigned to you yet.</p>
            </CardContent>
          </Card>
        ) : (
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
                  todoTasks.map((task) => {
                    const canChangeStatus = !task.assignedTo || task.assignedTo === currentUser.email;
                    
                    return (
                      <div key={task.id} className="p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          <Badge className={getStatusColor(task.status)}>
                            {getStatusIcon(task.status)}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                        )}
                        {canChangeStatus && (
                          <div className="flex gap-1 mb-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleNavigateToStory(task.story_id)}
                              className="text-xs h-6"
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Start
                            </Button>
                          </div>
                        )}
                        {!canChangeStatus && (
                          <p className="text-xs text-orange-600 mb-2">
                            Status can only be changed by assigned user: {task.assignedTo}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Created: {new Date(task.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    );
                  })
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
                  inProgressTasks.map((task) => {
                    const canChangeStatus = !task.assignedTo || task.assignedTo === currentUser.email;
                    
                    return (
                      <div key={task.id} className="p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          <Badge className={getStatusColor(task.status)}>
                            {getStatusIcon(task.status)}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                        )}
                        {canChangeStatus && (
                          <div className="flex gap-1 mb-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleNavigateToStory(task.story_id)}
                              className="text-xs h-6"
                            >
                              <Play className="h-3 w-3 mr-1" />
                              View Story
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
                          </div>
                        )}
                        {!canChangeStatus && (
                          <p className="text-xs text-orange-600 mb-2">
                            Status can only be changed by assigned user: {task.assignedTo}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Created: {new Date(task.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    );
                  })
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
                  completedTasks.map((task) => {
                    const canChangeStatus = !task.assignedTo || task.assignedTo === currentUser.email;
                    
                    return (
                      <div key={task.id} className="p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          <Badge className={getStatusColor(task.status)}>
                            {getStatusIcon(task.status)}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                        )}
                        {canChangeStatus && (
                          <div className="flex gap-1 mb-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleNavigateToStory(task.story_id)}
                              className="text-xs h-6"
                            >
                              <Play className="h-3 w-3 mr-1" />
                              View Story
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(task.id, 'in_progress')}
                              className="text-xs h-6"
                            >
                              <ArrowRight className="h-3 w-3 mr-1" />
                              Reopen
                            </Button>
                          </div>
                        )}
                        {!canChangeStatus && (
                          <p className="text-xs text-orange-600 mb-2">
                            Status can only be changed by assigned user: {task.assignedTo}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Created: {new Date(task.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};
