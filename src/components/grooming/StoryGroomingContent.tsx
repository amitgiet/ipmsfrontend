
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Image, Download, Eye } from 'lucide-react';
import { DescriptionSection } from '@/components/grooming/DescriptionSection';
import { StoryPointsSection } from '@/components/grooming/StoryPointsSection';
import { DocumentsSection } from '@/components/grooming/DocumentsSection';
import { CommentsSection } from '@/components/grooming/CommentsSection';
import { GroomingActions } from '@/components/grooming/GroomingActions';
import { PermissionWrapper } from '@/components/common/PermissionWrapper';
import { TasksSection } from '@/components/tasks/TasksSection';
import { AcceptanceCriteriaSection } from '@/components/story/AcceptanceCriteriaSection';
import { StoryEstimationCard } from '@/components/estimation/StoryEstimationCard';
import { EstimationReviewCard } from '@/components/estimation/EstimationReviewCard';
import { TestCasesSection } from '@/components/testcases/TestCasesSection';

interface StoryGroomingContentProps {
  story: any;
  storyForComponents: any;
  documents: any[];
  comments: any[];
  description: string;
  setDescription: (value: string) => void;
  newComment: string;
  setNewComment: (value: string) => void;
  userRole: string | null;
  isStoryReady: boolean;
  isReadyForEstimate: boolean;
  canAddComments: boolean;
  canEditContent: boolean;
  canEditStoryPoints: boolean;
  uploading: boolean;
  handleUpdateDescription: () => void;
  handleAddComment: () => void;
  handleStoryPointsChange: (points: number) => void;
  handleMarkAsReady: () => void;
  handleMarkReadyForEstimate: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  downloadDocument: (document: any) => void;
  refetch?: () => void;
  setStory?: (story: any) => void; // Add setStory prop for state updates
}

