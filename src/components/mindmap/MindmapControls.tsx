
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Users } from 'lucide-react';

interface MindmapNode {
  id: string;
  title: string;
  type: 'user' | 'epic' | 'feature' | 'task' | 'user_story';
  children: MindmapNode[];
  isExpanded: boolean;
  hasUserStory?: boolean;
}

interface MindmapControlsProps {
  onAddUser: (title: string) => Promise<void>;
  onShowAddEpicDialog: () => void;
  hasUsers: boolean;
  readOnly?: boolean;
}

export const MindmapControls = ({ 
  onAddUser, 
  onShowAddEpicDialog, 
  hasUsers, 
  readOnly = false 
}: MindmapControlsProps) => {
  const [newUserTitle, setNewUserTitle] = useState('');

  const handleAddUser = async () => {
    if (!newUserTitle.trim() || readOnly) return;
    
    await onAddUser(newUserTitle.trim());
    setNewUserTitle('');
  };

  if (readOnly) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Add new user..."
          value={newUserTitle}
          onChange={(e) => setNewUserTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddUser()}
        />
        <Button onClick={handleAddUser}>
          <Users className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {hasUsers && (
        <div className="flex gap-2">
          <Button 
            onClick={onShowAddEpicDialog}
            variant="outline"
            className="flex-1"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Epic to Users
          </Button>
        </div>
      )}
    </div>
  );
};
