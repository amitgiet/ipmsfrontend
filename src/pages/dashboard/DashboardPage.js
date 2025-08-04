import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects } from '../../features/projects/projectSlice';
import { fetchTasks } from '../../features/tasks/taskSlice';
import RoleGuard from '../../guards/RoleGuard';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user, teamUser } = useSelector((state) => state.auth);
  const { projects, isLoading: projectsLoading } = useSelector((state) => state.projects);
  const { tasks, isLoading: tasksLoading } = useSelector((state) => state.tasks);
  
  const currentUser = user || teamUser;

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);

  const DashboardContent = ({ role }) => {
    const roleComponents = {
      admin: <AdminDashboard />,
      product_owner: <ProductOwnerDashboard />,
      team_lead: <TeamLeadDashboard />,
      developer: <DeveloperDashboard />,
      qa: <QADashboard />,
      client: <ClientDashboard />
    };

    return roleComponents[role] || <DefaultDashboard />;
  };

  const AdminDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Total Projects</h3>
          <p className="text-3xl font-bold text-primary-600">{projects.length}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Active Tasks</h3>
          <p className="text-3xl font-bold text-green-600">{tasks.filter(t => t.status === 'active').length}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Team Members</h3>
          <p className="text-3xl font-bold text-blue-600">12</p>
        </div>
      </div>
    </div>
  );

  const ProductOwnerDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Product Owner Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">My Projects</h3>
          <p className="text-3xl font-bold text-primary-600">{projects.length}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Pending Reviews</h3>
          <p className="text-3xl font-bold text-yellow-600">5</p>
        </div>
      </div>
    </div>
  );

  const TeamLeadDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Team Lead Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Team Tasks</h3>
          <p className="text-3xl font-bold text-primary-600">{tasks.length}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Sprint Progress</h3>
          <p className="text-3xl font-bold text-green-600">75%</p>
        </div>
      </div>
    </div>
  );

  const DeveloperDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Developer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">My Tasks</h3>
          <p className="text-3xl font-bold text-primary-600">{tasks.filter(t => t.assignee === currentUser?.id).length}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Hours Logged</h3>
          <p className="text-3xl font-bold text-blue-600">32</p>
        </div>
      </div>
    </div>
  );

  const QADashboard = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">QA Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Pending Tests</h3>
          <p className="text-3xl font-bold text-yellow-600">8</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Bugs Found</h3>
          <p className="text-3xl font-bold text-red-600">3</p>
        </div>
      </div>
    </div>
  );

  const ClientDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Client Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Active Projects</h3>
          <p className="text-3xl font-bold text-primary-600">{projects.length}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Project Progress</h3>
          <p className="text-3xl font-bold text-green-600">60%</p>
        </div>
      </div>
    </div>
  );

  const DefaultDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="card">
        <p className="text-gray-600">Welcome to IPMS Dashboard</p>
      </div>
    </div>
  );

  if (projectsLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['admin', 'product_owner', 'team_lead', 'developer', 'qa', 'client']}>
      <DashboardContent role={currentUser?.role} />
    </RoleGuard>
  );
};

export default DashboardPage; 