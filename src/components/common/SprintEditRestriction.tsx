
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';

interface SprintEditRestrictionProps {
  isInRunningSprint: boolean;
  isInCompletedSprint: boolean;
  sprintName?: string;
}

export const SprintEditRestriction: React.FC<SprintEditRestrictionProps> = ({
  isInRunningSprint,
  isInCompletedSprint,
  sprintName
}) => {
  if (!isInRunningSprint && !isInCompletedSprint) {
    return null;
  }

  const message = isInCompletedSprint
    ? `This story is part of completed sprint "${sprintName}" and cannot be edited.`
    : `This story is part of running sprint "${sprintName}" and cannot be edited.`;

  return (
    <Alert className="mb-4 border-orange-200 bg-orange-50">
      <Lock className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        {message}
      </AlertDescription>
    </Alert>
  );
};
