
import React from 'react';
import { ProjectHeader } from '@/components/dashboard/ProjectHeader';
import { ProjectOverviewCards } from '@/components/dashboard/ProjectOverviewCards';
import { ProjectInfoCard } from '@/components/dashboard/ProjectInfoCard';
import { ProjectTabs } from '@/components/dashboard/ProjectTabs';
// import { TeamVelocityChart } from '@/components/sprints/TeamVelocityChart';
// import { useUserStoryIntegration } from '@/hooks/useUserStoryIntegration';

const ProjectDashboard = ({ project, onBack }) => {

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

        <div className="mt-6">
          {/* <TeamVelocityChart projectId={project.id} /> */}
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;