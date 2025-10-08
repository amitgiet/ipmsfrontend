import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface Milestone {
  id: number;
  name: string;
  estimated_completion_date: string;
  deliverable: string;
  amount: string; // keeping as string because API returns string
  currency: string;
  client_dependency: string;
  status: 'pending' | 'in_progress' | 'completed' | string;
}

export const Milestones: React.FC = () => {
  const { isProductOwner } = useUserRole();
  const { projectId } = useParams<{ projectId: string }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    const fetchMilestones = async () => {
      if (!projectId) return;
      setLoading(true);
      const { data, success } = await apiCall(allRoutes.productOwner.get_milestones(projectId), 'get');
      if (success) {
        setMilestones(data?.data || []);
      }
      setLoading(false);
    };

    if (isProductOwner) {
      fetchMilestones();
    }
  }, [projectId, isProductOwner]);

  if (!isProductOwner) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Project Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : milestones.length === 0 ? (
          <p className="text-sm text-gray-500">No milestones found.</p>
        ) : (
          <div className="space-y-3">
            {milestones.map((m) => (
              <div key={m.id} className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{m.name}</div>
                  <Badge variant="outline" className="capitalize">
                    {m.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <Label className="text-xs text-gray-500">Estimated Completion</Label>
                    <div>{new Date(m.estimated_completion_date).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Deliverable</Label>
                    <div className="truncate" title={m.deliverable}>{m.deliverable}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Amount</Label>
                    <div>
                      {m.currency} {Number(m.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <Label className="text-xs text-gray-500">Client Dependency</Label>
                    <div className="text-gray-700">{m.client_dependency || '-'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Milestones;


