import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { useParams } from 'react-router-dom';
import { eachDayOfInterval, format, parseISO, differenceInDays } from 'date-fns';

interface Sprint {
  id: string;
  sprint_name: string;
  start_date: string;
  end_date: string;
  duration: number;
  status: string;
}

interface SprintBurndownChartProps {
  sprint: Sprint;
  targetStoryPoints: number;
}

interface BurndownPoint {
  date: string;
  ideal: number;
  remaining: number | null; // null means no data that day
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

export const SprintBurndownChart = ({ sprint, targetStoryPoints }: SprintBurndownChartProps) => {
  const params = useParams();
  const projectId = params?.projectId;
  const [burndownData, setBurndownData] = useState<BurndownPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedPoints, setCompletedPoints] = useState(0);
  const [remainingPoints, setRemainingPoints] = useState(0);

  const generateBurndownData = (res: any): BurndownPoint[] => {
    const completedPointsList = res.data.data.userStories_completed_points || [];
    const { total, sprint_start_date, sprint_end_date } = res.data.data.dashboard;
    const totalTasks = total ?? 0;
  
    const sprintStart = parseISO(sprint_start_date);
    const sprintEnd = parseISO(sprint_end_date);
  
    // Find last completion date
    let lastCompletionDate = sprintEnd;
    if (completedPointsList.length > 0) {
      const last = completedPointsList[completedPointsList.length - 1];
      lastCompletionDate = parseISO(last.done_created_at);
    }
  
    // Extend timeline until max(sprintEnd, lastCompletionDate)
    const days = eachDayOfInterval({
      start: sprintStart,
      end: lastCompletionDate,
    });
  
    // Map completions into lookup
    let runningCompleted = 0;
    const completionByDate: Record<string, number> = {};
    completedPointsList.forEach((item: any) => {
      runningCompleted += parseInt(item.total_story_points ?? 0);
      const formatted = format(parseISO(item.done_created_at), "yyyy-MM-dd");
      completionByDate[formatted] = totalTasks - runningCompleted;
    });
  
    // Build data points
    return days.map((day, idx) => {
      const formatted = format(day, "yyyy-MM-dd");
  
      // Ideal line only decreases within sprint duration
      const ideal =
        day <= sprintEnd
          ? totalTasks - (totalTasks / (differenceInDays(sprintEnd, sprintStart) || 1)) * idx
          : null; // After sprint, ideal stops
  
      return {
        date: format(day, "MMM d"),
        ideal,
        remaining: completionByDate[formatted] ?? null,
      };
    });
  };
  
  const fetchCompletions = async () => {
    try {
      setLoading(true);
      const res = await apiCall(allRoutes.sprints.burndownChart(sprint.id, projectId), "get");

      const { completed, remaining } = res.data.data.dashboard;
      setCompletedPoints(completed ?? 0);
      setRemainingPoints(remaining ?? 0);

      const burndown = generateBurndownData(res);
      setBurndownData(burndown);
    } catch (error) {
      console.error("Error fetching completions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletions();
  }, [sprint]);

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
          {/* Stats row */}
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

          {/* Chart */}
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={burndownData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
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
                <ChartTooltip content={<ChartTooltipContent />} />

                {/* Ideal line (blue dashed) */}
                <Line
                  type="linear"
                  dataKey="ideal"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Ideal Burndown"
                  connectNulls={true}
                />

                {/* Actual line (green) */}
                <Line
                  type="linear"
                  dataKey="remaining"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  name="Actual Remaining"
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
