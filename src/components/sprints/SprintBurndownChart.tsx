import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { differenceInDays, format, addDays } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Sprint {
  id: string;
  sprint_name: string;
  start_date: string;
  end_date: string;
  duration: number;
  status: string;
}

interface Story {
  id: string;
  title: string;
  status: string;
  story_points?: number;
  updated_at: string;
}

interface CompletionData {
  story_id: string;
  story_points: number;
  completion_date: Date;
}

interface SprintBurndownChartProps {
  sprint: Sprint;
  stories: Story[];
  targetStoryPoints: number;
}

const chartConfig = {
  ideal: {
    label: "Ideal",
    color: "#3b82f6", // Blue color for ideal line
  },
  remaining: {
    label: "Remaining", 
    color: "#10b981", // Green color for actual remaining
  },
};

export const SprintBurndownChart = ({ sprint, stories, targetStoryPoints }: SprintBurndownChartProps) => {
  const [completionData, setCompletionData] = useState<CompletionData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCompletionData = async () => {
    if (stories.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const storyIds = stories.map(story => story.id);

      // Fetch completion dates from status change log
      const { data, error } = await supabase
        .from('story_status_changes')
        .select(`
          story_id,
          changed_at,
          new_status,
          user_stories (
            story_points
          )
        `)
        .in('story_id', storyIds)
        .eq('new_status', 'done')
        .order('changed_at', { ascending: true });

      if (error) {
        console.error('❌ Error fetching completion data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch story completion data",
          variant: "destructive",
        });
        return;
      }

      const completions: CompletionData[] = (data || [])
        .filter(change => change.user_stories && (change.user_stories as any).story_points)
        .map(change => ({
          story_id: change.story_id,
          story_points: (change.user_stories as any).story_points,
          completion_date: new Date(change.changed_at)
        }));

      console.log('✅ Fetched completion data:', completions);
      setCompletionData(completions);
    } catch (error) {
      console.error('❌ Error in fetchCompletionData:', error);
      toast({
        title: "Error",
        description: "Failed to fetch completion data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletionData();
  }, [stories]);

  // Generate burndown chart data with proper ideal line
  const generateBurndownData = () => {
    const startDate = new Date(sprint.start_date);
    const endDate = new Date(sprint.end_date);
    const currentDate = new Date();
    const totalDays = differenceInDays(endDate, startDate) + 1;
    
    const data = [];
    
    console.log('📊 Using real completion data for burndown:', completionData);
    
    // Group completions by date to handle multiple completions on same day
    const completionsByDate = new Map<string, number>();
    completionData.forEach(completion => {
      const dateKey = format(completion.completion_date, 'yyyy-MM-dd');
      const currentPoints = completionsByDate.get(dateKey) || 0;
      completionsByDate.set(dateKey, currentPoints + completion.story_points);
    });
    
    // Track running remaining points for actual line
    let currentRemaining = targetStoryPoints;
    
    // Generate data points for each day
    for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
      const currentDateInSprint = addDays(startDate, dayIndex);
      const currentDateString = format(currentDateInSprint, 'yyyy-MM-dd');
      const dayNumber = dayIndex + 1;
      
      // Calculate ideal remaining points (straight line from start to end)
      const idealRemaining = targetStoryPoints - (targetStoryPoints * dayIndex / (totalDays - 1));
      
      // Calculate actual remaining points
      let actualRemaining = currentRemaining;
      
      // Only process dates up to today for actual line
      if (currentDateInSprint <= currentDate) {
        const pointsCompletedToday = completionsByDate.get(currentDateString) || 0;
        if (pointsCompletedToday > 0) {
          currentRemaining -= pointsCompletedToday;
          actualRemaining = currentRemaining;
          console.log(`📅 Day ${dayNumber} (${currentDateString}): ${pointsCompletedToday} points completed, remaining=${currentRemaining}`);
        }
        
        data.push({
          day: dayNumber,
          date: format(currentDateInSprint, 'MMM dd'),
          ideal: Math.max(0, idealRemaining),
          remaining: Math.max(0, actualRemaining),
        });
      } else {
        // For future dates, only show ideal line
        data.push({
          day: dayNumber,
          date: format(currentDateInSprint, 'MMM dd'),
          ideal: Math.max(0, idealRemaining),
          remaining: undefined,
        });
      }
    }
    
    return data;
  };

  const burndownData = generateBurndownData();
  const completedPoints = completionData.reduce((sum, completion) => sum + completion.story_points, 0);
  const remainingPoints = targetStoryPoints - completedPoints;

  if (loading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Sprint Burndown Chart</CardTitle>
          <CardDescription>
            Track the remaining story points throughout the sprint vs ideal progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading burndown data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Sprint Burndown Chart</CardTitle>
        <CardDescription>
          Track the remaining story points throughout the sprint vs ideal progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{targetStoryPoints}</div>
              <div className="text-sm text-gray-600">Total Story Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedPoints}</div>
              <div className="text-sm text-gray-600">Completed Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{remainingPoints}</div>
              <div className="text-sm text-gray-600">Remaining Points</div>
            </div>
          </div>
          
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={burndownData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  label={{ value: 'Story Points Remaining', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                  domain={[0, targetStoryPoints]}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                />
                <Line
                  type="linear"
                  dataKey="ideal"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Ideal Burndown"
                  connectNulls={false}
                />
                <Line
                  type="linear"
                  dataKey="remaining"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  name="Actual Remaining"
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
