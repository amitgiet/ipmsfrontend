import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, CheckCircle, AlertTriangle, Bug, Calendar, Timer } from 'lucide-react';

export const ProjectOverviewCards = ({ project }) => {
  const navigate = useNavigate();


  const handleHoursLoggedClick = () => {
      navigate(`/project/${project.id}/time-logs`);

  };

  return (
    <div className="space-y-6">
      {/* Project Metrics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Stories in Backlog</p>
                <div className="text-2xl font-bold">{project.story_in_backlog_count}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Stories Completed</p>
                <div className="text-2xl font-bold">{project.story_completed_count}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overrun Sprints</p>
                <div className="text-2xl font-bold">{project.overrun_sprint_count}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Bug className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Issues</p>
                <div className="text-2xl font-bold">{project.total_issues_count}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Duration</p>
                <div className="text-2xl font-bold">{project.duration_days} days</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={handleHoursLoggedClick}
        >
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Timer className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hours Logged</p>
                  <div className="text-2xl font-bold">{project.logged_hours}h</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Other overview cards can be added here in the future */}
    </div>
  );
};
