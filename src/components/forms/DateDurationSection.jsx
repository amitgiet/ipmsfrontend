import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format, addDays } from 'date-fns';

export const DateDurationSection = ({ formData, errors, onInputChange }) => {
  // Auto-calculate end date when start date or duration changes
  useEffect(() => {
    if (formData.startDate && formData.duration && formData.duration > 0) {
      const calculatedEndDate = addDays(formData.startDate, parseInt(formData.duration) - 1);
      onInputChange('endDate', calculatedEndDate);
    }
  }, [formData.startDate, formData.duration, onInputChange]);

  // Check if end date field should be enabled
  const isEndDateEnabled = formData.startDate && formData.duration && formData.duration > 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Dates & Duration</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : ''}
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : undefined;
              onInputChange('startDate', date);
            }}
            className={errors.startDate ? 'border-red-500' : ''}
            required
          />
          {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (days) *</Label>
          <div className="flex">
            <Input
              id="duration"
              type="number"
              min="1"
              value={formData.duration || ''}
              onChange={(e) => onInputChange('duration', e.target.value)}
              placeholder="Enter duration in days"
              className={`rounded-r-none ${errors.duration ? 'border-red-500' : ''}`}
              required
            />
            <div className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md text-sm text-gray-600">
              days
            </div>
          </div>
          {errors.duration && <p className="text-sm text-red-500">{errors.duration}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate ? format(formData.endDate, "yyyy-MM-dd") : ''}
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : undefined;
              onInputChange('endDate', date);
            }}
            className={`${errors.endDate ? 'border-red-500' : ''} ${!isEndDateEnabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            disabled={!isEndDateEnabled}
            required
          />
          {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
          {!isEndDateEnabled && (
            <p className="text-xs text-gray-500">
              Auto-calculated from start date + duration
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-gray-500">
          💡 <strong>How it works:</strong> Enter the start date and duration, and the end date will be automatically calculated for you.
        </p>
      </div>
    </div>
  );
}; 