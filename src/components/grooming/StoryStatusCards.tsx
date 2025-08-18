
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StoryStatusCardsProps {
  isStoryReady: boolean;
  isReadyForEstimate: boolean;
}

export const StoryStatusCards: React.FC<StoryStatusCardsProps> = ({
  isStoryReady,
  isReadyForEstimate
}) => {
  return (
    <>
      {isStoryReady && (
        <Card className="mb-6 bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium">Story is ready and locked for editing</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              This story has been marked as ready and can no longer be modified.
            </p>
          </CardContent>
        </Card>
      )}

      {isReadyForEstimate && !isStoryReady && (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-blue-800">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium">Story is ready for estimate</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              This story has been marked as ready for estimation by the team.
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
};
