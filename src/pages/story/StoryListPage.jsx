import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStories } from '../../features/stories/storySlice';

const StoryListPage = () => {
  const dispatch = useDispatch();
  const { stories, isLoading, error } = useSelector((state) => state.stories);

  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Stories</h1>
        <button className="btn-primary">Create Story</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <div key={story.id} className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{story.title}</h3>
            <p className="text-gray-600 mb-4">{story.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Priority:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  story.priority === 'high' ? 'bg-red-100 text-red-800' :
                  story.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {story.priority}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  story.status === 'todo' ? 'bg-gray-100 text-gray-800' :
                  story.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  story.status === 'done' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {story.status}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Story Points:</span>
                <span>{story.storyPoints || 'Not estimated'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {stories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No stories found.</p>
        </div>
      )}
    </div>
  );
};

export default StoryListPage; 