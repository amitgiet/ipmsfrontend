
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, FileText, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimeLog {
  id: number;
  project: string;
  activity_type: string;
  start_time: string;
  end_time: string;
  description: string | null;
  created_at: string;
}

interface ProductOwnerTimeLogTableProps {
  timeLogsList?: TimeLog[];
  refetchTimeLogs?: () => void;
}

const getActivityTypeColor = (type: string) => {
  switch (type) {
    case 'grooming':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'meeting':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'sprint_management':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'planning':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'review':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const calculateDuration = (startTime: string, endTime: string) => {
  try {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  } catch (error) {
    console.error('Error calculating duration:', error);
    return '0h 0m';
  }
};

const formatTime = (timeString: string) => {
  try {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid time';
  }
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const ProductOwnerTimeLogTable = ({
  timeLogsList,
  refetchTimeLogs
}) => {
  const displayTimeLogs = timeLogsList && timeLogsList.length > 0 ? timeLogsList : [];
  
  const handleRefresh = () => {
    if (refetchTimeLogs) {
      refetchTimeLogs();
      } else {
        console.info('Refreshing time logs...'); 
    }
  };

  const formatTimeIn12Hours = (time: string) => {
    const hours = parseInt(time.split(':')[0]);
    const minutes = time.split(':')[1].split(' ')[0];
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${period}`;
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Time Logs
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            className="h-8 w-8 p-0"
            title="Refresh time logs"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {displayTimeLogs.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No time logs found</p>
            <p className="text-sm text-gray-500">Start logging your time to see entries here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayTimeLogs.slice(0, 10).map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-900">
                      {log.project || 'Unknown Project'}
                    </h3>
                    <Badge className={getActivityTypeColor(log.activity_type)}>
                      {log.activity_type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(log.created_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatTimeIn12Hours(log.start_time)} - {formatTimeIn12Hours(log.end_time)}
                    </div>
                  </div>

                  {log.description && (
                    <div className="flex items-start gap-1 text-sm text-gray-600">
                      <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p>{log.description}</p>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-lg font-semibold text-blue-600">
                    {calculateDuration(log.start_time, log.end_time)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
