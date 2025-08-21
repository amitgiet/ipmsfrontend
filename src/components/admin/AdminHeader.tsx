import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LogOut,
  Settings,
  Bell,
  Home,
  Users,
  FolderOpen,
  Clock,
  BookOpen,
  ArrowLeft,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const AdminHeader = ({
  userName,
  onLogout,
  activeSection,
  projectsCount,
  teamMembersCount
}) => {
  const navigate = useNavigate();
  const {pathname} = useLocation();
  const [mainMenuOpen, setMainMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          { pathname !== '/dashboard' &&   <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-8 w-8" />
          </Button>}
          <Link to="/dashboard" className={`flex items-center gap-2 ${pathname === '/dashboard' ? 'text-blue-600' : ''}`}>
            <Home className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Welcome, {userName}</span>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4" />
          </Button>

          <DropdownMenu open={mainMenuOpen} onOpenChange={setMainMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border shadow-lg">
              <DropdownMenuItem
                onClick={() => navigate('/dashboard')}
                className={`flex items-center gap-2 cursor-pointer ${
                  activeSection === 'dashboard' ? 'bg-blue-50 text-blue-700' : ''
                }`}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                  onClick={() => navigate('/dashboard/all-projects')}
                className={`flex items-center gap-2 cursor-pointer ${
                  activeSection === 'projects' ? 'bg-blue-50 text-blue-700' : ''
                }`}
              >
                <FolderOpen className="h-4 w-4" />
                Projects
                {/* <Badge variant="secondary" className="ml-auto">
                  {projectsCount}
                </Badge> */}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate('/dashboard/team-management')}
                className={`flex items-center gap-2 cursor-pointer ${
                  activeSection === 'team' ? 'bg-blue-50 text-blue-700' : ''
                }`}
              >
                <Users className="h-4 w-4" />
                Team Management
                  {/* <Badge variant="secondary" className="ml-auto">
                    {teamMembersCount}
                  </Badge> */}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate('/dashboard/timesheets')}
                className={`flex items-center gap-2 cursor-pointer ${
                  activeSection === 'timesheets' ? 'bg-blue-50 text-blue-700' : ''
                }`}
              >
                <Clock className="h-4 w-4" />
                Timesheets
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate('/dashboard/skills')}
                className={`flex items-center gap-2 cursor-pointer ${
                  activeSection === 'skills' ? 'bg-blue-50 text-blue-700' : ''
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Skills Master
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log('🔘 AdminHeader logout button clicked');
              onLogout();
            }}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
