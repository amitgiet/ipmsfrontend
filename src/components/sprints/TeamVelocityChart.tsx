
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { toast } from 'react-toastify';

interface TeamVelocityChartProps {
  projectId: string;
}

const chartConfig = {
  story_points_completed: {
    label: "Story Points Completed",
    color: "#3b82f6",
  },
};

export const TeamVelocityChart = ({ projectId }: TeamVelocityChartProps) => {
  const [allSprints, setAllSprints] = useState([]);
  const [velocityData, setVelocityData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const sprintsPerPage = 5;

  const fetchSprintsAndVelocity = async () => {
    try {
      setLoading(true);

      const { data: velocityRes, error } = await apiCall(
        allRoutes.sprints.getTeamVelocityChart(projectId),
        'get',
        {
          order_by: 'start_date',
          order_by_column: 'desc',
          order_direction: 'desc',
        }
      );

      if (error) return;

      const formattedData = velocityRes.data.map((sprint: any) => ({
        sprint_name: sprint.name,
        story_points_completed: sprint.total_done_story_points
          ? Number(sprint.total_done_story_points)
          : 0, 
      }));

      setVelocityData(formattedData);

    } catch (error) {
      console.error('Error in fetchSprintsAndVelocity:', error);
      toast.error("Failed to fetch velocity data");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSprintsAndVelocity();
  }, [projectId]);

  const getCurrentPageData = () => {
    const startIndex = currentPage * sprintsPerPage;
    const endIndex = startIndex + sprintsPerPage;
    return velocityData.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(velocityData.length / sprintsPerPage);
  const hasNextPage = currentPage < totalPages - 1;
  const hasPrevPage = currentPage > 0;

  const averageVelocity = velocityData.length > 0
    ? Math.round(velocityData.reduce((sum, data) => sum + data.story_points_completed, 0) / velocityData.length)
    : 0;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Velocity</CardTitle>
          <CardDescription>Loading velocity data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Team Velocity</CardTitle>
            <CardDescription>
              Story points completed per sprint - Average: {averageVelocity} points
            </CardDescription>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={!hasPrevPage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={!hasNextPage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {velocityData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No sprint data available for this project
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getCurrentPageData()} margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="sprint_name"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  label={{ value: 'Story Points', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 11 }}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="story_points_completed"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Story Points Completed"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
