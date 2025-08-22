
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { QAHeader } from '@/components/QAHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, User, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQAStories } from '@/hooks/useQAStories';

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  urgent: 'bg-red-100 text-red-800 border-red-200',
};

export const QAStoriesPage = () => {
  const { user, teamUser, logout } = useAuth();
  const navigate = useNavigate();
  const currentUser = user || teamUser;
  
  const { stories, loading } = useQAStories(currentUser?.email);

  if (!currentUser) {
    return null;
  }

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleStoryClick = (projectId: string, storyId: string) => {
    navigate(`/project/${projectId}/story/${storyId}/details`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <QAHeader currentUser={currentUser} onLogout={logout} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={handleBackToDashboard}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stories in QA</h1>
            <p className="text-gray-600">Stories ready for quality assurance testing</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>QA Stories ({loading ? '...' : stories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              </div>
            ) : stories.length > 0 ? (
              <div className="space-y-4">
                {stories.map((story) => (
                  <div 
                    key={story.id} 
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleStoryClick(story.project_id, story.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-600">
                          {story.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={priorityColors[story.priority as keyof typeof priorityColors] || priorityColors['medium']}>
                            {story.priority?.toUpperCase() || 'MEDIUM'} PRIORITY
                          </Badge>
                          {story.story_points && (
                            <Badge variant="outline">
                              {story.story_points} points
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>

                    {story.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {story.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>Project: {story.project_name || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Updated: {new Date(story.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">No stories in QA</p>
                <p className="text-sm">Stories will appear here when they are ready for QA testing</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
