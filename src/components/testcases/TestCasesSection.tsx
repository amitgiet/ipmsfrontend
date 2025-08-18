import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import { TestCaseUploadDialog } from './TestCaseUploadDialog';
import { TestCaseCommentDialog } from './TestCaseCommentDialog';
import { TestCaseDetailsDialog } from './TestCaseDetailsDialog';

interface TestCase {
  id: string;
  tc_id: string;
  title: string;
  description?: string;
  preconditions?: string;
  steps: string;
  expected_results: string;
  status: 'pending' | 'passed' | 'failed';
  unit_tested: boolean;
  qc_approved: boolean;
  unit_tested_by?: string;
  qc_approved_by?: string;
  unit_tested_at?: string;
  qc_approved_at?: string;
}

interface TestCasesSectionProps {
  storyId: string;
  storyStatus: string;
  onTestCasesChange: () => void;
  canEdit?: boolean;
}

export const TestCasesSection: React.FC<TestCasesSectionProps> = ({ 
  storyId, 
  storyStatus, 
  onTestCasesChange,
  canEdit = true 
}) => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const { toast } = useToast();
  const { userRole } = useUserRole();

  const loadTestCases = async () => {
    try {
        const { data, error } = await apiCall(allRoutes.testCases.list(storyId), 'get');

      if (error) {
        console.error('Error loading test cases:', error);
        return;
      }

      // Map database data to TestCase interface
      const mappedTestCases: TestCase[] = (data || []).map(testCase => ({
        id: testCase.id,
        tc_id: testCase.tc_id,
        title: testCase.title,
        description: testCase.description || undefined,
        preconditions: testCase.preconditions || undefined,
        steps: testCase.steps || '',
        expected_results: testCase.expected_results || '',
        status: (testCase.status as 'pending' | 'passed' | 'failed') || 'pending',
        unit_tested: testCase.unit_tested || false,
        qc_approved: testCase.qc_approved || false,
        unit_tested_by: testCase.unit_tested_by || undefined,
        qc_approved_by: testCase.qc_approved_by || undefined,
        unit_tested_at: testCase.unit_tested_at || undefined,
        qc_approved_at: testCase.qc_approved_at || undefined,
      }));

      setTestCases(mappedTestCases);
    } catch (error) {
      console.error('Error loading test cases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestCases();
  }, [storyId]);

  // Debug logging for test cases
  useEffect(() => {
    if (testCases.length > 0) {
      testCases.forEach(testCase => {
        console.log('🔍 TestCase Debug:', {
          tcId: testCase.tc_id,
          userRole,
          unitTested: testCase.unit_tested,
          canEdit,
          shouldShowButtons: (userRole === 'developer' || userRole === 'team_lead') && !testCase.unit_tested
        });
      });
    }
  }, [testCases, userRole, canEdit]);

  const handleUnitTest = async (testCaseId: string, passed: boolean) => {
    try {
      const { error } = await apiCall(allRoutes.testCases.update(testCaseId), 'put', {
          unit_tested: true,
          unit_tested_at: new Date().toISOString(),
          unit_tested_by: 'Current User', // This should be replaced with actual user name
          status: passed ? 'passed' : 'failed'
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update test case",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Test case marked as ${passed ? 'passed' : 'failed'}`,
      });

      await loadTestCases();
      onTestCasesChange();
    } catch (error) {
      console.error('Error updating test case:', error);
      toast({
        title: "Error",
        description: "Failed to update test case",
        variant: "destructive",
      });
    }
  };

  const handleQCApproval = async (testCaseId: string, approved: boolean) => {
    try {
      const { error } = await apiCall(allRoutes.testCases.update(testCaseId), 'put', {
          qc_approved: approved,
          qc_approved_at: approved ? new Date().toISOString() : null,
          qc_approved_by: approved ? 'Current User' : null, // This should be replaced with actual user name
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update QC approval",
          variant: "destructive",
        });
        return;
      }

      // If test case was rejected, update story status back to in_progress
      if (!approved) {
        console.log('🔄 Test case rejected, updating story status back to in_progress for story:', storyId);
        const { error: statusError } = await apiCall(allRoutes.stories.update(storyId), 'put', { 
            status: 'in_progress',
            updated_at: new Date().toISOString()
        });

        if (statusError) {
          console.error('❌ Error updating story status:', statusError);
          // Don't return here, test case update was successful
        } else {
          console.log('✅ Story status updated to in_progress due to test case rejection');
        }
      }

      toast({
        title: "Success",
        description: `Test case ${approved ? 'approved' : 'rejected'} by QC${!approved ? '. Story moved back to In Progress.' : ''}`,
      });

      await loadTestCases();
      onTestCasesChange();
    } catch (error) {
      console.error('Error updating QC approval:', error);
      toast({
        title: "Error",
        description: "Failed to update QC approval",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Test Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Test Cases</CardTitle>
          {userRole === 'qa' && canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUploadDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Test Cases
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {testCases.length > 0 ? (
          <div className="space-y-4">
            {testCases.map((testCase) => (
              <div key={testCase.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">{testCase.tc_id}</span>
                      <Badge className={getStatusColor(testCase.status)} variant="outline">
                        {getStatusIcon(testCase.status)}
                        {testCase.status}
                      </Badge>
                      {testCase.unit_tested && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Unit Tested
                        </Badge>
                      )}
                      {testCase.qc_approved && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          QC Approved
                        </Badge>
                      )}
                    </div>
                    <h4 
                      className="font-medium mb-1 cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
                      onClick={() => {
                        setSelectedTestCase(testCase);
                        setShowDetailsDialog(true);
                      }}
                    >
                      {testCase.title}
                    </h4>
                    {testCase.description && (
                      <p className="text-sm text-gray-600 mb-3">{testCase.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Developer and Team Lead actions - can mark as unit tested regardless of story edit permissions */}
                  {(userRole === 'developer' || userRole === 'team_lead') && !testCase.unit_tested && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUnitTest(testCase.id, true)}
                        className="text-green-700 border-green-200 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Pass
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUnitTest(testCase.id, false)}
                        className="text-red-700 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Fail
                      </Button>
                    </>
                  )}

                  {/* QA actions - can approve test cases regardless of story edit permissions */}
                  {userRole === 'qa' && testCase.unit_tested && !testCase.qc_approved && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQCApproval(testCase.id, true)}
                        className="text-green-700 border-green-200 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQCApproval(testCase.id, false)}
                        className="text-red-700 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}

                  {/* View Details button */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedTestCase(testCase);
                      setShowDetailsDialog(true);
                    }}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    View Details
                  </Button>

                  {/* Comment button */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedTestCase(testCase);
                      setShowCommentDialog(true);
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Comments
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No test cases uploaded yet</p>
            {userRole === 'qa' && canEdit && (
              <Button
                variant="outline"
                onClick={() => setShowUploadDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload Test Cases
              </Button>
            )}
          </div>
        )}
      </CardContent>

      <TestCaseUploadDialog
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        storyId={storyId}
        onUploadComplete={() => {
          loadTestCases();
          onTestCasesChange();
          setShowUploadDialog(false);
        }}
      />

      {selectedTestCase && (
        <>
          <TestCaseDetailsDialog
            open={showDetailsDialog}
            testCase={selectedTestCase}
            onClose={() => {
              setSelectedTestCase(null);
              setShowDetailsDialog(false);
            }}
            onUpdate={() => {
              loadTestCases();
              onTestCasesChange();
            }}
          />
          
          <TestCaseCommentDialog
            open={showCommentDialog}
            testCase={selectedTestCase}
            onClose={() => {
              setSelectedTestCase(null);
              setShowCommentDialog(false);
            }}
            onCommentAdded={() => {
              loadTestCases();
              onTestCasesChange();
            }}
          />
        </>
      )}
    </Card>
  );
};
