
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { StoryHeader } from '@/components/grooming/StoryHeader';
import { GroomingHeader } from '@/components/grooming/GroomingHeader';
import { StoryStatusCards } from '@/components/grooming/StoryStatusCards';
import { StoryGroomingContent } from '@/components/grooming/StoryGroomingContent';
import { SprintEditRestriction } from '@/components/common/SprintEditRestriction';
import { useStoryGrooming } from '@/hooks/useStoryGrooming';
import { useSprintStatus } from '@/hooks/useSprintStatus';

const UserStoryGrooming = () => {
  
  const {
    story,
    storyForComponents,
    documents,
    comments,
    loading,
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
    goBack,
    handleUpdateDescription,
    handleAddComment,
    handleStoryPointsChange,
    handleMarkAsReady,
    handleMarkReadyForEstimate,
    handleFileUpload,
    downloadDocument,
    refetch
  } = useStoryGrooming();

  const { 
    sprintStatus, 
    canEditStory, 
    isInRunningSprint, 
    isInCompletedSprint,
    loading: sprintLoading
  } = useSprintStatus(story?.id);

  if (loading || sprintLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!story || !storyForComponents) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Story Not Found</CardTitle>
            <CardDescription>The requested user story could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={goBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <GroomingHeader onBack={goBack} />

        <StoryHeader story={storyForComponents} />  

        {/* Sprint Edit Restriction Alert - Removed as per user request */}

        <StoryStatusCards 
          isStoryReady={isStoryReady}
          isReadyForEstimate={isReadyForEstimate}
        />

        <StoryGroomingContent
          story={story}
          storyForComponents={storyForComponents}
          documents={documents}
          comments={comments}
          description={description}
          setDescription={setDescription}
          newComment={newComment}
          setNewComment={setNewComment}
          userRole={userRole}
          isStoryReady={isStoryReady}
          isReadyForEstimate={isReadyForEstimate}
          canAddComments={canAddComments}
          canEditContent={canEditContent}
          canEditStoryPoints={canEditStoryPoints}
          uploading={uploading}
          handleUpdateDescription={handleUpdateDescription}
          handleAddComment={handleAddComment}
          handleStoryPointsChange={handleStoryPointsChange}
          handleMarkAsReady={handleMarkAsReady}
          handleMarkReadyForEstimate={handleMarkReadyForEstimate}
          handleFileUpload={handleFileUpload}
          downloadDocument={downloadDocument}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default UserStoryGrooming;