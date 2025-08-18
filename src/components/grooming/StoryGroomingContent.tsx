
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Image, Download } from 'lucide-react';
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
  refetch
}) => {
  const handleEstimationComplete = () => {
    console.log('🔄 Estimation completed, refetching story data...');
    if (refetch) {
      refetch();
    }
  };

  // Check if story is estimated (has been estimated by developers)
  const isEstimated = story?.status === 'estimated';
  
  // Get story points from either story or storyForComponents
  const storyPoints = story?.story_points || storyForComponents?.storyPoints;
  
  // Debug logging
  console.log('🔍 StoryGroomingContent Debug:', {
    storyStatus: story?.status,
    userRole,
    isEstimated,
    isReadyForEstimate,
    storyPoints: storyPoints,
    hasStoryPoints: !!storyPoints,
    acceptanceCriteria: story?.acceptanceCriteria || story?.acceptance_criteria
  });

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
          onUpdateDescription={handleUpdateDescription}
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

      {/* Acceptance Criteria Section - Fixed to use correct property */}
      {story.id && (
        <div className="mb-6">
          <AcceptanceCriteriaSection
            storyId={story.id}
            acceptanceCriteria={story.acceptanceCriteria || story.acceptance_criteria}
            storyStatus={story.status}
            onUpdate={handleEstimationComplete}
          />
        </div>
      )}

      {/* Test Cases Section - Show for QA and developers */}
      {(userRole === 'qa' || userRole === 'developer') && story.id && (
        <div className="mb-6">
          <TestCasesSection
            storyId={story.id}
            storyStatus={story.status}
            onTestCasesChange={handleEstimationComplete}
          />
        </div>
      )}

      {canEditStoryPoints ? (
        <PermissionWrapper action="groomStory">
          <StoryPointsSection
            storyPoints={storyForComponents.storyPoints}
            onStoryPointsChange={handleStoryPointsChange}
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
                  {storyForComponents.storyPoints ? `${storyForComponents.storyPoints} points` : 'Not estimated'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {canEditContent ? (
        <DocumentsSection
          documents={documents}
          uploading={uploading}
          onFileUpload={handleFileUpload}
          onDownloadDocument={downloadDocument}
        />
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Flow Documents</CardTitle>
            <CardDescription>Flow documents, wireframes, and reference materials</CardDescription>
          </CardHeader>
          <CardContent>
            {documents.length > 0 ? (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {doc.file_type.startsWith('image/') ? (
                        <Image className="h-5 w-5 text-blue-500" />
                      ) : (
                        <FileText className="h-5 w-5 text-blue-500" />
                      )}
                      <div>
                        <p className="font-medium">{doc.filename}</p>
                        <p className="text-sm text-gray-500">
                          {(doc.file_size / 1024).toFixed(1)} KB • {new Date(doc.uploaded_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadDocument(doc)}
                    >
                      <Download className="h-4 w-4" />
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

      {/* Updated TasksSection with proper permission check for developers */}
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
        onAddComment={handleAddComment}
        canAddComments={canAddComments}
        readOnly={!canAddComments || isStoryReady}
      />

      {canEditContent && (
        <GroomingActions
          onMarkAsReady={handleMarkAsReady}
          onMarkReadyForEstimate={handleMarkReadyForEstimate}
          isReady={story?.status === 'ready'}
          isReadyForEstimate={story?.status === 'ready_for_estimate'}
          hasStoryPoints={!!story?.story_points}
        />
      )}
    </>
  );
};
