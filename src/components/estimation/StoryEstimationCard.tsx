
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { useParams } from 'react-router-dom';

interface StoryEstimationCardProps {
  storyId: string;
  currentStoryPoints?: number;
  onEstimationComplete: () => void;
}

const fibonacciSeries = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

export const StoryEstimationCard: React.FC<StoryEstimationCardProps> = ({
  storyId,
  currentStoryPoints,
  onEstimationComplete
}) => {
  const [selectedPoints, setSelectedPoints] = React.useState<number | null>(currentStoryPoints || null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { projectId } = useParams();

  const handleSubmitEstimation = async () => {
    if (!selectedPoints) {
      toast.error("Please select story points before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
        const { error } = await apiCall(allRoutes.stories.updateStoryPoints(storyId), 'post', { 
        project_id: projectId,
        story_point: selectedPoints,
      });

      if (error) {
        toast.error("Failed to submit estimation");
        return;
      }

      toast.success("Story estimation submitted for review");

      onEstimationComplete();
    } catch (error) {
      toast.error("Failed to submit estimation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg text-blue-900">Provide Story Estimation</CardTitle>
          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
            Ready for Estimate
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-700 mb-3">
            This story is ready for estimation. Please review the requirements and provide your estimate using the Fibonacci sequence.
          </p>
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Story Points Estimation <span className="text-red-500">*</span>
            </label>
            <Select
              value={selectedPoints ? selectedPoints.toString() : ""}
              onValueChange={(value) => setSelectedPoints(parseInt(value))}
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
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleSubmitEstimation}
            disabled={!selectedPoints || isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit Estimation'}
          </Button>
        </div>

        {selectedPoints && (
          <p className="text-sm text-green-600">
            Selected estimation: {selectedPoints} points
          </p>
        )}
      </CardContent>
    </Card>
  );
};
