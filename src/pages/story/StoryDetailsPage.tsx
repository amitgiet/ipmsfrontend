import React from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, Image, Download } from 'lucide-react';
import { format } from 'date-fns';
import { TasksSection } from '@/components/tasks/TasksSection';
import { RoleIndicator } from '@/components/common/RoleIndicator';
import { QAStoryActions } from '@/components/qa/QAStoryActions';
import { StoryEstimationCard } from '@/components/estimation/StoryEstimationCard';
import { useUserRole } from '@/hooks/useUserRole';
import { useStoryDetailsData } from '@/hooks/useStoryDetailsData';
import { EstimationReviewCard } from '@/components/estimation/EstimationReviewCard';
import { AcceptanceCriteriaSection } from '@/components/story/AcceptanceCriteriaSection';
import { TestCasesSection } from '@/components/testcases/TestCasesSection';
import { hasPermission } from '@/utils/permissions';

const statusColors = {
  'to_do': 'bg-gray-100 text-gray-800 border-gray-200',
  'in_grooming': 'bg-blue-100 text-blue-800 border-blue-200',
  'ready': 'bg-green-100 text-green-800 border-green-200',
  'ready_for_estimate': 'bg-purple-100 text-purple-800 border-purple-200',
  'estimated': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'in_progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'qa': 'bg-orange-100 text-orange-800 border-orange-200',
  'done': 'bg-emerald-100 text-emerald-800 border-emerald-200'
};

const priorityColors = {
  'low': 'bg-green-100 text-green-800 border-green-200',
  'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'high': 'bg-orange-100 text-orange-800 border-orange-200',
  'urgent': 'bg-red-100 text-red-800 border-red-200'
};

export const StoryDetailsPage: React.FC = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = useUserRole();
  const isProductOwner = userRole === 'product_owner';
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    story1:story,
    loading,
    comments,
    documents,
    refetch,
    downloadDocument
  } = useStoryDetailsData(storyId);

  // Get current tab from URL parameter, default to 'story'
  const currentTab = searchParams.get('tab') || 'story';
  
  // Handle tab change and update URL parameter
  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const handleStatusUpdate = () => {
    refetch();
  };

  const handleEstimationComplete = () => {
    refetch();
  };

  const goBack = () => {
      navigate(-1);
  };

  // Get the project ID either from story data or location state
  const effectiveProjectId = story?.projectId || location.state?.projectId;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!story) {
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
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={goBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            {userRole && <RoleIndicator role={userRole} />}
          </div>
        </div>

        {/* Story Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">{story.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={priorityColors[story.priority]} variant="outline">
                    {story.priority.toUpperCase()}
                  </Badge>
                  <Badge className={statusColors[story.status]} variant="outline">
                    {story.status.toUpperCase().replace('_', ' ')}
                  </Badge>
                  {story.storyPoints && (
                    <Badge variant="outline">
                      {story.storyPoints} Points
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Story Estimation Card - Show for developers when story is ready for estimate and can be edited */}
        {userRole === 'developer' && story.status === 'ready_for_estimate' && (
          <div className="mb-6">
            <StoryEstimationCard
              storyId={story.id}
              currentStoryPoints={story.storyPoints}
              onEstimationComplete={handleEstimationComplete}
            />
          </div>
        )}

        {/* Estimation Review Card - Show for Product Owners when story is estimated and can be edited */}
        {isProductOwner && story.status === 'estimated' && story.storyPoints && (
          <div className="mb-6">
            <EstimationReviewCard
              storyId={story.id}
              storyPoints={story.storyPoints}
              onStatusUpdate={handleStatusUpdate}
            />
          </div>
        )}

        {/* QA Actions - Show prominently when story is in QA */}
        <div className="mb-6">
          <QAStoryActions 
            storyId={storyId!}
            currentStatus={story.status}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>

        {/* Tabs for Story Details, Tasks, and Test Cases */}
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="story">Story Details</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="testcases">Test Cases</TabsTrigger>
          </TabsList>

          {/* Story Details Tab */}
          <TabsContent value="story" className="space-y-6 mt-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                {story.description ? (
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{story.description}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No description provided</p>
                )}
              </CardContent>
            </Card>

            {/* Acceptance Criteria - Only editable if can edit story */}
            <AcceptanceCriteriaSection
              storyId={story.id}
              acceptanceCriteria={story.acceptanceCriteria || story.acceptance_criteria}
              storyStatus={story.status}
              onUpdate={refetch}
              canEdit={true}
            />

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Flow Documents</CardTitle>
                <CardDescription>Attached documents and reference materials</CardDescription>
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
                              {(doc.file_size / 1024).toFixed(1)} KB • {format(new Date(doc.uploaded_at), 'MMM dd, yyyy')}
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
                  <p className="text-gray-500 text-center py-4">No documents attached</p>
                )}
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-l-4 border-blue-200 pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.author_name}</span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(comment.created_at), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No comments yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="mt-6">
            {effectiveProjectId ? (
              <TasksSection 
                storyId={storyId!} 
                projectId={effectiveProjectId}
                canEdit={ userRole !== 'client' } 
              />
            ) : (
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-500 text-center">Project information not available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Test Cases Tab */}
          <TabsContent value="testcases" className="mt-6">
            {hasPermission(userRole, 'viewTestCases') ? (
              <TestCasesSection
                storyId={story.id}
                storyStatus={story.status}
                onTestCasesChange={refetch}
                canEdit={true}
              />
            ) : (
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-500 text-center">You don't have permission to view test cases</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StoryDetailsPage;