
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface MindmapNode {
  id: string;
  title: string;
  type: 'user' | 'epic' | 'feature' | 'task' | 'user_story';
  children: MindmapNode[];
  isExpanded: boolean;
  hasUserStory?: boolean;
}

interface AddChildItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentNode: MindmapNode | null;
  onAddChild: (title: string) => void;
}

const typeColors = {
  user: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  epic: 'bg-purple-100 text-purple-800 border-purple-200',
  feature: 'bg-blue-100 text-blue-800 border-blue-200',
  task: 'bg-green-100 text-green-800 border-green-200',
  user_story: 'bg-orange-100 text-orange-800 border-orange-200',
};

const getChildType = (parentType: string): 'user' | 'epic' | 'feature' | 'task' | 'user_story' => {
  switch (parentType) {
    case 'user': return 'epic';
    case 'epic': return 'feature';
    case 'feature': return 'task';
    case 'task': return 'user_story';
    default: return 'user';
  }
};

export const AddChildItemDialog = ({ 
  open, 
  onOpenChange, 
  parentNode, 
  onAddChild 
}: AddChildItemDialogProps) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddChild(title.trim());
      setTitle('');
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    onOpenChange(false);
  };

  if (!parentNode) return null;
  
  const childType = getChildType(parentNode.type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Child Item
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Parent Item</Label>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <span className="flex-1 text-sm">{parentNode.title}</span>
              <Badge className={typeColors[parentNode.type]}>
                {parentNode.type === 'user_story' ? 'user story' : parentNode.type}
              </Badge>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="child-title">
                New {childType === 'user_story' ? 'User Story' : childType.charAt(0).toUpperCase() + childType.slice(1)} Title
              </Label>
              <Input
                id="child-title"
                placeholder={`Enter ${childType === 'user_story' ? 'user story' : childType} title...`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Will be created as:</span>
              <Badge className={typeColors[childType]}>
                {childType === 'user_story' ? 'user story' : childType}
              </Badge>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!title.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add {childType === 'user_story' ? 'User Story' : childType.charAt(0).toUpperCase() + childType.slice(1)}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
