
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Users } from 'lucide-react';

interface MindmapNode {
  id: string;
  title: string;
  type: 'user' | 'epic' | 'feature' | 'task' | 'user_story';
  children: MindmapNode[];
  isExpanded: boolean;
  hasUserStory?: boolean;
}

interface AddEpicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: MindmapNode[];
  onAddEpic: (title: string, selectedUserIds: string[]) => void;
}

export const AddEpicDialog = ({ 
  open, 
  onOpenChange, 
  users, 
  onAddEpic 
}: AddEpicDialogProps) => {
  const [title, setTitle] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && selectedUserIds.length > 0) {
      onAddEpic(title.trim(), selectedUserIds);
      setTitle('');
      setSelectedUserIds([]);
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setSelectedUserIds([]);
    onOpenChange(false);
  };

  const handleUserSelection = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUserIds(prev => [...prev, userId]);
    } else {
      setSelectedUserIds(prev => prev.filter(id => id !== userId));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Child To Multiple Users
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="epic-title">Title</Label>
            <Input
              id="epic-title"
              placeholder="Enter title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <Label>Select Users</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {users.map((user) => (
                <div key={user.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={user.id}
                    checked={selectedUserIds.includes(user.id)}
                    onCheckedChange={(checked) => 
                      handleUserSelection(user.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={user.id} className="flex items-center gap-2 cursor-pointer">
                    <Users className="h-4 w-4" />
                    {user.title}
                  </Label>
                </div>
              ))}
            </div>
            
            {selectedUserIds.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <span className="text-sm text-gray-600">Selected:</span>
                {selectedUserIds.map(userId => {
                  const user = users.find(u => u.id === userId);
                  return user ? (
                    <Badge key={userId} variant="secondary" className="text-xs">
                      {user.title}
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!title.trim() || selectedUserIds.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
