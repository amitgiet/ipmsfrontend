import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';

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

interface TestCaseDetailsDialogProps {
  open: boolean;
  testCase: TestCase;
  onClose: () => void;
  onUpdate: () => void;
}

export const TestCaseDetailsDialog: React.FC<TestCaseDetailsDialogProps> = ({
  open,
  testCase,
  onClose,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    preconditions: '',
    steps: '',
    expected_results: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { userRole } = useUserRole();

  // Check if user can edit test case details (QA only, but all roles can view)
  const canEdit = userRole === 'qa';

  useEffect(() => {
    if (testCase) {
      setFormData({
        title: testCase.title || '',
        description: testCase.description || '',
        preconditions: testCase.preconditions || '',
        steps: testCase.steps || '',
        expected_results: testCase.expected_results || ''
      });
      setIsEditing(false);
    }
  }, [testCase]);

  const handleSave = async () => {
    if (!canEdit) return;

    setLoading(true);
    try {
      const { error } = await apiCall(allRoutes.testCases.update(testCase.id), 'put', {
          title: formData.title,
          description: formData.description || null,
          preconditions: formData.preconditions || null,
          steps: formData.steps,
          expected_results: formData.expected_results,
          updated_at: new Date().toISOString()
      });

      if (error) {
        console.error('Error updating test case:', error);
        toast({
          title: "Error",
          description: "Failed to update test case details",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Test case details updated successfully",
      });

      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating test case:', error);
      toast({
        title: "Error",
        description: "Failed to update test case details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: testCase.title || '',
      description: testCase.description || '',
      preconditions: testCase.preconditions || '',
      steps: testCase.steps || '',
      expected_results: testCase.expected_results || ''
    });
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Test Case Details: {testCase.tc_id}</span>
            {canEdit && !isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            {isEditing ? (
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter test case title"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md">{formData.title}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            {isEditing ? (
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter test case description"
                rows={3}
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md min-h-[80px]">
                {formData.description || 'No description provided'}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="preconditions">Preconditions</Label>
            {isEditing ? (
              <Textarea
                id="preconditions"
                value={formData.preconditions}
                onChange={(e) => setFormData({ ...formData, preconditions: e.target.value })}
                placeholder="Enter preconditions for this test case"
                rows={3}
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md min-h-[80px]">
                {formData.preconditions || 'No preconditions specified'}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="steps">Test Steps *</Label>
            {isEditing ? (
              <Textarea
                id="steps"
                value={formData.steps}
                onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                placeholder="Enter detailed test steps"
                rows={5}
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md min-h-[120px] whitespace-pre-wrap">
                {formData.steps || 'No test steps provided'}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected_results">Expected Results *</Label>
            {isEditing ? (
              <Textarea
                id="expected_results"
                value={formData.expected_results}
                onChange={(e) => setFormData({ ...formData, expected_results: e.target.value })}
                placeholder="Enter expected results"
                rows={4}
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md min-h-[100px] whitespace-pre-wrap">
                {formData.expected_results || 'No expected results provided'}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading || !formData.title || !formData.steps || !formData.expected_results}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}

          {!canEdit && (
            <div className="text-sm text-gray-500 italic bg-blue-50 p-3 rounded-md">
              <strong>Note:</strong> You can view all test case details. Only QA team members can edit test case information.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};