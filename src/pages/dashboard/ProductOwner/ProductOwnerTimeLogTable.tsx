
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, FileText, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimeLog {
  id: string;
  product_owner_email: string;
  project_id: string;
  activity_type: string;
  description: string | null;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  logged_at: string;
  created_at: string;
  projects?: {
    project_name: string;
  };
}

interface ProductOwnerTimeLogTableProps {
  productOwnerEmail: string;
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

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
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

export const ProductOwnerTimeLogTable: React.FC<ProductOwnerTimeLogTableProps> = ({
  productOwnerEmail,
  timeLogsList,
  refetchTimeLogs
}) => {
  // Demo data instead of hook
  const demoTimeLogs: TimeLog[] = [
    {
      id: '1',
      product_owner_email: productOwnerEmail,
      project_id: '1',
      activity_type: 'grooming',
      description: 'Backlog grooming session for sprint planning',
      start_time: '2024-01-15T09:00:00Z',
      end_time: '2024-01-15T11:00:00Z',
      duration_minutes: 120,
      logged_at: '2024-01-15T11:00:00Z',
      created_at: '2024-01-15T11:00:00Z',
      projects: {
        project_name: 'E-commerce Platform'
      }
    },
    {
      id: '2',
      product_owner_email: productOwnerEmail,
      project_id: '1',
      activity_type: 'meeting',
      description: 'Stakeholder review meeting for MVP features',
      start_time: '2024-01-15T14:00:00Z',
      end_time: '2024-01-15T15:30:00Z',
      duration_minutes: 90,
      logged_at: '2024-01-15T15:30:00Z',
      created_at: '2024-01-15T15:30:00Z',
      projects: {
        project_name: 'E-commerce Platform'
      }
    },
    {
      id: '3',
      product_owner_email: productOwnerEmail,
      project_id: '2',
      activity_type: 'planning',
      description: 'Mobile app feature planning and prioritization',
      start_time: '2024-01-16T10:00:00Z',
      end_time: '2024-01-16T12:00:00Z',
      duration_minutes: 120,
      logged_at: '2024-01-16T12:00:00Z',
      created_at: '2024-01-16T12:00:00Z',
      projects: {
        project_name: 'Mobile App Development'
      }
    },
    {
      id: '4',
      product_owner_email: productOwnerEmail,
      project_id: '3',
      activity_type: 'review',
      description: 'Final review of website redesign deliverables',
      start_time: '2024-01-16T15:00:00Z',
      end_time: '2024-01-16T16:00:00Z',
      duration_minutes: 60,
      logged_at: '2024-01-16T16:00:00Z',
      created_at: '2024-01-16T16:00:00Z',
      projects: {
        project_name: 'Website Redesign'
      }
    },
    {
      id: '5',
      product_owner_email: productOwnerEmail,
      project_id: '1',
      activity_type: 'sprint_management',
      description: 'Sprint retrospective and next sprint planning',
      start_time: '2024-01-17T09:00:00Z',
      end_time: '2024-01-17T11:00:00Z',
      duration_minutes: 120,
      logged_at: '2024-01-17T11:00:00Z',
      created_at: '2024-01-17T11:00:00Z',
      projects: {
        project_name: 'E-commerce Platform'
      }
    }
  ];
  
  // Use the provided time logs if available, otherwise use demo data
  const displayTimeLogs = timeLogsList && timeLogsList.length > 0 ? timeLogsList : demoTimeLogs;
  
  // Handle refresh functionality
  const handleRefresh = () => {
    if (refetchTimeLogs) {
      refetchTimeLogs();
    } else {
      // Demo refresh - just log to console
      console.log('Refreshing time logs...');
      console.log('Demo data refreshed for Product Owner:', productOwnerEmail);
    }
  };

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
                      {log.projects?.project_name || 'Unknown Project'}
                    </h3>
                    <Badge className={getActivityTypeColor(log.activity_type)}>
                      {log.activity_type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(log.logged_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatTime(log.start_time)} - {formatTime(log.end_time)}
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
                    {formatDuration(log.duration_minutes)}
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
