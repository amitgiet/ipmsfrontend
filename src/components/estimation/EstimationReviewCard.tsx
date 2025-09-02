
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';

interface EstimationReviewCardProps {
  storyId: string;
  storyPoints: number;
  onStatusUpdate: () => void;
}

export const EstimationReviewCard: React.FC<EstimationReviewCardProps> = ({
  storyId,
  storyPoints,
  onStatusUpdate
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handleApproveEstimation = async () => {
    setIsSubmitting(true);
    try { 
      const { error } = await apiCall(allRoutes.stories.update(storyId), 'put', { 
        status: 'ready',
        updated_at: new Date().toISOString()
      });

      if (error) {
        console.error('❌ Error approving estimation:', error);
        toast({
          title: "Error",
          description: "Failed to approve estimation",
          variant: "destructive",
        });
        return;
      }
 
      toast({
        title: "Success",
        description: "Story estimation approved and marked as ready",
      });

      onStatusUpdate();
    } catch (error) {
      console.error('❌ Error approving estimation:', error);
      toast({
        title: "Error",
        description: "Failed to approve estimation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-green-600" />
          <CardTitle className="text-lg text-green-900">Review Story Estimation</CardTitle>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Estimated
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-700 mb-3">
            The development team has provided an estimation for this story. Please review and approve to mark it as ready for sprint planning.
          </p>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Estimated Story Points:</span>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                {storyPoints} points
              </Badge>
            </div>
          </div>
        </div>

        {/* <div className="flex gap-2 pt-2">
          <Button
            onClick={handleApproveEstimation}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Approving...' : 'Approve & Mark Ready'}
          </Button>
        </div>

        <p className="text-sm text-green-600">
          Approving this estimation will mark the story as ready for sprint planning.
        </p> */}
      </CardContent>
    </Card>
  );
};
