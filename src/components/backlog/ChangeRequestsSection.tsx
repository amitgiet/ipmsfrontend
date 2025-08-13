import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useChangeRequests, ChangeRequest } from '@/hooks/useChangeRequests';
import { ChangeRequestComments } from './ChangeRequestComments';
import { formatDistanceToNow } from 'date-fns';
import { FileEdit, MessageSquare, Check, X, Clock, ArrowRight, Workflow, Bell } from 'lucide-react';

interface ChangeRequestsSectionProps {
  projectId: string;
  currentUserEmail: string;
  currentUserName: string;
  currentUserRole: string;
  canReview?: boolean;
  canApproveAsClient?: boolean;
  canProcessAsEpic?: boolean;
}

export const ChangeRequestsSection = ({ 
  projectId, 
  currentUserEmail,
  currentUserName,
  currentUserRole,
  canReview = false,
  canApproveAsClient = false,
  canProcessAsEpic = false
}: ChangeRequestsSectionProps) => {
  const { changeRequests, loading, updateChangeRequestStatus, processAsEpic, getUnreadCommentsCount, markCommentsAsViewed } = useChangeRequests(projectId);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const handlePOApproval = async (requestId: string) => {
    await updateChangeRequestStatus(requestId, 'po_approved', undefined, currentUserEmail);
  };

  const handlePOReject = async (requestId: string) => {
    await updateChangeRequestStatus(requestId, 'rejected', undefined, currentUserEmail);
  };

  const handleClientApproval = async (requestId: string) => {
    await updateChangeRequestStatus(requestId, 'client_approved', undefined, currentUserEmail);
  };

  const handleProcessAsEpic = async (requestId: string) => {
    await processAsEpic(requestId, currentUserEmail);
  };

  const handleViewComments = (requestId: string) => {
    setSelectedRequestId(requestId);
    // Mark comments as viewed when opening the dialog
    markCommentsAsViewed(requestId, currentUserEmail);
  };

  const getStatusBadge = (status: ChangeRequest['status']) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      po_approved: { color: 'bg-blue-100 text-blue-800', icon: Check, label: 'PO Approved' },
      client_approved: { color: 'bg-green-100 text-green-800', icon: Check, label: 'Client Approved' },
      processed: { color: 'bg-purple-100 text-purple-800', icon: Workflow, label: 'Processed' },
      rejected: { color: 'bg-red-100 text-red-800', icon: X, label: 'Rejected' },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border-0`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: ChangeRequest['priority']) => {
    const priorityColors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={`${priorityColors[priority]} border-0`}>
        {priority}
      </Badge>
    );
  };

  const getTimestamp = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  const canUserActOnRequest = (request: ChangeRequest) => {
    if (request.status === 'pending' && canReview) return true;
    if (request.status === 'po_approved' && canApproveAsClient) return true;
    if (request.status === 'client_approved' && canProcessAsEpic) return true;
    return false;
  };

  const getActionButtons = (request: ChangeRequest) => {
    if (request.status === 'pending' && canReview) {
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => handlePOApproval(request.id)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handlePOReject(request.id)}
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </div>
      );
    }

    if (request.status === 'po_approved' && canApproveAsClient) {
      return (
        <Button
          size="sm"
          onClick={() => handleClientApproval(request.id)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Check className="h-4 w-4 mr-1" />
          Client Approve
        </Button>
      );
    }

    if (request.status === 'client_approved' && canProcessAsEpic) {
      return (
        <Button
          size="sm"
          onClick={() => handleProcessAsEpic(request.id)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Workflow className="h-4 w-4 mr-1" />
          Process as Epic
        </Button>
      );
    }

    return null;
  };

  const getWorkflowProgress = (status: ChangeRequest['status']) => {
    const steps = ['pending', 'po_approved', 'client_approved', 'processed'];
    const currentIndex = steps.indexOf(status);
    
    if (status === 'rejected') {
      return (
        <div className="flex items-center text-sm text-red-600">
          <X className="h-4 w-4 mr-1" />
          Workflow terminated
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-sm">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className={`flex items-center gap-1 ${
              index <= currentIndex ? 'text-green-600' : 'text-gray-400'
            }`}>
              {index <= currentIndex ? (
                <Check className="h-3 w-3" />
              ) : (
                <Clock className="h-3 w-3" />
              )}
              <span className="text-xs">
                {step.replace('_', ' ')}
              </span>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="h-3 w-3 text-gray-400" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileEdit className="h-5 w-5" />
            Change Requests
          </CardTitle>
          <CardDescription>Loading change requests...</CardDescription>
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
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileEdit className="h-5 w-5" />
            Change Requests ({changeRequests.length})
          </CardTitle>
          <CardDescription>
            Workflow: Pending → PO Approval → Client Approval → Process as Epic
          </CardDescription>
        </CardHeader>
        <CardContent>
          {changeRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileEdit className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No change requests submitted yet</p>
              <p className="text-sm">Stakeholders can request changes to the backlog</p>
            </div>
          ) : (
            <div className="space-y-4">
              {changeRequests.map((request) => {
                const unreadCount = getUnreadCommentsCount(request.id, currentUserEmail);
                
                return (
                  <div key={request.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="font-medium">{request.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>by {request.requested_by_name}</span>
                          <span>•</span>
                          <span>{getTimestamp(request.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(request.priority)}
                        {getStatusBadge(request.status)}
                      </div>
                    </div>

                    <p className="text-gray-700 whitespace-pre-wrap">{request.description}</p>

                    {/* Workflow Progress */}
                    <div className="bg-gray-50 rounded p-3">
                      {getWorkflowProgress(request.status)}
                    </div>

                    {/* Action Buttons */}
                    {canUserActOnRequest(request) && (
                      <div className="border-t pt-3">
                        {getActionButtons(request)}
                      </div>
                    )}

                    {/* Comments Button with Unread Indicator */}
                    <div className="border-t pt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewComments(request.id)}
                        className="relative"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        View Comments
                        {unreadCount > 0 && (
                          <div className="absolute -top-2 -right-2 flex items-center">
                            <Bell className="h-4 w-4 text-orange-500 mr-1" />
                            <Badge className="bg-orange-500 text-white text-xs px-1 py-0 min-w-[1.25rem] h-5 flex items-center justify-center">
                              {unreadCount}
                            </Badge>
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments Dialog */}
      <Dialog open={!!selectedRequestId} onOpenChange={() => setSelectedRequestId(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Change Request Comments</DialogTitle>
          </DialogHeader>
          {selectedRequestId && (
            <ChangeRequestComments
              requestId={selectedRequestId}
              currentUserEmail={currentUserEmail}
              currentUserName={currentUserName}
              currentUserRole={currentUserRole}
              onCommentsViewed={markCommentsAsViewed}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
