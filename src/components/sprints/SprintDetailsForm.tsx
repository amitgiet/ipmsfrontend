
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SprintDetailsFormProps {
  sprintName: string;
  setSprintName: (name: string) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  duration: number;
  setDuration: (duration: number) => void;
  endDate: Date | null;
}

export const SprintDetailsForm = ({
  sprintName,
  setSprintName,
  startDate,
  setStartDate,
  duration,
  setDuration,
  endDate
}: SprintDetailsFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sprint Details</CardTitle>
        <CardDescription>Configure your sprint parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sprint_name">Sprint Name</Label>
          <Input
            id="sprint_name"
            value={sprintName}
            onChange={(e) => setSprintName(e.target.value)}
            placeholder="e.g., Sprint 1"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Pick start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                className="p-3 pointer-events-auto"
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                classNames={{
                  day_disabled: "text-gray-400 opacity-50 cursor-not-allowed"
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (working days)</Label>
          <Input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            min="0" 
            max="90"
          />
        </div>

        <div className="space-y-2">
          <Label>End Date (Auto-calculated)</Label>
          <Input
            value={endDate ? format(endDate, "PPP") : ""}
            readOnly
            className="bg-gray-50"
          />
        </div>
      </CardContent>
    </Card>
  );
};
