
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Target, TrendingDown } from 'lucide-react';

interface SprintSummaryCardsProps {
  duration: number;
  targetStoryPoints: number;
  completedStoryPoints: number;
}

export const SprintSummaryCards: React.FC<SprintSummaryCardsProps> = ({
  duration,
  targetStoryPoints,
  completedStoryPoints,
  progress
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Duration</p>
              <div className="text-2xl font-bold">{duration} days</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Target Points</p>
              <div className="text-2xl font-bold">{targetStoryPoints}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <TrendingDown className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Points</p>
              <div className="text-2xl font-bold">{completedStoryPoints}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Progress</p>
            <div className="text-2xl font-bold">
              {progress}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ 
                  width: `${progress}%` 
                }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
