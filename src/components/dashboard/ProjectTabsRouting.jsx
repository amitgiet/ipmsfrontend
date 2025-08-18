import React from 'react'
import { useAuth } from '@/hooks/useAuth';
import { hasPermission } from '@/utils/permissions';
import { ProjectMindmap } from '@/components/projects/ProjectMindmap';
import { MindmapComments } from '@/components/mindmap/MindmapComments';
import { ProjectBacklog } from '@/components/projects/ProjectBacklog';
import { SprintsSection } from '@/components/sprints/SprintsSection';
import { ProjectTeamManagement } from '@/components/projects/ProjectTeamManagement';
import { Routes, Route, Navigate } from 'react-router-dom';

const MindMapComponent = ({ projectId, canEditMindmap }) => {
    return (
        <>
            <ProjectMindmap projectId={projectId} readOnly={!canEditMindmap} />
            <MindmapComments projectId={projectId} />
        </>
    )
}

const BacklogComponent = ({ projectId, canEditMindmap }) => {
    return (
        <ProjectBacklog projectId={projectId} readOnly={!canEditMindmap} />
    )
}


const SprintsComponent = ({ projectId, canEditMindmap }) => {
    return (
        <SprintsSection projectId={projectId} readOnly={!canEditMindmap} />
    )
}

const TeamComponent = ({ projectId, canEditMindmap }) => {
    return (
        <ProjectTeamManagement projectId={projectId} />
    )
}

const ProjectTabsRouting = ({ projectId }) => {
    const { user, teamUser } = useAuth();
    const isClient = user?.role === 'client' || teamUser?.role === 'client';
    const canEditMindmap = hasPermission(user?.role || teamUser?.role, 'editMindmap');  

    return (
        <Routes>
            <Route path="/mindmap" element={<MindMapComponent projectId={projectId} canEditMindmap={canEditMindmap} />} />
            <Route path="/backlog" element={<BacklogComponent projectId={projectId} canEditMindmap={canEditMindmap} />} />
            <Route path="/sprints" element={<SprintsComponent projectId={projectId} canEditMindmap={canEditMindmap} />} />
            <Route path="/team" element={<TeamComponent projectId={projectId} canEditMindmap={canEditMindmap} />} />
            <Route path="/" element={<Navigate to={`/project/${projectId}/mindmap`} replace />} />
        </Routes>
    )
}

export default ProjectTabsRouting