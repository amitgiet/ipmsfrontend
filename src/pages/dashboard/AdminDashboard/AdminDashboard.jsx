import React, { useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminMainContent } from '@/pages/dashboard/AdminDashboard/AdminMainContent';
import { AddProjectForm } from '@/pages/dashboard/Modal/AddProjectForm';
import { EditProjectForm } from '@/pages/dashboard/Modal/EditProjectForm';

export const AdminDashboard = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [skills, setSkills] = useState([]);

  console.log("AdminDashboard");

  const handleViewProject = (project) => {
    setSelectedProject(project);
  };

  const handleBackToList = () => {
    setSelectedProject(null);
  };

  const handleAddProject = () => {
    setAddProjectOpen(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setEditProjectOpen(true);
  };

  const handleProjectSubmit = async (projectData) => {
    setAddProjectOpen(false);
  };

  const handleProjectUpdate = () => {
    setEditProjectOpen(false);
    setEditingProject(null);
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };
  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <AdminHeader 
          userName="Admin"
          onLogout={handleLogout}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          projectsCount={0}
          teamMembersCount={12}
        />
        
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
        onSubmit={handleProjectUpdate}
      />
    </>
  );
}; 