export const StoryGroomingContent: React.FC<StoryGroomingContentProps> = ({
  story,
  storyForComponents,
  documents,
  comments,
  description,
  setDescription,
  newComment,
  setNewComment,
  userRole,
  isStoryReady,
  isReadyForEstimate,
  canAddComments,
  canEditContent,
  canEditStoryPoints,
  uploading,
  handleUpdateDescription,
  handleAddComment,
  handleStoryPointsChange,
  handleMarkAsReady,
  handleMarkReadyForEstimate,
  handleFileUpload,
  downloadDocument,
  refetch,
  setStory
}) => {
  // Unified refetch function that handles both refetch and state updates
  const handleDataRefresh = () => {
    if (refetch) {
      refetch();
    }
    // If no refetch function, we can still update local state if setStory is available
    // This provides a fallback for immediate UI updates
  };

  // Enhanced estimation complete handler
  const handleEstimationComplete = () => {
    handleDataRefresh();
  };

  // Enhanced document upload handler with refetch
  const handleFileUploadWithRefresh = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // Call the original upload handler
    await handleFileUpload(event);
    // Refetch data after successful upload
    handleDataRefresh();
  };

  // Enhanced story points change handler with refetch
  const handleStoryPointsChangeWithRefresh = async (points: number) => {
    await handleStoryPointsChange(points);
    // Refetch data after story points update
    handleDataRefresh();
  };

  // Enhanced mark as ready handler with refetch
  const handleMarkAsReadyWithRefresh = async () => {
    await handleMarkAsReady();
    // Refetch data after status update
    handleDataRefresh();
  };

  // Enhanced mark ready for estimate handler with refetch
  const handleMarkReadyForEstimateWithRefresh = async () => {
    await handleMarkReadyForEstimate();
    // Refetch data after status update
    handleDataRefresh();
  };

  // Enhanced add comment handler with refetch
  const handleAddCommentWithRefresh = async () => {
    await handleAddComment();
    // Refetch data after comment addition
    handleDataRefresh();
  };

  // Enhanced update description handler with refetch
  const handleUpdateDescriptionWithRefresh = async () => {
    await handleUpdateDescription();
    // Refetch data after description update
    handleDataRefresh();
  };

  // Check if story is estimated (has been estimated by developers)
  const isEstimated = story?.status === 'estimated';
  const storyPoints = story?.storyPoints || storyForComponents?.storyPoints;

 
  return (
    <>
      {/* Show estimation card for developers when story is ready for estimate */}
      {isReadyForEstimate && (userRole === 'developer' || userRole === 'team_lead') && (
        <div className="mb-6">
          <StoryEstimationCard
            storyId={story.id}
            currentStoryPoints={storyPoints}
            onEstimationComplete={handleEstimationComplete}
          />
        </div>
      )}

      {/* Show estimation review card for product owners when story is estimated */}
      {isEstimated && userRole === 'product_owner' && storyPoints && (
        <div className="mb-6">
          <EstimationReviewCard
            storyId={story.id}
            storyPoints={storyPoints}
            onStatusUpdate={handleEstimationComplete}
          />
        </div>
      )}

      {canEditContent ? (
        <DescriptionSection
          description={description}
          onDescriptionChange={setDescription}
          onUpdateDescription={handleUpdateDescriptionWithRefresh}
        />
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-32 p-3 bg-gray-50 border rounded-md">
              {story.description || 'No description provided'}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Acceptance Criteria Section */}
      {story.id  && (
        <div className="mb-6">
          <AcceptanceCriteriaSection
            storyId={story.id}
            acceptanceCriteria={story.acceptanceCriteria || story.acceptance_criteria}
            storyStatus={story.status}
            onUpdate={handleDataRefresh}
          />
        </div>
      )}

      {/* Test Cases Section - Show for QA and developers */}
      {(userRole === 'qa' || userRole === 'developer' || userRole === 'team_lead' || userRole === 'super-admin') && story.id && (
        <div className="mb-6">
          <TestCasesSection
            storyId={story.id}
            storyStatus={story.status}
            onTestCasesChange={handleDataRefresh}
          />
        </div>
      )}

      {canEditStoryPoints ? (
        <PermissionWrapper action="groomStory">
          <StoryPointsSection
            storyPoints={storyPoints}
            onStoryPointsChange={handleStoryPointsChangeWithRefresh}
          />
        </PermissionWrapper>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Story Points Estimation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Estimated complexity
                </p>
                <div className="w-full p-3 bg-gray-50 border rounded-md">
                  {storyPoints ? `${storyPoints} points` : 'Not estimated'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {canEditContent ? (
        <DocumentsSection
          documents={story.media}
          uploading={uploading}
          onFileUpload={handleFileUploadWithRefresh}
          onDownloadDocument={downloadDocument}
        />
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Flow Documents</CardTitle>
            <CardDescription>Flow documents, wireframes, and reference materials</CardDescription>
          </CardHeader>
          <CardContent>
            {story.media && story.media.length > 0 ? (
              <div className="space-y-2">
                {story.media.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {doc.url.includes('image') ? (
                        <Image className="h-5 w-5 text-blue-500" />
                      ) : (
                        <FileText className="h-5 w-5 text-blue-500" />
                      )}
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        {/* <p className="text-sm text-gray-500">
                          {new Date(doc.uploaded_at).toLocaleDateString()}
                        </p> */}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadDocument(doc)}
                    >
                     <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No documents uploaded yet</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* TasksSection with proper permission check */}
      {userRole === 'developer' ? (
        <PermissionWrapper action="viewOwnTasks">
          {story.id && story.project_id && (
            <div className="mb-6">
              <TasksSection 
                storyId={story.id} 
                projectId={story.project_id}
              />
            </div>
          )}
        </PermissionWrapper>
      ) : (
        <PermissionWrapper action="viewTask">
          {story.id && story.project_id && (
            <div className="mb-6">
              <TasksSection 
                storyId={story.id} 
                projectId={story.project_id}
              />
            </div>
          )}
        </PermissionWrapper>
      )}

      <CommentsSection
        comments={comments}
        newComment={newComment}
        onNewCommentChange={setNewComment}
        onAddComment={handleAddCommentWithRefresh}
        canAddComments={canAddComments}
        readOnly={!canAddComments || isStoryReady}
      />

      {canEditContent && (
        <GroomingActions
          onMarkAsReady={handleMarkAsReadyWithRefresh}
          onMarkReadyForEstimate={handleMarkReadyForEstimateWithRefresh}
          isReady={story?.status === 'ready'}
          isReadyForEstimate={story?.status === 'ready_for_estimate'}
          hasStoryPoints={!!storyPoints}
        />
      )}
    </>
  );
};
