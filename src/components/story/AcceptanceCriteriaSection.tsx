
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, X } from 'lucide-react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUserRole } from '@/hooks/useUserRole';
import QuillEditor from '../common/QuillEditor';

interface AcceptanceCriteriaSectionProps {
  storyId: string;
  acceptanceCriteria?: string;
  storyStatus: string;
  onUpdate: () => void;
  canEdit?: boolean;
}

export const AcceptanceCriteriaSection: React.FC<AcceptanceCriteriaSectionProps> = ({
  storyId,
  acceptanceCriteria,
  storyStatus,
  onUpdate,
  canEdit = true
}) => {
  const { userRole } = useUserRole();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(acceptanceCriteria || '');
  const [isLoading, setIsLoading] = useState(false);
  const { projectId } = useParams();
  const handleSave = async () => {
    if (!canEdit) return;
    
    setIsLoading(true);
    try {
      const { error } = await apiCall(allRoutes.stories.update(storyId), 'post', { 
        project_id: projectId,
        acceptance_criteria: editValue.trim() || null,
        _method:"patch"
      });

      if (error) {
        return;
      }

      toast.success("Acceptance criteria updated successfully");
      
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating acceptance criteria:', error);
      toast.error("Failed to update acceptance criteria");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditValue(acceptanceCriteria || '');
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Acceptance Criteria</CardTitle>
          {userRole === 'product_owner' && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            {/* <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="Define the acceptance criteria for this story..."
              rows={6}
              disabled={isLoading}
            /> */}
            <QuillEditor
              text={editValue}
              setText={setEditValue}
              placeholder="Define the acceptance criteria for this story..."
              limit={1000}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button> 
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                size="sm"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {acceptanceCriteria ? (
              <div className="prose prose-sm max-w-none">
                <div 
                  className="text-gray-700 ql-editor"
                  dangerouslySetInnerHTML={{ __html: acceptanceCriteria }}
                />
              </div>
            ) : (
              <p className="text-gray-500 italic">No acceptance criteria defined</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
