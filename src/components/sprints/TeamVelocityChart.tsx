
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-toastify';

interface Sprint {
  id: string;
  sprint_name: string;
  status: string;
  start_date: string;
  end_date: string;
}

interface VelocityData {
  sprint_name: string;
  story_points_completed: number;
  sprint_id: string;
}

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
  const [allSprints, setAllSprints] = useState<Sprint[]>([]);
  const [velocityData, setVelocityData] = useState<VelocityData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const sprintsPerPage = 5;

  const fetchSprintsAndVelocity = async () => {
    try {
      setLoading(true);

      // Fetch all sprints for the project, ordered by start_date descending
      const { data: sprints, error: sprintsError } = await supabase
        .from('sprints')
        .select('id, sprint_name, status, start_date, end_date')
        .eq('project_id', projectId)
        .order('start_date', { ascending: false });

      if (sprintsError) {
        console.error('Error fetching sprints:', sprintsError);
        toast.error("Failed to fetch sprint data");
        return;
      }

      setAllSprints(sprints || []);

      // For each sprint, calculate total story points completed
      const velocityPromises = (sprints || []).map(async (sprint) => {
        // Get stories in this sprint
        const { data: sprintBacklog, error: backlogError } = await supabase
          .from('sprint_backlog')
          .select('story_id')
          .eq('sprint_id', sprint.id);

        if (backlogError) {
          console.error(`Error fetching sprint backlog for sprint ${sprint.id}:`, backlogError);
          return {
            sprint_name: sprint.sprint_name,
            story_points_completed: 0,
            sprint_id: sprint.id,
          };
        }

        const storyIds = sprintBacklog?.map(item => item.story_id) || [];

        if (storyIds.length === 0) {
          return {
            sprint_name: sprint.sprint_name,
            story_points_completed: 0,
            sprint_id: sprint.id,
          };
        }

        // Get completed stories with their story points
        const { data: completedStories, error: storiesError } = await supabase
          .from('story_status_changes')
          .select(`
            story_id,
            user_stories!inner(id, story_points)
          `)
          .eq('new_status', 'done')
          .in('story_id', storyIds);

        if (storiesError) {
          console.error(`Error fetching completed stories for sprint ${sprint.id}:`, storiesError);
          return {
            sprint_name: sprint.sprint_name,
            story_points_completed: 0,
            sprint_id: sprint.id,
          };
        }

        // Calculate total story points
        const totalStoryPoints = (completedStories || []).reduce((total, story) => {
          const storyPoints = story.user_stories?.story_points || 0;
          return total + storyPoints;
        }, 0);

        return {
          sprint_name: sprint.sprint_name,
          story_points_completed: totalStoryPoints,
          sprint_id: sprint.id,
        };
      });

      const velocityResults = await Promise.all(velocityPromises);
      setVelocityData(velocityResults);
      toast.success("Velocity data loaded successfully");

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
    <Card className="max-w-4xl">
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
