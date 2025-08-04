
## Routing Architecture

### 1. Route-Based Architecture

```typescript
// src/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import { AuthGuard } from '@/guards/AuthGuard';
import { RoleGuard } from '@/guards/RoleGuard';
import { AppLayout } from '@/components/layout/AppLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: '/dashboard',
        element: <AuthGuard><DashboardRouter /></AuthGuard>
      },
      {
        path: '/projects',
        element: <AuthGuard><ProjectRouter /></AuthGuard>
      },
      {
        path: '/sprints',
        element: <AuthGuard><SprintRouter /></AuthGuard>
      },
      {
        path: '/stories',
        element: <AuthGuard><StoryRouter /></AuthGuard>
      },
      {
        path: '/tasks',
        element: <AuthGuard><TaskRouter /></AuthGuard>
      },
      {
        path: '/timesheet',
        element: <AuthGuard><TimesheetRouter /></AuthGuard>
      },
      {
        path: '/settings',
        element: <AuthGuard><SettingsPage /></AuthGuard>
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthRouter />
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]);
```

### 2. Role-Based Route Guards

```typescript
// src/guards/RoleGuard.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const RoleGuard = ({ 
  children, 
  allowedRoles, 
  fallback, 
  redirectTo = "/unauthorized" 
}: RoleGuardProps) => {
  const { user, teamUser } = useAuth();
  const currentUser = user || teamUser;
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(currentUser.role)) {
    return fallback ? <>{fallback}</> : <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

// Usage examples:
<RoleGuard allowedRoles={['admin', 'product_owner']}>
  <AdminDashboard />
</RoleGuard>

<RoleGuard 
  allowedRoles={['developer']} 
  fallback={<AccessDenied />}
>
  <DeveloperTasks />
</RoleGuard>
```

### 3. Feature-Based Routing

```typescript
// src/routes/dashboardRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { RoleGuard } from '@/guards/RoleGuard';

// Import dashboard pages
import { AdminDashboardPage } from '@/pages/dashboard/AdminDashboardPage';
import { ClientDashboardPage } from '@/pages/dashboard/ClientDashboardPage';
import { DeveloperDashboardPage } from '@/pages/dashboard/DeveloperDashboardPage';
import { ProductOwnerDashboardPage } from '@/pages/dashboard/ProductOwnerDashboardPage';
import { QADashboardPage } from '@/pages/dashboard/QADashboardPage';
import { TeamLeadDashboardPage } from '@/pages/dashboard/TeamLeadDashboardPage';

export const DashboardRouter = () => {
  const { user, teamUser } = useAuth();
  const currentUser = user || teamUser;
  
  const roleRoutes = {
    admin: <AdminDashboardPage />,
    product_owner: <ProductOwnerDashboardPage />,
    team_lead: <TeamLeadDashboardPage />,
    developer: <DeveloperDashboardPage />,
    qa: <QADashboardPage />,
    client: <ClientDashboardPage />
  };
  
  return roleRoutes[currentUser?.role] || <Navigate to="/unauthorized" />;
};

// src/routes/projectRoutes.tsx
export const ProjectRouter = () => (
  <Routes>
    <Route path="/" element={<ProjectListPage />} />
    <Route path="/:projectId" element={<ProjectDashboardPage />}>
      <Route index element={<ProjectOverview />} />
      <Route path="backlog" element={<ProjectBacklogPage />} />
      <Route path="mindmap" element={<ProjectMindmapPage />} />
      <Route path="sprints" element={<ProjectSprintsPage />} />
      <Route path="team" element={<ProjectTeamPage />} />
      <Route path="settings" element={<ProjectSettingsPage />} />
      <Route path="time-logs" element={<TimeLogsPage />} />
    </Route>
  </Routes>
);
```

### 4. Nested Project Routes

```typescript
// src/routes/sprintRoutes.tsx
export const SprintRouter = () => (
  <Routes>
    <Route path="/" element={<SprintListPage />} />
    <Route path="/create" element={<CreateSprintPage />} />
    <Route path="/:sprintId" element={<SprintManagementPage />}>
      <Route index element={<SprintOverview />} />
      <Route path="kanban" element={<SprintKanbanPage />} />
      <Route path="burndown" element={<SprintBurndownPage />} />
      <Route path="metrics" element={<SprintMetricsPage />} />
      <Route path="issues" element={<SprintIssuesPage />} />
    </Route>
  </Routes>
);

// src/routes/storyRoutes.tsx
export const StoryRouter = () => (
  <Routes>
    <Route path="/" element={<StoryListPage />} />
    <Route path="/create" element={<StoryCreationPage />} />
    <Route path="/:storyId" element={<StoryDetailsPage />}>
      <Route index element={<StoryOverview />} />
      <Route path="groom" element={<StoryGroomingPage />} />
      <Route path="tasks" element={<StoryTasksPage />} />
      <Route path="comments" element={<StoryCommentsPage />} />
    </Route>
  </Routes>
);
```

