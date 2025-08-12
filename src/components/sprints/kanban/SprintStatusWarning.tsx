
import React from 'react';

interface SprintStatusWarningProps {
  sprintStatus: 'created' | 'running' | 'completed';
  isProjectInProgress: boolean;
  isLoadingStatus: boolean;
  projectStatus: string | null;
}

export const SprintStatusWarning: React.FC<SprintStatusWarningProps> = ({
  sprintStatus,
  isProjectInProgress,
  isLoadingStatus,
  projectStatus
}) => {
  const showStatusWarning = sprintStatus !== 'running' || (!isProjectInProgress && !isLoadingStatus);

  if (!showStatusWarning) {
    return null;
  }

  const getStatusMessage = () => {
    if (isLoadingStatus) {
      return "Loading project status...";
    }
    
    if (!isProjectInProgress) {
      const statusDisplay = projectStatus === 'unknown' 
        ? 'Unable to determine project status' 
        : `Current project status: ${projectStatus || 'Not set'}`;
      
      return `Story status updates are only available when the project is in progress. ${statusDisplay}`;
    }
    
    return "Task status updates are only available when the sprint is in progress.";
  };

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
      <p className="text-orange-800 text-sm">
        {getStatusMessage()}
      </p>
    </div>
  );
};
