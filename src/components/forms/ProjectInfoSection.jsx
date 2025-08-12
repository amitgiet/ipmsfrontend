import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const ProjectInfoSection = ({ formData, errors, onInputChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Project Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="projectName">Project Name *</Label>
          <Input
            id="projectName"
            value={formData.projectName || ''}
            onChange={(e) => onInputChange('projectName', e.target.value)}
            placeholder="Enter project name"
            className={errors.projectName ? 'border-red-500' : ''}
          />
          {errors.projectName && <p className="text-sm text-red-500">{errors.projectName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectId">Project ID *</Label>
          <Input
            id="projectId"
            value={formData.projectId || ''}
            onChange={(e) => onInputChange('projectId', e.target.value)}
            placeholder="Enter project ID"
            className={errors.projectId ? 'border-red-500' : ''}
          />
          {errors.projectId && <p className="text-sm text-red-500">{errors.projectId}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Project Type *</Label>
          <Select 
            value={formData.projectType || ''} 
            onValueChange={(value) => onInputChange('projectType', value)}
          >
            <SelectTrigger className={errors.projectType ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="web development">Web Development</SelectItem>
              <SelectItem value="mobile app">Mobile App</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="consulting">Consulting</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
          {errors.projectType && <p className="text-sm text-red-500">{errors.projectType}</p>}
        </div>

        <div className="space-y-2">
          <Label>Priority *</Label>
          <Select 
            value={formData.priority || ''} 
            onValueChange={(value) => onInputChange('priority', value)}
          >
            <SelectTrigger className={errors.priority ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
          {errors.priority && <p className="text-sm text-red-500">{errors.priority}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Project Status *</Label>
        <Select 
          value={formData.projectStatus || ''} 
          onValueChange={(value) => onInputChange('projectStatus', value)}
        >
          <SelectTrigger className={errors.projectStatus ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        {errors.projectStatus && <p className="text-sm text-red-500">{errors.projectStatus}</p>}
      </div>
    </div>
  );
}; 