
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  FolderOpen, 
  Calendar, 
  Play, 
  Pause, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Clock,
  Activity,
  TrendingUp,
  UserCheck,
  UserX,
  Timer
} from 'lucide-react';

interface AdminDashboardStatsProps {
  metrics: {
    totalProjects: number;
    projectsPlanned: number;
    projectsRunning: number;
    projectsOnHold: number;
    projectsCompleted: number;
    projectsWithoutSprints: number;
    projectsNeedPlanning: number;
    runningSprints: number;
    overdueSprints: number;
    unhealthySprints: number;
    totalResources: number;
    freeResources: number;
    partialResources: number;
    totalHoursLogged: number;
    expectedHours: number;
  };
  loading: boolean;
  onProjectsClick?: () => void;
}

export const AdminDashboardStats = ({ metrics, loading, onProjectsClick }: AdminDashboardStatsProps) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, cardIndex) => (
              <Card key={cardIndex}>
                <CardContent className="pt-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    );
  }

  const projectStats = [
    {
      title: "Total Projects",
      value: metrics.totalProjects,
      icon: FolderOpen,
      color: "from-blue-500 to-blue-600",
      onClick: onProjectsClick
    },
    {
      title: "Projects Planned",
      value: metrics.projectsPlanned,
      icon: Calendar,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Projects Running",
      value: metrics.projectsRunning,
      icon: Play,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Projects On Hold",
      value: metrics.projectsOnHold,
      icon: Pause,
      color: "from-yellow-500 to-yellow-600"
    },
    {
      title: "Projects Completed",
      value: metrics.projectsCompleted,
      icon: CheckCircle,
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Projects Without Sprints",
      value: metrics.projectsWithoutSprints,
      icon: AlertTriangle,
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Projects Need Planning",
      value: metrics.projectsNeedPlanning,
      icon: AlertTriangle,
      color: "from-red-500 to-red-600"
    }
  ];

  const sprintStats = [
    {
      title: "Running Sprints",
      value: metrics.runningSprints,
      icon: Activity,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Overdue Sprints",
      value: metrics.overdueSprints,
      icon: Clock,
      color: "from-red-500 to-red-600"
    },
    {
      title: "Unhealthy Sprints",
      value: metrics.unhealthySprints,
      icon: AlertTriangle,
      color: "from-orange-500 to-orange-600"
    }
  ];

  const resourceStats = [
    {
      title: "Total Resources",
      value: metrics.totalResources,
      icon: Users,
      color: "from-indigo-500 to-indigo-600"
    },
    {
      title: "Free Resources",
      value: metrics.freeResources,
      icon: UserCheck,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Partial Resources",
      value: metrics.partialResources,
      icon: UserX,
      color: "from-yellow-500 to-yellow-600"
    },
    {
      title: "Hours Logged vs Expected",
      value: `${metrics.totalHoursLogged}h / ${metrics.expectedHours}h`,
      icon: Timer,
      color: "from-purple-500 to-purple-600"
    }
  ];

  const StatCard = ({ title, value, icon: Icon, color, onClick }: any) => (
    <Card 
      className={`group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-600 mb-2">
          {title}
        </CardTitle>
        <div className="flex items-center justify-between">
          <span className={`text-2xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
            {value}
          </span>
          <div className={`p-2 rounded-lg bg-gradient-to-r ${color} opacity-30 group-hover:opacity-20 transition-opacity`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Project Data Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {projectStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Sprint Data Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sprint Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sprintStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Resource Data Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {resourceStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
};
