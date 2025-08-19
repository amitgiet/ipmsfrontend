import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Bug, AlertTriangle, CheckCircle, Clock, Edit, Trash2, Loader2 } from 'lucide-react';
import { apiCall } from '@/services/apiCall';

import { useUserRole } from '@/hooks/useUserRole';
import { BugReportDialog } from './BugReportDialog';
import { BugDetailsDialog } from './BugDetailsDialog';
import { toast } from 'react-toastify';
import { allRoutes } from '@/services/routes';

interface Bug {
  id: string;
  story_id: string;
  sprint_id: string;
  title: string;
  description?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'resolved' | 'reopened';
  reported_by: string;
  assigned_to?: string;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  story_title?: string;
}

interface Story {
  id: string;
  title: string;
}

interface SprintIssuesViewProps {
  sprintId: string;
  stories: Story[];
}

export const SprintIssuesView: React.FC<SprintIssuesViewProps> = ({
  sprintId,
  stories
}) => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBugDialog, setShowBugDialog] = useState(false);
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);

  const { userRole, isQA, isTeamLead, isDeveloper } = useUserRole();

  const fetchBugs = async () => {
    try {
      setLoading(true);

      const { data: bugsData, error } = await apiCall(allRoutes.sprints.getBugs(sprintId), 'GET');


      
      // Enrich bugs with story titles and ensure proper typing
      const enrichedBugs: Bug[] = bugsData?.map(bug => {
        const story = stories.find(s => s.id === bug.story_id);
        return {
          id: bug.id,
          story_id: bug.story_id,
          sprint_id: bug.sprint_id,
          title: bug.title,
          description: bug.description || undefined,
          severity: bug.severity as 'low' | 'medium' | 'high' | 'critical',
          status: bug.status as 'open' | 'resolved' | 'reopened',
          reported_by: bug.reported_by,
          assigned_to: bug.assigned_to || undefined,
          resolved_by: bug.resolved_by || undefined,
          resolved_at: bug.resolved_at || undefined,
          created_at: bug.created_at,
          updated_at: bug.updated_at,
          story_title: story?.title || 'Unknown Story'
        };
      }) || [];

      setBugs(enrichedBugs);
    } catch (error) {
      toast.error("Failed to fetch bugs");
    } finally {
      setLoading(false);
    }
  };

  const handleResolveBug = async (bugId: string) => {
    try {

      const { error } = await apiCall(allRoutes.sprints.updateBug(bugId), 'PUT', {
          status: 'resolved',
          resolved_by: 'Current User', // You can enhance this to get actual user info
          resolved_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
      });

      if (error) {
        toast.error("Failed to resolve bug");
      }
      toast.success("Bug marked as resolved");

      fetchBugs(); // Refresh the list
    } catch (error) {
      toast.error("Failed to resolve bug");
    }
  };

  const handleReopenBug = async (bugId: string) => {
    try {

      const { error } = await apiCall(allRoutes.sprints.updateBug(bugId), 'PUT', {
          status: 'reopened',
          resolved_by: null,
          resolved_at: null,
          updated_at: new Date().toISOString()
        });

      if (error) {
        toast.error("Failed to reopen bug");
      }

      toast.success("Bug reopened");

      fetchBugs(); // Refresh the list
    } catch (error) {
      toast.error("Failed to reopen bug");
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'reopened':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  useEffect(() => {
    fetchBugs();
  }, [sprintId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const openBugs = bugs.filter(bug => bug.status === 'open' || bug.status === 'reopened');
  const resolvedBugs = bugs.filter(bug => bug.status === 'resolved');

  return (
    <>
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-red-600" />
            Issues & Bugs
            <Badge variant="outline" className="ml-2">
              {openBugs.length} Open
            </Badge>
          </CardTitle>
          {isQA && (
            <Button onClick={() => setShowBugDialog(true)} className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Report Bug
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {bugs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bug className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">No issues reported yet</p>
              <p className="text-sm">Issues will appear here when reported by QA</p>
            </div>
          ) : (
            <div className="space-y-6">
              {openBugs.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Open Issues ({openBugs.length})
                  </h3>
                  <div className="space-y-3">
                    {openBugs.map(bug => (
                      <div key={bug.id} className="border rounded-lg p-4 bg-red-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-gray-900">{bug.title}</h4>
                              <Badge className={getSeverityColor(bug.severity)}>
                                {bug.severity.toUpperCase()}
                              </Badge>
                              <Badge className={getStatusColor(bug.status)}>
                                {bug.status.toUpperCase()}
                              </Badge>
                            </div>
                            {bug.description && (
                              <p className="text-gray-600 text-sm mb-2">{bug.description}</p>
                            )}
                            <div className="text-xs text-gray-500">
                              <span>Story: {bug.story_title}</span>
                              <span className="mx-2">•</span>
                              <span>Reported by: {bug.reported_by}</span>
                              <span className="mx-2">•</span>
                              <span>{new Date(bug.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedBug(bug)}
                            >
                              View Details
                            </Button>
                            {(isTeamLead || isDeveloper) && (
                              <Button
                                size="sm"
                                onClick={() => handleResolveBug(bug.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Resolve
                              </Button>
                            )}
                            {isQA && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedBug(bug)}
                              >
                                Add Comment
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resolvedBugs.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Resolved Issues ({resolvedBugs.length})
                  </h3>
                  <div className="space-y-3">
                    {resolvedBugs.map(bug => (
                      <div key={bug.id} className="border rounded-lg p-4 bg-green-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-gray-900">{bug.title}</h4>
                              <Badge className={getSeverityColor(bug.severity)}>
                                {bug.severity.toUpperCase()}
                              </Badge>
                              <Badge className={getStatusColor(bug.status)}>
                                {bug.status.toUpperCase()}
                              </Badge>
                            </div>
                            {bug.description && (
                              <p className="text-gray-600 text-sm mb-2">{bug.description}</p>
                            )}
                            <div className="text-xs text-gray-500">
                              <span>Story: {bug.story_title}</span>
                              <span className="mx-2">•</span>
                              <span>Resolved by: {bug.resolved_by}</span>
                              <span className="mx-2">•</span>
                              <span>{bug.resolved_at ? new Date(bug.resolved_at).toLocaleDateString() : 'Unknown'}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedBug(bug)}
                            >
                              View Details
                            </Button>
                            {isQA && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReopenBug(bug.id)}
                                className="text-orange-600 border-orange-600 hover:bg-orange-50"
                              >
                                <Clock className="h-4 w-4 mr-1" />
                                Reopen
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <BugReportDialog
        isOpen={showBugDialog}
        onClose={() => setShowBugDialog(false)}
        sprintId={sprintId}
        stories={stories}
        onBugReported={fetchBugs}
      />

      {selectedBug && (
        <BugDetailsDialog
          bug={selectedBug}
          isOpen={!!selectedBug}
          onClose={() => setSelectedBug(null)}
          onBugUpdated={fetchBugs}
        />
      )}
    </>
  );
};
