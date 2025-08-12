
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface Sprint {
  start_date: string;
  end_date: string;
}

interface Story {
  status: string;
}

interface SprintDetailsCardProps {
  sprint: Sprint;
  stories: Story[];
}

export const SprintDetailsCard: React.FC<SprintDetailsCardProps> = ({
  sprint,
  stories
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Sprint Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
            <p className="text-gray-600">
              <strong>Start:</strong> {format(new Date(sprint.start_date), 'MMM dd, yyyy')}
            </p>
            <p className="text-gray-600">
              <strong>End:</strong> {format(new Date(sprint.end_date), 'MMM dd, yyyy')}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Stories</h4>
            <p className="text-gray-600">
              <strong>Total Stories:</strong> {stories.length}
            </p>
            <p className="text-gray-600">
              <strong>Completed:</strong> {stories.filter(s => s.status === 'done').length}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