## Implementation Strategy

### Phase 1: Foundation Setup (Week 1)

1. **Create New Folder Structure**
   ```bash
   mkdir -p src/{pages,features,guards,routes}
   mkdir -p src/pages/{auth,dashboard,project,sprint,story,tasks,timesheet,settings}
   mkdir -p src/components/{layout,common,forms,dashboard,project,sprint,story,tasks,timesheet}
   mkdir -p src/features/{auth,projects,sprints,stories,tasks,timesheet}
   ```

2. **Set Up Route Guards**
   - Implement `AuthGuard`
   - Implement `RoleGuard`
   - Implement `PermissionGuard`

3. **Create Base Layout Components**
   - `AppLayout.tsx`
   - `Sidebar.tsx`
   - `Header.tsx`
   - `Navigation.tsx`

### Phase 2: Component Migration (Week 2-3)

1. **Move Page Components**
   ```bash
   # Move existing page components
   mv src/components/Dashboard.tsx src/pages/dashboard/
   mv src/components/TimeLogsPage.tsx src/pages/timesheet/
   mv src/components/DeveloperTasksPage.tsx src/pages/tasks/
   # ... continue for all page components
   ```

2. **Organize Feature Components**
   ```bash
   # Move feature-specific components
   mv src/components/admin/* src/features/auth/components/
   mv src/components/sprints/* src/features/sprints/components/
   mv src/components/story/* src/features/stories/components/
   # ... continue for all features
   ```

3. **Update Import Paths**
   - Use search and replace to update all import statements
   - Ensure TypeScript compilation works

### Phase 3: Routing Implementation (Week 4)

1. **Implement New Routing Structure**
   - Create route configuration files
   - Implement lazy loading for better performance
   - Add route-based code splitting

2. **Update Navigation**
   - Update sidebar navigation
   - Implement breadcrumbs
   - Add active route highlighting

### Phase 4: Testing & Optimization (Week 5)

1. **Testing**
   - Test all routes work correctly
   - Test role-based access
   - Test navigation between pages

2. **Performance Optimization**
   - Implement lazy loading
   - Add loading states
   - Optimize bundle size

## Migration Guide

### Step-by-Step Migration Process

#### 1. Backup Current Code
```bash
git checkout -b refactor/structure-improvement
git add .
git commit -m "Backup before structure refactor"
```

#### 2. Create New Structure
```bash
# Create new directories
mkdir -p src/pages/{auth,dashboard,project,sprint,story,tasks,timesheet,settings}
mkdir -p src/features/{auth,projects,sprints,stories,tasks,timesheet}
mkdir -p src/guards
mkdir -p src/routes
```

#### 3. Move Components
```typescript
// Example: Moving Dashboard component
// From: src/components/Dashboard.tsx
// To: src/pages/dashboard/DashboardPage.tsx

// Update the component
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { RoleGuard } from '@/guards/RoleGuard';

export const DashboardPage = () => {
  const { user, teamUser } = useAuth();
  const currentUser = user || teamUser;

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <RoleGuard allowedRoles={['admin', 'product_owner', 'team_lead', 'developer', 'qa', 'client']}>
      <DashboardContent role={currentUser.role} />
    </RoleGuard>
  );
};

const DashboardContent = ({ role }: { role: string }) => {
  const roleComponents = {
    admin: <AdminDashboardPage />,
    product_owner: <ProductOwnerDashboardPage />,
    team_lead: <TeamLeadDashboardPage />,
    developer: <DeveloperDashboardPage />,
    qa: <QADashboardPage />,
    client: <ClientDashboardPage />
  };

  return roleComponents[role] || <DefaultDashboard />;
};
```

#### 4. Update Imports
```typescript
// Update all import statements
// Before:
import { Dashboard } from '@/components/Dashboard';
import { TimeLogsPage } from '@/components/TimeLogsPage';

// After:
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { TimeLogsPage } from '@/pages/timesheet/TimeLogsPage';
```

#### 5. Implement Route Guards
```typescript
// src/guards/AuthGuard.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, teamUser, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user && !teamUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

#### 6. Update App.tsx
```typescript
// src/App.tsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { router } from '@/routes';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
```

## Best Practices

### 1. Naming Conventions

```typescript
// ✅ Good naming
src/pages/dashboard/AdminDashboardPage.tsx
src/components/project/ProjectCard.tsx
src/features/auth/hooks/useAuth.ts
src/guards/RoleGuard.tsx

