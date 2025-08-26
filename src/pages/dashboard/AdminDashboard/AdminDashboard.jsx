import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminMainContent } from '@/pages/dashboard/AdminDashboard/AdminMainContent';
import { AddProjectForm } from '@/pages/dashboard/Modal/AddProjectForm';
import { EditProjectForm } from '@/pages/dashboard/Modal/EditProjectForm';
import { Routes, Route, Outlet } from 'react-router-dom';
import { AdminProjectsSection } from '@/components/admin/AdminProjectsSection';
import { TeamManagement } from './TeamManagement';
import { AdminSkillsSection } from '@/components/admin/AdminSkillsSection';
import { AdminTimesheetSection } from '@/components/admin/AdminTimesheetSection';

const AppLayout = () => {
  const { logout } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('❌ Error during admin logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader userName="Admin" onLogout={handleLogout} />
      <main className="">
        <Outlet />
      </main>
    </div>
  );
};

const MainContentAdminDashboard = () => {
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [skills, setSkills] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleEditProject = (project) => {
    setEditingProject(project);
    setEditProjectOpen(true);
  };

  const handleProjectSubmit = async (projectData) => {
    setAddProjectOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="w-full">
          <div className="p-6">
            <AdminMainContent
              activeSection={activeSection}
              skills={skills}
              setSkills={setSkills}
              setActiveSection={setActiveSection}
            />
          </div>
        </div>
      </div>

      <AddProjectForm
        open={addProjectOpen}
        onOpenChange={setAddProjectOpen}
        onSubmit={handleProjectSubmit}
      />

      <EditProjectForm
        open={editProjectOpen}
        onOpenChange={setEditProjectOpen}
        project={editingProject}
      />
    </>
  )
}

export const AdminDashboard = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<MainContentAdminDashboard />} />
        <Route path="/all-projects" element={<AdminProjectsSection />} />
        <Route path="/team-management" element={<TeamManagement />} />
        <Route path="/skills" element={<AdminSkillsSection />} />
        <Route path="/timesheets" element={<AdminTimesheetSection />} />
        </Route>
    </Routes>
  );
};