
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MindmapNode {
  id: string;
  title: string;
  type: 'user' | 'epic' | 'feature' | 'task' | 'user_story';
  children: MindmapNode[];
  isExpanded: boolean;
  hasUserStory?: boolean;
}

interface UserStoryData {
  asA: string;
  iShouldBeAbleTo: string;
  soThatICan: string;
}

interface UserStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNode: MindmapNode | null;
  userStoryData: UserStoryData;
  onUserStoryDataChange: (data: UserStoryData) => void;
  onAddToBacklog: () => void;
}

export const UserStoryDialog = ({
  open,
  onOpenChange,
  selectedNode,
  userStoryData,
  onUserStoryDataChange,
  onAddToBacklog
}: UserStoryDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Convert to User Story</DialogTitle>
          <DialogDescription>
            Converting: "{selectedNode?.title}"
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <Label className="text-sm font-medium text-gray-700">Original Description:</Label>
              <p className="text-sm mt-1">{selectedNode?.title}</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="asA">As a</Label>
                <Input
                  id="asA"
                  value={userStoryData.asA}
                  onChange={(e) => onUserStoryDataChange({ ...userStoryData, asA: e.target.value })}
                  placeholder="e.g., user, admin, customer"
                />
              </div>

              <div>
                <Label htmlFor="iShouldBeAbleTo">I should be able to</Label>
                <Textarea
                  id="iShouldBeAbleTo"
                  value={userStoryData.iShouldBeAbleTo}
                  onChange={(e) => onUserStoryDataChange({ ...userStoryData, iShouldBeAbleTo: e.target.value })}
                  placeholder="Describe what the user should be able to do"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="soThatICan">So that I can</Label>
                <Textarea
                  id="soThatICan"
                  value={userStoryData.soThatICan}
                  onChange={(e) => onUserStoryDataChange({ ...userStoryData, soThatICan: e.target.value })}
                  placeholder="Describe the value or benefit"
                  rows={2}
                />
              </div>
            </div>

            {userStoryData.asA && userStoryData.iShouldBeAbleTo && userStoryData.soThatICan && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Label className="text-sm font-medium text-blue-800">Preview:</Label>
                <p className="text-sm mt-1 text-blue-700">
                  As a <strong>{userStoryData.asA}</strong> I should be able to <strong>{userStoryData.iShouldBeAbleTo}</strong> so that I can <strong>{userStoryData.soThatICan}</strong>
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onAddToBacklog}
            disabled={!userStoryData.asA || !userStoryData.iShouldBeAbleTo || !userStoryData.soThatICan}
          >
            Add to Backlog
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
