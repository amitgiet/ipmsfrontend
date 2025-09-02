
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Activity, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Story {
  id: string;
  title: string;
  status: string;
  story_points?: number;
  updated_at: string;
}

interface StatusChange {
  id: string;
  story_id: string;
  previous_status: string;
  new_status: string;
  changed_by: string;
  changed_at: string;
  story_title: string;
  story_points: number;
}

interface SprintStatusLogProps {
  stories: Story[];
}

export const SprintStatusLog = ({ stories }: SprintStatusLogProps) => {
  const [statusChanges, setStatusChanges] = useState<StatusChange[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStatusChanges = async () => {
    if (stories.length === 0) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true); 

      const storyIds = stories.map(story => story.id);

      const { data, error } = await supabase
        .from('story_status_changes')
        .select(`
          id,
          story_id,
          previous_status,
          new_status,
          changed_by,
          changed_at,
          user_stories (
            title,
            story_points
          )
        `)
        .in('story_id', storyIds)
        .order('changed_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching status changes:', error);
        toast({
          title: "Error",
          description: "Failed to fetch status change history",
          variant: "destructive",
        });
        return;
      }

      // Transform the data to include story details
      const transformedChanges: StatusChange[] = (data || [])
        .filter(change => change.user_stories) // Filter out any with missing story data
        .map(change => ({
          id: change.id,
          story_id: change.story_id,
          previous_status: change.previous_status,
          new_status: change.new_status,
          changed_by: change.changed_by || 'Unknown',
          changed_at: change.changed_at,
          story_title: (change.user_stories as any)?.title || 'Unknown Story',
          story_points: (change.user_stories as any)?.story_points || 0
        }));
 
      setStatusChanges(transformedChanges);
    } catch (error) {
      console.error('❌ Error in fetchStatusChanges:', error);
      toast({
        title: "Error",
        description: "Failed to fetch status change history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusChanges();
  }, [stories]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'to_do':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'qa':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'done':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').toUpperCase();
  };

  if (loading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Status Change Log
          </CardTitle>
          <CardDescription>
            Track story status changes throughout the sprint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading status changes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Status Change Log
        </CardTitle>
        <CardDescription>
          Track story status changes throughout the sprint
        </CardDescription>
      </CardHeader>
      <CardContent>
        {statusChanges.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No status changes recorded yet</p>
            <p className="text-sm">Story status changes will appear here as they happen</p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Story</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Status Change</TableHead>
                  <TableHead>Changed By</TableHead>
                  <TableHead>Changed At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statusChanges.map((change) => (
                  <TableRow key={change.id}>
                    <TableCell>
                      <div className="font-medium">{change.story_title}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {change.story_points} pts
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(change.previous_status)}>
                          {formatStatus(change.previous_status)}
                        </Badge>
                        <span className="text-gray-400">→</span>
                        <Badge className={getStatusColor(change.new_status)}>
                          {formatStatus(change.new_status)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{change.changed_by}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="h-3 w-3" />
                        {format(new Date(change.changed_at), 'MMM dd, HH:mm')}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
