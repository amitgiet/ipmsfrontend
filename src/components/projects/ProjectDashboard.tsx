
import React from 'react';
import { ProjectHeader } from '@/components/dashboard/ProjectHeader';
import { ProjectOverviewCards } from '@/components/dashboard/ProjectOverviewCards';
import { ProjectInfoCard } from '@/components/dashboard/ProjectInfoCard';
import { ProjectTabs } from '@/components/dashboard/ProjectTabs';
// import { TeamVelocityChart } from '@/components/sprints/TeamVelocityChart';
// import { useUserStoryIntegration } from '@/hooks/useUserStoryIntegration';

const ProjectDashboard = ({ project, onBack }) => {
  console.log("insidethe project dashboard")
  // useUserStoryIntegration(project.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <ProjectHeader project={project} onBack={onBack} />

        {/* Optimized Layout: Overview Cards and Information Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Side: Overview Cards (2/3 width) */}
          <div className="lg:col-span-2">
            <ProjectOverviewCards project={project} />
          </div>

          {/* Right Side: Project & Client Information (1/3 width) */}
          <div className="lg:col-span-1">
            <ProjectInfoCard project={project} />
          </div>
        </div>

        {/* Tabs Section */}
        <ProjectTabs projectId={project.id} />

        {/* Team Velocity Chart at the bottom */}
        <div className="mt-6">
          {/* <TeamVelocityChart projectId={project.id} /> */}
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;