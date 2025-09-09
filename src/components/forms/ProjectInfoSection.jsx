import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';

export const ProjectInfoSection = ({ formData, errors, onInputChange, isEditMode = false }) => {
  const [projectTypes, setProjectTypes] = useState([]);
  const [projectNatures, setProjectNatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedNatures, setSelectedNatures] = useState([]);

  const fetchMasterData = async () => {
    setLoading(true);
    try {
      // Fetch project types and natures
      const [typesResponse, naturesResponse] = await Promise.all([
        apiCall(allRoutes.master.types_create_or_get(1), 'get'),
        apiCall(allRoutes.master.natures_create_or_get(1), 'get')
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
  
  useEffect(() => {
    fetchMasterData();
  }, []);

  // Initialize selected types and natures from form data
  useEffect(() => {
    if (formData.projectType) {
      setSelectedTypes(Array.isArray(formData.projectType) ? formData.projectType : [formData.projectType]);
    }
    if (formData.projectNature) {
      setSelectedNatures(Array.isArray(formData.projectNature) ? formData.projectNature : [formData.projectNature]);
    }
  }, [formData.projectType, formData.projectNature]);

  const removeType = (typeId) => {
    const newSelectedTypes = selectedTypes.filter(t => t !== typeId);
    setSelectedTypes(newSelectedTypes);
    onInputChange('projectType', newSelectedTypes);
  };

  const removeNature = (natureId) => {
    const newSelectedNatures = selectedNatures.filter(n => n !== natureId);
    setSelectedNatures(newSelectedNatures);
    onInputChange('projectNature', newSelectedNatures);
  };

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
          <div className="space-y-3">
            <Select 
              value="" 
              onValueChange={(value) => {
                if (value && !selectedTypes.includes(value)) {
                  const newSelectedTypes = [...selectedTypes, value];
                  setSelectedTypes(newSelectedTypes);
                  onInputChange('projectType', newSelectedTypes);
                }
              }}
            >
              <SelectTrigger className={errors.projectType ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select project types" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>Loading types...</SelectItem>
                ) : projectTypes.length > 0 ? (
                  projectTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id} disabled={selectedTypes.includes(type.id)}>
                      {type.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-types" disabled>No types available</SelectItem>
                )}
              </SelectContent>
            </Select>
            {selectedTypes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedTypes.map((typeId) => {
                  const type = projectTypes.find(t => t.id === typeId);
                  return (
                    <Badge key={typeId} variant="secondary" className="text-xs">
                      {type ? type.name : typeId}
                      <button
                        type="button"
                        onClick={() => removeType(typeId)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
          {errors.projectType && <p className="text-sm text-red-500">{errors.projectType}</p>}
        </div>

        <div className="space-y-2">
          <Label>Project Nature *</Label>
          <div className="space-y-3">
            <Select 
              value="" 
              onValueChange={(value) => {
                if (value && !selectedNatures.includes(value)) {
                  const newSelectedNatures = [...selectedNatures, value];
                  setSelectedNatures(newSelectedNatures);
                  onInputChange('projectNature', newSelectedNatures);
                }
              }}
            >
              <SelectTrigger className={errors.projectNature ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select project natures" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>Loading natures...</SelectItem>
                ) : projectNatures.length > 0 ? (
                  projectNatures.map((nature) => (
                    <SelectItem key={nature.id} value={nature.id} disabled={selectedNatures.includes(nature.id)}>
                      {nature.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-natures" disabled>No natures available</SelectItem>
                )}
              </SelectContent>
            </Select>
            {selectedNatures.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedNatures.map((natureId) => {
                  const nature = projectNatures.find(n => n.id === natureId);
                  return (
                    <Badge key={natureId} variant="outline" className="text-xs">
                      {nature ? nature.name : natureId}
                      <button
                        type="button"
                        onClick={() => removeNature(natureId)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
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