import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';

export const ProjectInfoSection = ({ formData, errors, onInputChange, isEditMode = false }) => {
  const [projectTypes, setProjectTypes] = useState([]);
  const [projectNatures, setProjectNatures] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMasterData = async () => {
      setLoading(true);
      try {
        // Fetch project types and natures
        const [typesResponse, naturesResponse] = await Promise.all([
          apiCall(allRoutes.master.types_create_or_get, 'get'),
          apiCall(allRoutes.master.natures_create_or_get, 'get')
        ]);

        if (typesResponse.data) {
          setProjectTypes(typesResponse.data.data);
        }
        
        if (naturesResponse.data) {
          setProjectNatures(naturesResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching master data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMasterData();
  }, []);

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
            value={formData?.projectType} 
            onValueChange={(value) => onInputChange('projectType', value)}
          >
            <SelectTrigger className={errors.projectType ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              {loading ? (
                <SelectItem value="loading" disabled>Loading types...</SelectItem>
              ) : projectTypes.length > 0 ? (
                projectTypes.map((type) => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-types" disabled>No types available</SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.projectType && <p className="text-sm text-red-500">{errors.projectType}</p>}
        </div>

        <div className="space-y-2">
          <Label>Project Nature *</Label>
          <Select 
            value={formData.projectNature || ''} 
            onValueChange={(value) => onInputChange('projectNature', value)}
          >
            <SelectTrigger className={errors.projectNature ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select project nature" />
            </SelectTrigger>
            <SelectContent>
              {loading ? (
                <SelectItem value="loading" disabled>Loading natures...</SelectItem>
              ) : projectNatures.length > 0 ? (
                projectNatures.map((nature) => (
                  <SelectItem key={nature.id} value={nature.name}>
                    {nature.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-natures" disabled>No natures available</SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.projectNature && <p className="text-sm text-red-500">{errors.projectNature}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            {isEditMode ? (
              // When editing, show all statuses
              <>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </>
            ) : (
              // When creating new project, only show Planned
              <SelectItem value="planned">Planned</SelectItem>
            )}
          </SelectContent>
        </Select>
        {errors.projectStatus && <p className="text-sm text-red-500">{errors.projectStatus}</p>}
        {!isEditMode && (
          <p className="text-xs text-gray-500">New projects always start with 'Planned' status</p>
        )}
      </div>
    </div>
  );
}; 