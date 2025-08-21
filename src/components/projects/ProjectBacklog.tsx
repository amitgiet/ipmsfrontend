
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { User, Eye, FileEdit, Download } from 'lucide-react';
import { BacklogControls } from '@/components/backlog/BacklogControls.tsx';
import { UserStoryCard } from '@/components/backlog/UserStoryCard.tsx';
import { ChangeRequestDialog } from '@/components/backlog/ChangeRequestDialog.tsx';
import { ChangeRequestsSection } from '@/components/backlog/ChangeRequestsSection.tsx';
import { useBacklogData } from '@/components/backlog/useBacklogData.ts';
// import { useUserRole } from '@/hooks/useUserRole.tsx';
import { useAuth } from '@/hooks/useAuth.jsx';
// import { useSRSDownload } from '@/hooks/useSRSDownload.tsx';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { toast } from 'react-toastify';

interface UserStory {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'to_do' | 'in_grooming' | 'ready' | 'ready_for_estimate';
  storyPoints?: number;
  projectId: string;
}

interface ProjectBacklogProps {
  projectId: string;
  onUserStoryAdded?: (userStory: UserStory) => void;
  readOnly?: boolean;
  projectName?: string;
}

export const ProjectBacklog = ({ projectId, onUserStoryAdded, readOnly = false, projectName = 'Project' }: ProjectBacklogProps) => {
  const { userStories, setUserStories, loading, loadUserStories } = useBacklogData(projectId);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [showChangeRequestDialog, setShowChangeRequestDialog] = useState(false);
  const [showChangeRequests, setShowChangeRequests] = useState(false);
  const { user, teamUser } = useAuth();
  const currentUser = user || teamUser;

  const userRole = localStorage.getItem('ipms_userRole');
  // const { downloadSRS, isGenerating } = useSRSDownload();

  // Check if user can edit (product owners) or review change requests
  const canEdit = userRole === 'product_owner';
  const canReviewChangeRequests = userRole === 'product_owner';
  const canSubmitChangeRequests = userRole === 'client'; // Only clients can submit change requests

  // Listen for user stories added from mindmap
  useEffect(() => {
    const handleUserStoryAdded = (event: CustomEvent) => {
      loadUserStories();
    };

    window.addEventListener('userStoryAdded', handleUserStoryAdded as EventListener);

    return () => {
      window.removeEventListener('userStoryAdded', handleUserStoryAdded as EventListener);
    };
  }, [loadUserStories]);

  const addManualStory = async () => {
    if (!newStoryTitle.trim() || !canEdit) return;

    try {
      const { data, error } = await apiCall(allRoutes.stories.create, 'post', {
        title: newStoryTitle,
        priority: 'medium',
        status: 'to_do',
        type: 'project-backlog',
        project_id: projectId,
      });

      if (error) {
        console.error('❌ Error adding user story:', error);
        toast.error("Failed to add user story");
        return;
      }

      const newStory: UserStory = {
        id: data?.data?.id,
        title: data?.data?.title,
        description: data?.data?.description || undefined,
        priority: data?.data?.priority as 'low' | 'medium' | 'high' | 'urgent',
        status: data?.data?.status as 'to_do' | 'in_grooming' | 'ready' | 'ready_for_estimate',
        storyPoints: data?.data?.story_points || undefined,
        projectId: data?.data?.project_id,
      };

      setUserStories(prev => [newStory, ...prev]);
      setNewStoryTitle('');

      if (onUserStoryAdded) {
        onUserStoryAdded(newStory);
      }

      toast.success("User story added successfully");
    } catch (error) {
      console.error('❌ Error adding user story:', error);
      toast.error("Failed to add user story");
    }
  };

  const updateStoryStatus = async (storyId: string, newStatus: UserStory['status']) => {
    if (!canEdit) return;
    console.log('Status update requested but will be handled by business logic later:', { storyId, newStatus });
  };

  const updateStoryPriority = async (storyId: string, newPriority: UserStory['priority']) => {
    if (!canEdit) return;

    try {
      const { error } = await apiCall(allRoutes.stories.update(storyId), 'post', {
        priority: newPriority,
        project_id: projectId,
        _method: 'patch'
      });

      if (error) {
        console.error('❌ Error updating story priority:', error);
        toast.error("Failed to update story priority");
        return;
      }

      setUserStories(prev => prev.map(story =>
        story.id === storyId ? { ...story, priority: newPriority } : story
      ));

      toast.success("Story priority updated");
    } catch (error) {
      console.error('❌ Error updating story priority:', error);
      toast.error("Failed to update story priority");
    }
  };

  const deleteStory = async (storyId: string) => {
    if (!canEdit) return;
    const { success } = await apiCall(allRoutes.stories.delete(storyId, projectId), 'delete');
    if (success) {
      setUserStories(prev => prev.filter(story => story.id !== storyId));
      toast.success("Story deleted successfully");
    }
  };

  const handleDownloadSRS = async () => {
    if (!canEdit || userStories.length === 0) return;

    // await downloadSRS(projectId, projectName, userStories);
  };

  const filteredStories = userStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || story.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Project Backlog
            {readOnly && <Eye className="h-4 w-4 text-gray-500" />}
          </CardTitle>
          <CardDescription>Loading user stories...</CardDescription>
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Project Backlog
                {readOnly && <Eye className="h-4 w-4 text-gray-500" />}
              </CardTitle>
              <CardDescription>
                {readOnly
                  ? "View user stories - Admin view (read-only)"
                  : canEdit
                    ? "Manage user stories and track their progress"
                    : canSubmitChangeRequests
                      ? "View user stories - you can request changes using the change request feature"
                      : "View user stories"
                }
              </CardDescription>
            </div>
            {canEdit && !readOnly && userStories.length > 0 && (
              <Button
                onClick={handleDownloadSRS}
                // disabled={isGenerating}
                className="flex items-center gap-2"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                Download SRS
                {/* {isGenerating ? 'Generating...' : 'Download SRS'} */}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {canEdit && !readOnly && (
              <BacklogControls
                newStoryTitle={newStoryTitle}
                onNewStoryTitleChange={setNewStoryTitle}
                onAddManualStory={addManualStory}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                filterStatus={filterStatus}
                onFilterStatusChange={setFilterStatus}
              />
            )}

            {!canEdit && !readOnly && (
              <div className="flex gap-2 items-center justify-between">
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Search stories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs"
                  />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="to_do">To Do</SelectItem>
                      <SelectItem value="in_grooming">In Grooming</SelectItem>
                      <SelectItem value="ready_for_estimate">Ready for Estimate</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="qa">QA</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {canSubmitChangeRequests && currentUser && (
                  <Button
                    onClick={() => setShowChangeRequestDialog(true)}
                    className="flex items-center gap-2"
                  >
                    <FileEdit className="h-4 w-4" />
                    Request Change
                  </Button>
                )}
              </div>
            )}

            {readOnly && (
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Search stories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-xs"
                />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="to_do">To Do</SelectItem>
                    <SelectItem value="in_grooming">In Grooming</SelectItem>
                    <SelectItem value="ready_for_estimate">Ready for Estimate</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="qa">QA</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              {filteredStories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>{readOnly || !canEdit ? "No user stories available to view." : "No user stories in backlog yet."}</p>
                  {canEdit && !readOnly && <p className="text-sm">Add stories manually or from the mindmap above.</p>}
                </div>
              ) : (
                filteredStories.map(story => (
                  <UserStoryCard
                    key={story.id}
                    story={story}
                    onUpdateStatus={updateStoryStatus}
                    onUpdatePriority={updateStoryPriority}
                    onDelete={deleteStory}
                    readOnly={readOnly || !canEdit}
                  />
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {(canReviewChangeRequests || canSubmitChangeRequests) && (
        <ChangeRequestsSection
          projectId={projectId}
          currentUserEmail={currentUser?.email || ''}
          currentUserName={currentUser?.name || currentUser?.email || ''}
          currentUserRole={currentUser?.role || 'client'}
          canReview={userRole === 'product_owner'}
          canApproveAsClient={userRole === 'client'}
          canProcessAsEpic={userRole === 'product_owner'}
        />
      )}

      {canSubmitChangeRequests && currentUser && (
        <ChangeRequestDialog
          open={showChangeRequestDialog}
          onClose={() => setShowChangeRequestDialog(false)}
          projectId={projectId}
          userEmail={currentUser.email}
          userName={currentUser.name || currentUser.email}
          userRole={currentUser.role || 'client'}
        />
      )}
    </div>
  );
};
