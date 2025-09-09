
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';

interface BacklogControlsProps {
  newStoryTitle: string;
  onNewStoryTitleChange: (title: string) => void;
  onAddManualStory: () => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  filterStatus: string;
  onFilterStatusChange: (status: string) => void;
}

export const BacklogControls = ({
  newStoryTitle,
  onNewStoryTitleChange,
  onAddManualStory,
  searchTerm,
  onSearchTermChange,
  filterStatus,
  onFilterStatusChange
}: BacklogControlsProps) => {
  return (
    <div className="space-y-4">
      {/* Add Story Controls */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex gap-2 flex-1">
          <Input
            placeholder="Add new user story..."
            value={newStoryTitle}
            onChange={(e) => onNewStoryTitleChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onAddManualStory()}
          />
          <Button onClick={onAddManualStory}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 items-center">
        <Search className="h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="max-w-xs"
        />
        <Select value={filterStatus} onValueChange={onFilterStatusChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="to_do">To Do</SelectItem>
            <SelectItem value="in_grooming">In Grooming</SelectItem>
            <SelectItem value="estimated">Estimated</SelectItem>
            <SelectItem value="ready_for_estimate">Ready for Estimate</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="qa">QA</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
