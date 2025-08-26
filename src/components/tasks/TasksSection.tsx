import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, User, Clock, AlertTriangle } from 'lucide-react';
import { useStoryTasks } from '@/hooks/useStoryTasks';
import { useUserRole } from '@/hooks/useUserRole';
import { AddTaskDialog } from './AddTaskDialog';
import { EditTaskDialog } from './EditTaskDialog';
import { AssignTaskDialog } from './AssignTaskDialog';
import { LogTimeDialog } from './LogTimeDialog';
import { TasksContent } from './TasksContent';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'to_do' | 'in_progress' | 'completed';
  created_by?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  assigned_to?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  created_at: string;
  updated_at: string;
}

interface TasksSectionProps {
  storyId: string;
  projectId: string;
  canEdit?: boolean;
}

export const TasksSection: React.FC<TasksSectionProps> = ({
  storyId,
  projectId,
  canEdit = true
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showTimeDialog, setShowTimeDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const { userRole } = useUserRole();



  // Use the useStoryTasks hook for all task operations
  const { tasks, loading, addTask, updateTask, deleteTask, updateAssignee } = useStoryTasks(storyId);

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowEditDialog(true);
  };

  const handleAssignTask = (task: Task) => {
    setSelectedTask(task);
    setShowAssignDialog(true);
  };

  const handleLogTime = async (task: Task) => {
    setSelectedTask(task);
    setShowTimeDialog(true);
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: 'to_do' | 'in_progress' | 'completed') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    await updateTask(taskId, {
      title: task.title,
      description: task.description || '',
      status: newStatus,
      assignedTo: task.assigned_to?.id || task.assigned_to?.id?.toString()
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Tasks ({tasks.length})
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
                <Button
                  variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('kanban')}
                >
                  Board
                </Button>
              </div>
              {canEdit && (
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No tasks created yet</p>
              {canEdit && (
                <Button
                  onClick={() => setShowAddDialog(true)}
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Task
                </Button>
              )}
            </div>
          ) : viewMode === 'kanban' ? (
            <TasksContent
              tasks={tasks}
              userRole={userRole}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onLogTime={handleLogTime}
            />
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <Badge className={getStatusColor(task.status)} variant="outline">
                          {task.status?.replace('_', ' ')}
                        </Badge>
                        {task.assigned_to && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <User className="h-3 w-3" />
                            Assigned to: {task.assigned_to.name} ({task.assigned_to.email})
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(task.created_at), 'MMM dd')}
                        </div>
                      </div>
                    </div>
                    {canEdit && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTask(task)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAssignTask(task)}
                        >
                          Assign
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLogTime(task)}
                        >
                          Log Time
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>


      {/* Dialogs */}
      {canEdit && (
        <>
          <AddTaskDialog
            open={showAddDialog}
            onClose={() => setShowAddDialog(false)}
            onAdd={async (taskData) => {
              await addTask(taskData);
              setShowAddDialog(false);
            }}
            projectId={projectId}
          />

          <EditTaskDialog
            open={showEditDialog}
            task={selectedTask!}
            onClose={() => setShowEditDialog(false)}
            onUpdate={async (taskId, taskData) => {
              await updateTask(taskId, taskData);
              setShowEditDialog(false);
            }}
          />

          <AssignTaskDialog
            open={showAssignDialog}
            taskTitle={selectedTask?.title || ''}
            currentAssignee={selectedTask?.assignedTo?.id || ''}
            onClose={() => setShowAssignDialog(false)}
            onAssign={async (assignee) => {
              await updateAssignee(selectedTask?.id || '', assignee, projectId);
              setShowAssignDialog(false);
            }}
          />

          <LogTimeDialog
            open={showTimeDialog}
            onClose={() => setShowTimeDialog(false)}
            onLogTime={async () => {
              setShowTimeDialog(false);
            }}
            taskTitle={selectedTask?.title || ''}
            taskAssignedTo={selectedTask?.assigned_to?.email || selectedTask?.assignedTo}
            currentUserEmail=""
            userRole=""
          />
        </>
      )}
    </div>
  );
};