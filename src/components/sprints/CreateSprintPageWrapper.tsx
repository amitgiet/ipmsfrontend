
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreateSprintPage } from './CreateSprintPage';

export const CreateSprintPageWrapper = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  if (!projectId) {
    navigate('/dashboard');
    return null;
  }

  const handleBack = () => {
    navigate(`/project/${projectId}`);
  };

  const handleSprintCreated = () => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CreateSprintPage 
        projectId={projectId}
        onBack={handleBack}
        onSprintCreated={handleSprintCreated}
      />
    </div>
  );
};
