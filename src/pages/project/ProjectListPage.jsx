import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects } from '../../features/projects/projectSlice';

const ProjectListPage = () => {
  const dispatch = useDispatch();
  const { projects, isLoading, error } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button className="btn-primary">Create Project</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="card hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="flex justify-between items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                project.status === 'active' ? 'bg-green-100 text-green-800' :
                project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {project.status}
              </span>
              <span className="text-sm text-gray-500">{project.team?.name || 'No team'}</span>
            </div>
          </div>
        ))}
      </div>
      
      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No projects found. Create your first project to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectListPage; 