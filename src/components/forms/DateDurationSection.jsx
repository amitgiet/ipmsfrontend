import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

export const DateDurationSection = ({ formData, errors, onInputChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Dates & Duration</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date * (Y-m-d)</Label>
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
          <Label htmlFor="endDate">End Date * (Y-m-d)</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate ? format(formData.endDate, "yyyy-MM-dd") : ''}
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : undefined;
              onInputChange('endDate', date);
            }}
            className={errors.endDate ? 'border-red-500' : ''}
            placeholder="YYYY-MM-DD"
            required
          />
          {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
        </div>
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
        <p className="text-xs text-gray-500">
          End date will be auto-calculated when you change start date or duration
        </p>
      </div>
    </div>
  );
}; 