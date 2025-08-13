import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock, Calendar as CalendarIcon, AlertTriangle, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';

export const AdminTimesheetSection = () => {
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeLogs, setTimeLogs] = useState([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [underperformers, setUnderperformers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock team members data
  const mockTeamMembers = [
    { id: '1', name: 'John Doe', email: 'john.doe@company.com', role: 'Developer' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@company.com', role: 'Designer' },
    { id: '3', name: 'Mike Johnson', email: 'mike.johnson@company.com', role: 'QA Engineer' },
    { id: '4', name: 'Sarah Wilson', email: 'sarah.wilson@company.com', role: 'Project Manager' },
    { id: '5', name: 'David Brown', email: 'david.brown@company.com', role: 'Developer' },
    { id: '6', name: 'Lisa Davis', email: 'lisa.davis@company.com', role: 'UI/UX Designer' }
  ];

  // Mock time logs data
  const mockTimeLogs = [
    {
      id: '1',
      task_id: 'task-1',
      start_time: '2024-01-15T09:00:00Z',
      end_time: '2024-01-15T12:00:00Z',
      time_spent_minutes: 180,
      logged_by: 'john.doe@company.com',
      logged_at: '2024-01-15T12:00:00Z',
      story_tasks: {
        title: 'Implement user authentication',
        story_id: 'story-1',
        user_stories: {
          title: 'User Login System',
          projects: {
            project_name: 'E-commerce Platform'
          }
        }
      }
    },
    {
      id: '2',
      task_id: 'task-2',
      start_time: '2024-01-15T13:00:00Z',
      end_time: '2024-01-15T17:00:00Z',
      time_spent_minutes: 240,
      logged_by: 'john.doe@company.com',
      logged_at: '2024-01-15T17:00:00Z',
      story_tasks: {
        title: 'Design checkout flow',
        story_id: 'story-2',
        user_stories: {
          title: 'Payment Integration',
          projects: {
            project_name: 'E-commerce Platform'
          }
        }
      }
    },
    {
      id: '3',
      task_id: 'task-3',
      start_time: '2024-01-15T09:30:00Z',
      end_time: '2024-01-15T11:30:00Z',
      time_spent_minutes: 120,
      logged_by: 'jane.smith@company.com',
      logged_at: '2024-01-15T11:30:00Z',
      story_tasks: {
        title: 'Create mobile responsive design',
        story_id: 'story-3',
        user_stories: {
          title: 'Mobile Optimization',
          projects: {
            project_name: 'E-commerce Platform'
          }
        }
      }
    },
    {
      id: '4',
      task_id: 'task-4',
      start_time: '2024-01-15T14:00:00Z',
      end_time: '2024-01-15T16:00:00Z',
      time_spent_minutes: 120,
      logged_by: 'jane.smith@company.com',
      logged_at: '2024-01-15T16:00:00Z',
      story_tasks: {
        title: 'Test payment gateway',
        story_id: 'story-4',
        user_stories: {
          title: 'Payment Testing',
          projects: {
            project_name: 'E-commerce Platform'
          }
        }
      }
    }
  ];

  // Mock underperformers data
  const mockUnderperformers = [
    {
      date: '2024-01-12',
      total_minutes: 360, // 6 hours
      logged_by: 'mike.johnson@company.com',
      team_member_name: 'Mike Johnson'
    },
    {
      date: '2024-01-13',
      total_minutes: 420, // 7 hours
      logged_by: 'david.brown@company.com',
      team_member_name: 'David Brown'
    },
    {
      date: '2024-01-14',
      total_minutes: 300, // 5 hours
      logged_by: 'lisa.davis@company.com',
      team_member_name: 'Lisa Davis'
    }
  ];

  const fetchTeamMembers = async () => {
    try {
      console.log('🔄 Fetching team members for admin timesheet...');
      
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      setTeamMembers(mockTeamMembers);
      console.log('✅ Team members loaded:', mockTeamMembers.length);
    } catch (error) {
      console.error('❌ Error in fetchTeamMembers:', error);
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive",
      });
    }
  };

  const fetchTodayTotal = async () => {
    try {
      console.log('🔄 Fetching today\'s total logged hours...');
      
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      
      const total = mockTimeLogs.reduce((sum, log) => sum + log.time_spent_minutes, 0);
      setTodayTotal(total);
      console.log('✅ Today\'s total minutes:', total);
    } catch (error) {
      console.error('❌ Error in fetchTodayTotal:', error);
      toast({
        title: "Error",
        description: "Failed to load today's total",
        variant: "destructive",
      });
    }
  };

  const fetchUnderperformers = async () => {
    try {
      console.log('🔄 Fetching underperformers for last 3 days...');
      
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 400)); // Simulate API delay
      
      setUnderperformers(mockUnderperformers);
      console.log('✅ Underperformers found:', mockUnderperformers.length);
    } catch (error) {
      console.error('❌ Error in fetchUnderperformers:', error);
      toast({
        title: "Error",
        description: "Failed to load underperformers data",
        variant: "destructive",
      });
    }
  };

  const fetchMemberTimeLogs = async (memberEmail, date) => {
    try {
      console.log('🔄 Fetching time logs for member:', memberEmail, 'date:', format(date, 'yyyy-MM-dd'));
      
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API delay
      
      // Filter mock data for selected member and date
      const selectedDateStr = format(date, 'yyyy-MM-dd');
      const filteredLogs = mockTimeLogs.filter(log => 
        log.logged_by === memberEmail && 
        log.logged_at.startsWith(selectedDateStr)
      );

      setTimeLogs(filteredLogs);
      console.log('✅ Member time logs loaded:', filteredLogs.length);
    } catch (error) {
      console.error('❌ Error in fetchMemberTimeLogs:', error);
      toast({
        title: "Error",
        description: "Failed to load time logs",
        variant: "destructive",
      });
    }
  };

  // API Payloads for future implementation
  const apiPayloads = {
    // Get team members payload
    getTeamMembers: {
      method: 'GET',
      url: '/api/team-members',
      params: {
        is_active: true,
        exclude_role: 'admin',
        order_by: 'name'
      }
    },

    // Get today's total payload
    getTodayTotal: {
      method: 'GET',
      url: '/api/time-logs/today-total',
      params: {
        date: format(new Date(), 'yyyy-MM-dd')
      }
    },

    // Get underperformers payload
    getUnderperformers: {
      method: 'GET',
      url: '/api/time-logs/underperformers',
      params: {
        start_date: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
        end_date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
        min_hours: 8
      }
    },

    // Get member time logs payload
    getMemberTimeLogs: {
      method: 'GET',
      url: '/api/time-logs/member',
      params: {
        member_email: selectedMember,
        date: format(selectedDate, 'yyyy-MM-dd')
      }
    },

    // Create time log payload
    createTimeLog: {
      method: 'POST',
      url: '/api/time-logs',
      data: {
        task_id: 'task-id',
        start_time: '2024-01-15T09:00:00Z',
        end_time: '2024-01-15T12:00:00Z',
        time_spent_minutes: 180,
        logged_by: 'user@email.com',
        description: 'Work description'
      }
    },

    // Update time log payload
    updateTimeLog: {
      method: 'PUT',
      url: '/api/time-logs/:id',
      data: {
        start_time: '2024-01-15T09:00:00Z',
        end_time: '2024-01-15T12:00:00Z',
        time_spent_minutes: 180,
        description: 'Updated work description'
      }
    },

    // Delete time log payload
    deleteTimeLog: {
      method: 'DELETE',
      url: '/api/time-logs/:id'
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchTeamMembers(),
        fetchTodayTotal(),
        fetchUnderperformers()
      ]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (selectedMember) {
      fetchMemberTimeLogs(selectedMember, selectedDate);
    }
  }, [selectedMember, selectedDate]);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatTime = (timeString) => {
    try {
      return format(new Date(timeString), 'HH:mm');
    } catch (error) {
      return 'Invalid time';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading timesheet data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full p-6">
      <h2 className="text-2xl font-bold">Team Timesheets</h2>
      
      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Total Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {formatDuration(todayTotal)}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Total logged by all team members today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Underperformers (Last 3 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {underperformers.length}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Days with less than 8 hours logged
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Underperformers Details */}
      {underperformers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Underperformers Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {underperformers.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium">{entry.team_member_name}</p>
                    <p className="text-sm text-gray-600">{format(new Date(entry.date), 'MMM dd, yyyy')}</p>
                  </div>
                  <Badge variant="outline" className="text-orange-600 border-orange-300">
                    {formatDuration(entry.total_minutes)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Member Timesheet Viewer */}
      <Card>
        <CardHeader>
          <CardTitle>Team Member Timesheet</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.email}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {member.name} ({member.role})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
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
          </div>
        </CardHeader>
        <CardContent>
          {selectedMember ? (
            timeLogs.length > 0 ? (
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
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-sm font-medium">
                        {formatDuration(log.time_spent_minutes)}
                      </Badge>
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900">
                    Total for {format(selectedDate, 'MMM dd, yyyy')}: {' '}
                    <span className="text-blue-600">
                      {formatDuration(timeLogs.reduce((total, log) => total + log.time_spent_minutes, 0))}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Time Logs Found</h3>
                <p className="text-gray-600">
                  No time logged for {format(selectedDate, 'MMM dd, yyyy')}
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select Team Member</h3>
              <p className="text-gray-600">
                Choose a team member to view their timesheet
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Payloads Debug Section (remove in production) */}
      <Card className="border-dashed border-gray-300">
        <CardHeader>
          <CardTitle className="text-sm text-gray-600">API Payloads (Debug)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-gray-500 space-y-2">
            <p><strong>Get Team Members:</strong> {JSON.stringify(apiPayloads.getTeamMembers, null, 2)}</p>
            <p><strong>Get Today Total:</strong> {JSON.stringify(apiPayloads.getTodayTotal, null, 2)}</p>
            <p><strong>Get Underperformers:</strong> {JSON.stringify(apiPayloads.getUnderperformers, null, 2)}</p>
            <p><strong>Get Member Time Logs:</strong> {JSON.stringify(apiPayloads.getMemberTimeLogs, null, 2)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 