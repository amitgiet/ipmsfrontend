
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, Clock, Calendar as CalendarIcon, User, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TimeLog {
  id: string;
  task_id: string;
  start_time: string;
  end_time: string;
  time_spent_minutes: number;
  logged_by: string;
  logged_at: string;
  story_tasks: {
    title: string;
    story_id: string;
    user_stories: {
      title: string;
      projects: {
        project_name: string;
      };
    };
  };
}

export const TimesheetPage = () => {
  const navigate = useNavigate();
  const { user, teamUser } = useAuth();
  const { toast } = useToast();
  const currentUser = user || teamUser;
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTimeLogs = async (date: Date) => {
    if (!currentUser) return;

    try {
      setLoading(true);
      console.log('🔄 Fetching time logs for date:', format(date, 'yyyy-MM-dd'));

      const selectedDateStr = format(date, 'yyyy-MM-dd');
      const userEmail = currentUser.email;

      // Get time logs for the selected date and user
      const { data, error } = await supabase
        .from('task_time_logs')
        .select(`
          *,
          story_tasks!inner (
            title,
            story_id,
            user_stories!inner (
              title,
              projects!inner (
                project_name
              )
            )
          )
        `)
        .eq('logged_by', userEmail)
        .gte('logged_at', `${selectedDateStr}T00:00:00`)
        .lt('logged_at', `${selectedDateStr}T23:59:59`)
        .order('logged_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching time logs:', error);
        toast({
          title: "Error",
          description: "Failed to load time logs",
          variant: "destructive",
        });
        return;
      }

      setTimeLogs(data || []);
      console.log('✅ Time logs loaded:', data?.length || 0);
    } catch (error) {
      console.error('❌ Error in fetchTimeLogs:', error);
      toast({
        title: "Error",
        description: "Failed to load time logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeLogs(selectedDate);
  }, [selectedDate, currentUser]);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getTotalTime = (): number => {
    return timeLogs.reduce((total, log) => total + log.time_spent_minutes, 0);
  };

  const formatTime = (timeString: string) => {
    try {
      return format(new Date(timeString), 'HH:mm');
    } catch (error) {
      return 'Invalid time';
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Please log in to view your timesheet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Timesheet</h1>
              <p className="text-gray-600">{currentUser.name} - {currentUser.email}</p>
            </div>
          </div>
          
          {/* Date Selector */}
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              Total: {formatDuration(getTotalTime())}
            </Badge>
          </div>
        </div>

        {/* Time Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time Logs for {format(selectedDate, 'MMMM dd, yyyy')} ({timeLogs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading time logs...</p>
              </div>
            ) : timeLogs.length > 0 ? (
              <div className="space-y-4">
                {timeLogs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {log.story_tasks.user_stories.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Task: {log.story_tasks.title}
                        </p>
                        <p className="text-sm text-blue-600 mb-2">
                          Project: {log.story_tasks.user_stories.projects.project_name}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(log.start_time)} - {formatTime(log.end_time)}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {log.logged_by}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-sm font-medium">
                        {formatDuration(log.time_spent_minutes)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Time Logs Found</h3>
                <p className="text-gray-600">
                  No time has been logged for {format(selectedDate, 'MMMM dd, yyyy')}.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
