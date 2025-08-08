
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Project {
  id: string;
  project_status: string | null;
  priority: string | null;
  estimated_budget: number | null;
  progress_percent: number | null;
}

interface AdminStatsCardsProps {
  projects: Project[];
  onProjectsClick: () => void;
}

export const AdminStatsCards = ({ projects, onProjectsClick }: AdminStatsCardsProps) => {
  const totalBudget = projects.reduce((sum, project) => sum + (project.estimated_budget || 0), 0);
  const avgProgress = projects.length > 0 
    ? projects.reduce((sum, project) => sum + (project.progress_percent || 0), 0) / projects.length 
    : 0;

  const stats = [
    {
      title: "Total Projects",
      value: projects.length,
      change: "+12%",
      trend: "up",
      onClick: onProjectsClick,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "In Progress",
      value: projects.filter(p => p.project_status?.toLowerCase() === 'in-progress').length,
      change: "+5%",
      trend: "up",
      gradient: "from-green-500 to-green-600"
    },
    {
      title: "On Hold",
      value: projects.filter(p => p.project_status?.toLowerCase() === 'on-hold').length,
      change: "-2%",
      trend: "down",
      gradient: "from-yellow-500 to-yellow-600"
    },
    {
      title: "Completed",
      value: projects.filter(p => p.project_status?.toLowerCase() === 'completed').length,
      change: "+8%",
      trend: "up",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Total Budget",
      value: `$${totalBudget.toLocaleString()}`,
      change: "+15%",
      trend: "up",
      gradient: "from-indigo-500 to-indigo-600"
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      default:
        return <Minus className="h-3 w-3 text-gray-600" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={stat.title}
          className={`group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm ${
            stat.onClick ? 'cursor-pointer' : ''
          }`}
          onClick={stat.onClick}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 mb-2">
              {stat.title}
            </CardTitle>
            <div className="flex items-center justify-between">
              <span className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                {stat.value}
              </span>
              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-1 text-xs">
              {getTrendIcon(stat.trend)}
              <span className={`${
                stat.trend === 'up' ? 'text-green-600' : 
                stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
