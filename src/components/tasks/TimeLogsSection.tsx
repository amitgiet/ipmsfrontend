
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface TimeLog {
  id: string;
  task_id: string;
  start_time: string;
  end_time: string;
  time_spent_minutes: number;
  logged_by: string;
  logged_at: string;
}

interface TimeLogsSectionProps {
  timeLogs: TimeLog[];
  loading: boolean;
  getTaskTitle: (taskId: string) => string;
  getTotalTimeSpent: () => number;
  formatDuration: (minutes: number) => string;
}

export const TimeLogsSection: React.FC<TimeLogsSectionProps> = ({
  timeLogs,
  loading,
  getTaskTitle,
  getTotalTimeSpent,
  formatDuration
}) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Time Logs</CardTitle>
          <Badge variant="outline" className="text-sm">
            Total: {formatDuration(getTotalTimeSpent())}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : timeLogs.length > 0 ? (
          <div className="space-y-3">
            {timeLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">
                    {getTaskTitle(log.task_id)}
                  </p>
                  <p className="text-xs text-gray-600">
                    {format(new Date(log.start_time), 'HH:mm')} - {format(new Date(log.end_time), 'HH:mm')} • 
                    Logged by {log.logged_by} on {format(new Date(log.logged_at), 'MMM dd, yyyy')}
                  </p>
                </div>
                <Badge variant="outline" className="text-sm font-medium">
                  {formatDuration(log.time_spent_minutes)}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No time logs found</p>
            <p className="text-xs">Start logging time on tasks to track progress</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
