import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const DateDurationSection = ({ formData, errors, onInputChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Dates & Duration</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.startDate && "text-muted-foreground",
                  errors.startDate && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? format(formData.startDate, "PPP") : "Pick start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => onInputChange('startDate', date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
        </div>

        <div className="space-y-2">
          <Label>End Date (Auto-calculated)</Label>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-gray-50",
              !formData.endDate && "text-muted-foreground"
            )}
            disabled={true}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formData.endDate ? format(formData.endDate, "PPP") : "Auto-calculated"}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration (days) *</Label>
        <div className="flex">
          <Input
            id="duration"
            type="number"
            value={formData.duration || ''}
            onChange={(e) => onInputChange('duration', e.target.value)}
            placeholder="Enter duration in days"
            className={`rounded-r-none ${errors.duration ? 'border-red-500' : ''}`}
          />
          <div className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md text-sm text-gray-600">
            days
          </div>
        </div>
        {errors.duration && <p className="text-sm text-red-500">{errors.duration}</p>}
      </div>
    </div>
  );
}; 