// ❌ Bad naming
src/components/AdminDashboard.tsx
src/components/ProjectCard.tsx
src/hooks/useAuth.ts
src/guards/roleGuard.tsx
```

### 2. File Organization

```typescript
// ✅ Good organization
src/features/projects/
├── components/
│   ├── ProjectList.tsx
│   ├── ProjectCard.tsx
│   └── ProjectFilters.tsx
├── hooks/
│   ├── useProjects.ts
│   └── useProjectStatus.ts
├── services/
│   └── projectService.ts
├── types/
│   └── project.ts
└── utils/
    └── projectFormatters.ts

// ❌ Bad organization
src/components/
├── ProjectList.tsx
├── ProjectCard.tsx
├── ProjectFilters.tsx
└── useProjects.ts
```

### 3. Import Organization

```typescript
// ✅ Good import organization
// External libraries
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Internal components
import { ProjectCard } from '@/components/project/ProjectCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// Hooks
import { useProjects } from '@/features/projects/hooks/useProjects';

// Types
import { Project } from '@/features/projects/types/project';

// Utils
import { formatProjectDate } from '@/features/projects/utils/projectFormatters';

// ❌ Bad import organization
import { ProjectCard } from '@/components/ProjectCard';
import { useProjects } from '@/hooks/useProjects';
import { Project } from '@/types/project';
```

### 4. Component Structure

```typescript
// ✅ Good component structure
export const ProjectListPage = () => {
  // 1. Hooks
  const { projects, loading, error } = useProjects();
  const navigate = useNavigate();

  // 2. Event handlers
  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  // 3. Render logic
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => handleProjectClick(project.id)}
          />
        ))}
      </div>
    </div>
  );
};
```

### 5. Type Safety

```typescript
// ✅ Good type safety
interface ProjectCardProps {
  project: Project;
  onClick: (projectId: string) => void;
  variant?: 'default' | 'compact';
}

export const ProjectCard = ({ 
  project, 
  onClick, 
  variant = 'default' 
}: ProjectCardProps) => {
  // Component implementation
};

// ❌ Bad type safety
export const ProjectCard = ({ project, onClick, variant }) => {
  // Component implementation
};
```

## Code Examples

### 1. Feature Module Structure

```typescript
// src/features/projects/index.ts
export * from './components/ProjectList';
export * from './components/ProjectCard';
export * from './hooks/useProjects';
export * from './services/projectService';
export * from './types/project';

// src/features/projects/hooks/useProjects.ts
import { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { Project } from '../types/project';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.getProjects();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
};
```

### 2. Route Configuration

```typescript
// src/routes/projectRoutes.tsx
import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthGuard } from '@/guards/AuthGuard';
import { RoleGuard } from '@/guards/RoleGuard';

// Lazy load pages for better performance
const ProjectListPage = lazy(() => import('@/pages/project/ProjectListPage'));
const ProjectDashboardPage = lazy(() => import('@/pages/project/ProjectDashboardPage'));
const ProjectBacklogPage = lazy(() => import('@/pages/project/ProjectBacklogPage'));

export const ProjectRouter = () => (
  <Routes>
    <Route 
      path="/" 
      element={
        <AuthGuard>
          <ProjectListPage />
        </AuthGuard>
      } 
    />
    <Route 
      path="/:projectId" 
      element={
        <AuthGuard>
          <ProjectDashboardPage />
        </AuthGuard>
      }
    >
      <Route index element={<ProjectOverview />} />
      <Route 
        path="backlog" 
        element={
          <RoleGuard allowedRoles={['product_owner', 'team_lead', 'developer']}>
            <ProjectBacklogPage />
          </RoleGuard>
        } 
      />
      <Route path="mindmap" element={<ProjectMindmapPage />} />
      <Route path="sprints" element={<ProjectSprintsPage />} />
      <Route path="team" element={<ProjectTeamPage />} />
      <Route path="settings" element={<ProjectSettingsPage />} />
    </Route>
  </Routes>
);
```

### 3. Layout Component

```typescript
// src/components/layout/AppLayout.tsx
import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};
```

## Benefits of This Structure

### 1. **Scalability**
- Easy to add new features without affecting existing code
- Clear boundaries between different parts of the application
- Modular architecture supports team development

### 2. **Maintainability**
- Related code is grouped together
- Clear separation of concerns
- Easy to find and modify specific functionality

### 3. **Reusability**
- Components are properly organized for reuse
- Feature modules can be shared across projects
- Consistent patterns throughout the application

### 4. **Performance**
- Natural boundaries for code splitting
- Lazy loading can be implemented easily
- Better bundle optimization

### 5. **Developer Experience**
- Intuitive folder structure
- Clear naming conventions
- Easy to onboard new developers

### 6. **Testing**
- Isolated features are easier to test
- Clear test boundaries
- Better test organization

This comprehensive structure will transform your project into a well-organized, maintainable, and scalable application that follows React and TypeScript best practices.