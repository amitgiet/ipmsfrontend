import React, { useEffect, useState } from 'react';
import { ProjectHeader } from '@/components/dashboard/ProjectHeader';
import { ProjectOverviewCards } from '@/components/dashboard/ProjectOverviewCards';
import { ProjectInfoCard } from '@/components/dashboard/ProjectInfoCard';
import { ProjectTabs } from '@/components/dashboard/ProjectTabs';
import { TeamVelocityChart } from '@/components/sprints/TeamVelocityChart';
import { productOwnerService } from '@/services/ProductOwner/productOwner';
// import { useUserStoryIntegration } from '@/hooks/useUserStoryIntegration';
import { Milestones } from './Milestones';
import { useAuth } from '@/hooks/useAuth';
import { MindmapComments } from '../mindmap/MindmapComments';

const ProjectDashboard = ({ project, onBack }) => {
  const { user } = useAuth();
  const isProductOwner = user?.role === 'product_owner';


  const isAdmin = user?.role === 'admin';
  const isSuperAdmin = user?.role === 'super-admin';
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <ProjectHeader project={project} onBack={onBack} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 mt-6">
          <div className="lg:col-span-3">
            <ProjectOverviewCards project={project} />
          </div>
        </div>
        <ProjectInfoCard project={project} />
        <ProjectTabs projectId={project.id} />
        {(isProductOwner || isAdmin || isSuperAdmin || isClient) && <div className="rounded-lg border bg-card text-card-foreground shadow-sm mt-6">
          <Milestones projectId={project.id} />
        </div>}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm mt-6">
          <TeamVelocityChart projectId={project.id} />
        </div>
          <MindmapComments projectId={project.id} />
      </div>
    </div>
  );
};

export default ProjectDashboard;