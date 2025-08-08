import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSprints } from '../../features/sprints/sprintSlice';

const SprintListPage = () => {
  const dispatch = useDispatch();
  const { sprints, isLoading, error } = useSelector((state) => state.sprints);

  useEffect(() => {
    dispatch(fetchSprints());
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
        <h1 className="text-2xl font-bold text-gray-900">Sprints</h1>
        <button className="btn-primary">Create Sprint</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sprints.map((sprint) => (
          <div key={sprint.id} className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{sprint.name}</h3>
            <p className="text-gray-600 mb-4">{sprint.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Start Date:</span>
                <span>{sprint.startDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>End Date:</span>
                <span>{sprint.endDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  sprint.status === 'active' ? 'bg-green-100 text-green-800' :
                  sprint.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {sprint.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {sprints.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No sprints found.</p>
        </div>
      )}
    </div>
  );
};

export default SprintListPage; 