
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, User, FolderPlus, Bell } from 'lucide-react';

interface Project {
  id: string;
  project_name: string;
  created_at: string;
  project_status: string | null;
  client_name: string | null;
}

interface AdminRecentActivityProps {
  projects?: Project[];
}

export const AdminRecentActivity = ({ projects }: AdminRecentActivityProps) => {
  const [notificationFreq, setNotificationFreq] = useState('1x');

  // Use only real projects data, no demo data
  const recentProjects = projects && projects.length > 0 ? projects.slice(0, 5) : [];

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'planned':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in_progress':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-blue-600" />
            Recent Activity
          </CardTitle>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Notification Freq:</span>
            <Select value={notificationFreq} onValueChange={setNotificationFreq}>
              <SelectTrigger className="w-20 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1x">1x</SelectItem>
                <SelectItem value="2x">2x</SelectItem>
                <SelectItem value="3x">3x</SelectItem>
                <SelectItem value="4x">4x</SelectItem>
                <SelectItem value="5x">5x</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentProjects.length > 0 ? (
            recentProjects.map((project, index) => (
              <div 
                key={project.id} 
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50/80 transition-colors border border-gray-100/50"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <FolderPlus className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 truncate">
                        {project.project_name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {project.client_name && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <User className="h-3 w-3" />
                            <span className="truncate">{project.client_name}</span>
                          </div>
                        )}
                        {project.project_status && (
                          <Badge className={`text-xs ${getStatusColor(project.project_status)}`}>
                            {project.project_status}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatTime(project.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Project created and added to the system
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <FolderPlus className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No recent activity</p>
              <p className="text-gray-400 text-xs">Projects will appear here once they are created</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
