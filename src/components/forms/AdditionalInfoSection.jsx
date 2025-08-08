import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const AdditionalInfoSection = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Additional Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="documents">Documents</Label>
          <Textarea
            id="documents"
            value={formData.documents || ''}
            onChange={(e) => onInputChange('documents', e.target.value)}
            placeholder="Enter documents"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="milestones">Milestones</Label>
          <Textarea
            id="milestones"
            value={formData.milestones || ''}
            onChange={(e) => onInputChange('milestones', e.target.value)}
            placeholder="Enter milestones"
            rows={3}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientDependencies">Client Dependencies</Label>
        <Textarea
          id="clientDependencies"
          value={formData.clientDependencies || ''}
          onChange={(e) => onInputChange('clientDependencies', e.target.value)}
          placeholder="Enter client dependencies"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tagsLabels">Tags / Labels</Label>
        <Input
          id="tagsLabels"
          value={formData.tagsLabels || ''}
          onChange={(e) => onInputChange('tagsLabels', e.target.value)}
          placeholder="Enter tags (comma separated)"
        />
      </div>
    </div>
  );
}; 