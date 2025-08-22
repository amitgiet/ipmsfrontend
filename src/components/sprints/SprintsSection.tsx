
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Play, CheckCircle, Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSprintsData } from '@/hooks/useSprintsData';
import { SprintsTable } from './SprintsTable';

interface SprintsSectionProps {
  projectId: string;
  readOnly?: boolean;
}

export const SprintsSection = ({ projectId, readOnly = false }: SprintsSectionProps) => {
  const { sprints, sprintMetaData, loading, createSprint, sprintsDashboard } = useSprintsData(projectId);
  const navigate = useNavigate();

  const handleCreateSprint = async () => {
    if (readOnly) {
      alert('Access Denied: Your role does not allow you to create sprints. Admin users have read-only access.');
      return;
    }
    navigate(`/project/${projectId}/sprints/create`);
  };

  const handleManageSprint = (sprintId: string) => {
    navigate(`/sprint/${sprintId}/manage`);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Sprints
            {readOnly && <Eye className="h-4 w-4 text-gray-500" />}
          </CardTitle>
          <CardDescription>Loading sprints...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Sprints
              {readOnly && <Eye className="h-4 w-4 text-gray-500" />}
            </CardTitle>
            <CardDescription>
              {readOnly 
                ? "View project sprints - Admin view (read-only)"
                : "Manage sprints and track progress"
              }
            </CardDescription>
          </div>
          {!readOnly && (
            <Button onClick={handleCreateSprint}>
              <Plus className="h-4 w-4 mr-2" />
              Create Sprint
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Sprint Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Total Sprints</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{sprintMetaData?.total}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Play className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">Active</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{sprintsDashboard?.running}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-purple-900">Completed</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{sprintsDashboard?.completed}</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-orange-900">Created</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">
                {sprintsDashboard?.created}
              </p>
            </div>
          </div>

          {/* Sprints Table */}
          <SprintsTable 
            sprints={sprints} 
            onManageSprint={handleManageSprint}
            readOnly={readOnly}
          />
        </div>
      </CardContent>
    </Card>
  );
};
