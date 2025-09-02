
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface StoryPointsSectionProps {
  storyPoints?: number;
  onStoryPointsChange: (points: number) => void;
}

const fibonacciSeries = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

export const StoryPointsSection = ({ storyPoints, onStoryPointsChange }: StoryPointsSectionProps) => {
   
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Story Points Estimation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="story-points" className="text-sm font-medium text-gray-700 mb-2 block">
              Estimate complexity using Fibonacci series <span className="text-red-500">*</span>
            </Label>
            <Select
              value={storyPoints ? storyPoints.toString() : ""}
              onValueChange={(value) => { 
                onStoryPointsChange(parseInt(value));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select story points..." />
              </SelectTrigger>
              <SelectContent>
                {fibonacciSeries.map((points) => (
                  <SelectItem key={points} value={points.toString()}>
                    {points} points
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!storyPoints && (
              <p className="text-sm text-gray-600 mt-2">
                Story points estimation is required to mark the story as ready.
              </p>
            )}
            {storyPoints && (
              <p className="text-sm text-green-600 mt-2">
                Currently estimated at {storyPoints} points
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
