
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import { apiCall } from '../services/apiCall';
import { format } from 'date-fns';
import { allRoutes } from '../services/routes';

  const TimeLogsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [timeLogs, setTimeLogs] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [extraData, setExtraData] = useState({});

  const fetchTimeLogsData = async () => {
    if (!projectId) return;

    try {
      const { data: timeLogsData, error: timeLogsError } = await apiCall(
        allRoutes.productOwner.time_logs_list(1, String(projectId), 1000, 1)
      );
      if(timeLogsError){
        console.error('❌ Error in fetchTimeLogsData:', timeLogsError);
        return;
      }
      setExtraData(timeLogsData?.extra_data || {});
      setTimeLogs(timeLogsData?.data || []);
    } catch (error) {
      console.error('❌ Error in fetchTimeLogsData:', error);
      toast.error("Failed to load time logs");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectData = async () => {
    const { data: projectData, error: projectError } = await apiCall(allRoutes.projects.getById(projectId));
    if(projectError){
      console.error('❌ Error in fetchProjectData:', projectError);
      return;
    }
    setProject(projectData.data);
  }

  useEffect(() => {
    fetchTimeLogsData();
    fetchProjectData();
  }, [projectId]);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getTotalTime = (): number => {
    return extraData?.total_duration ? extraData?.total_duration/60 : 0;
  };

  const handleBack = () => {
    navigate(projectId ? `/project/${String(projectId)}` : '/projects');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Project
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Time Logs</h1>
              <p className="text-gray-600">{project?.name}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Clock className="h-4 w-4 mr-2" />
            Total: {formatDuration(getTotalTime())}
          </Badge>
        </div>

        {/* Time Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              All Time Logs ({timeLogs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {timeLogs.length > 0 ? (
              <div className="space-y-4">
                {timeLogs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {log.user_story_title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Task: {log.task_title}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(log.created_at), 'MMM dd, yyyy')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {log.start_time} - {log.end_time}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {log.user.email}
                          </div>
                        </div>
                      </div>
                        {/* <Badge variant="secondary" className="text-sm font-medium">
                          {formatDuration(log.start_time - log.end_time)}
                        </Badge> */}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Time Logs Found</h3>
                <p className="text-gray-600">No time has been logged for this project yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimeLogsPage;