import React, { useState } from 'react';
import { 
  Bell, 
  Settings, 
  LogOut, 
  User, 
  ArrowLeft, 
  Home, 
  Users, 
  FolderOpen, 
  Clock, 
  BookOpen, 
  KeyRound,
  Bug,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { RoleIndicator } from './RoleIndicator';
import { NotificationBell } from '@/components/notifications/NotificationBell';

export const UniversalHeader = ({ 
  title = "IPMS", 
  showNotifications = true, 
  showBackButton = false,
  backToPath,
  customActions,
  userName,
  onLogout,
  activeSection,
  setActiveSection,
  projectsCount,
  teamMembersCount
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const currentUser = user ;
  const userRole = currentUser?.role;
  
  const handleLogout = async () => {
    try {
      if (onLogout) {
        await onLogout();
      } else {
        await logout();
      }
    } catch (error) {
      navigate('/');
    }
  };


  const handleBack = () => {
    if (backToPath) {
      navigate(backToPath);
    } else {
      navigate(-1);
    }
  };

  const getRoleSpecificContent = () => {
    if (!userRole || !currentUser) return null;

    switch (userRole) {
      case 'admin':
      case 'super-admin':
        return getAdminContent();
      case 'team_lead':
        return getTeamLeadContent();
      case 'product_owner':
        return getProductOwnerContent();
      case 'developer':
        return getDeveloperContent();
      case 'qa':
        return getQAContent();
      case 'client':
        return getClientContent();
      default:
        return null;
    }
  };

  const getAdminContent = () => {
    const handleNavClick = (section, path) => {
      if (setActiveSection && section) {
        setActiveSection(section);
      }
      navigate(path);
    };                                                                                                                                  

    return (
      <>
        {/* Welcome Message */}
        <span className="text-sm text-gray-600">Welcome, {userName || currentUser?.name || 'Admin'}</span>
        
        {/* Notification Button */}
        <Button variant="outline" size="sm">
          <Bell className="h-4 w-4" />
        </Button>

        {/* Settings Dropdown Menu */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white border shadow-lg">
            <DropdownMenuItem
              onClick={() => handleNavClick('dashboard', '/dashboard')}
              className={`flex items-center gap-2 cursor-pointer ${
                activeSection === 'dashboard' ? 'bg-blue-50 text-blue-700' : ''
              }`}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => handleNavClick('projects', '/dashboard/all-projects')}
              className={`flex items-center gap-2 cursor-pointer ${
                activeSection === 'projects' ? 'bg-blue-50 text-blue-700' : ''
              }`}
            >
              <FolderOpen className="h-4 w-4" />
              Projects
              {projectsCount !== undefined && (
                <Badge variant="secondary" className="ml-auto">
                  {projectsCount}
                </Badge>
              )}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleNavClick('team', '/dashboard/team-management')}
              className={`flex items-center gap-2 cursor-pointer ${
                activeSection === 'team' ? 'bg-blue-50 text-blue-700' : ''
              }`}
            >
              <Users className="h-4 w-4" />
              Team Management
              {teamMembersCount !== undefined && (
                <Badge variant="secondary" className="ml-auto">
                  {teamMembersCount}
                </Badge>
              )}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleNavClick('type-and-nature', '/dashboard/type-and-nature')}
              className={`flex items-center gap-2 cursor-pointer ${
                activeSection === 'type-and-nature' ? 'bg-blue-50 text-blue-700' : ''
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Type and Nature
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => handleNavClick('timesheets', '/dashboard/timesheets')}
              className={`flex items-center gap-2 cursor-pointer ${
                activeSection === 'timesheets' ? 'bg-blue-50 text-blue-700' : ''
              }`}
            >
              <Clock className="h-4 w-4" />
              Timesheets
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleNavClick('skills', '/dashboard/skills')}
              className={`flex items-center gap-2 cursor-pointer ${
                activeSection === 'skills' ? 'bg-blue-50 text-blue-700' : ''
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Skills Master
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  };

  const getTeamLeadContent = () => (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border shadow-lg">
        <DropdownMenuItem
          onClick={() => navigate('/dashboard')}
          className={`flex items-center gap-2 cursor-pointer ${
            location.pathname === '/dashboard' ? 'bg-blue-50 text-blue-700' : ''
          }`}
        >
          <Home className="h-4 w-4" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigate('/settings')}
          className={`flex items-center gap-2 cursor-pointer ${
            location.pathname.includes('/settings') ? 'bg-blue-50 text-blue-700' : ''
          }`}
        >
          <KeyRound className="h-4 w-4" />
          Change Password
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const getProductOwnerContent = () => (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border shadow-lg">
        <DropdownMenuItem
          onClick={() => navigate('/dashboard')}
          className={`flex items-center gap-2 cursor-pointer ${
            location.pathname === '/dashboard' ? 'bg-blue-50 text-blue-700' : ''
          }`}
        >
          <Home className="h-4 w-4" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigate('/settings')}
          className={`flex items-center gap-2 cursor-pointer ${
            location.pathname.includes('/settings') ? 'bg-blue-50 text-blue-700' : ''
          }`}
        >
          <KeyRound className="h-4 w-4" />
          Change Password
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const getDeveloperContent = () => (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border shadow-lg">
        <DropdownMenuItem
          onClick={() => navigate('/dashboard')}
          className={`flex items-center gap-2 cursor-pointer ${
            location.pathname === '/dashboard' ? 'bg-blue-50 text-blue-700' : ''
          }`}
        >
          <Home className="h-4 w-4" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigate('/settings')}
          className={`flex items-center gap-2 cursor-pointer ${
            location.pathname.includes('/settings') ? 'bg-blue-50 text-blue-700' : ''
          }`}
        >
          <KeyRound className="h-4 w-4" />
          Change Password
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const getQAContent = () => (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border shadow-lg">
        <DropdownMenuItem
          onClick={() => navigate('/dashboard')}
          className={`flex items-center gap-2 cursor-pointer ${
            location.pathname === '/dashboard' ? 'bg-blue-50 text-blue-700' : ''
          }`}
        >
          <Home className="h-4 w-4" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigate('/settings')}
          className={`flex items-center gap-2 cursor-pointer ${
            location.pathname.includes('/settings') ? 'bg-blue-50 text-blue-700' : ''
          }`}
        >
          <KeyRound className="h-4 w-4" />
          Change Password
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const getClientContent = () => (
    <div className="flex items-center gap-4">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate('/settings')}
        className="flex items-center gap-2"
      >
        <KeyRound className="h-4 w-4" />
        Update Password
      </Button>
    </div>
  );

  const getDashboardTitle = () => {
    switch (userRole) {
      case 'admin':
      case 'super-admin':
        return 'Admin Dashboard';
      case 'team_lead':
        return 'Team Lead Dashboard';
      case 'product_owner':
        return 'Product Owner Dashboard';
      case 'developer':
        return 'Developer Dashboard';
      case 'qa':
        return 'QA Dashboard';
      case 'client':
        return 'My Projects';
      default:
        return title;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          {/* Back Button for Admin - matches AdminHeader exactly */}
          {(userRole === 'admin' || userRole === 'super-admin') && location.pathname !== '/dashboard' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-8 w-8" />
            </Button>
          )}
          
          {/* Regular back button for other cases */}
          {showBackButton && !(userRole === 'admin' || userRole === 'super-admin') && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Dashboard Link/Title - matches AdminHeader exactly */}
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-2 ${location.pathname === '/dashboard' ? 'text-blue-600' : ''}`}
          >
            <Home className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-semibold">{getDashboardTitle()}</h1>
          </Link>

          {/* Role Badge */}
          {userRole && (
            <Badge className={
              userRole === 'admin' || userRole === 'super-admin' ? 'bg-red-100 text-red-800 border-red-200' :
              userRole === 'team_lead' ? 'bg-blue-100 text-blue-800 border-blue-200' :
              userRole === 'product_owner' ? 'bg-green-100 text-green-800 border-green-200' :
              userRole === 'developer' ? 'bg-purple-100 text-purple-800 border-purple-200' :
              userRole === 'qa' ? 'bg-orange-100 text-orange-800 border-orange-200' :
              userRole === 'client' ? 'bg-gray-100 text-gray-800 border-gray-200' :
              'bg-gray-100 text-gray-800 border-gray-200'
            }>
              {userRole.replace('_', ' ').toUpperCase()}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Custom Actions */}
          {customActions}

          {/* Role-specific Content */}
          {getRoleSpecificContent()}

          {/* Notifications for non-admin */}
          {/* {showNotifications && !(userRole === 'admin' || userRole === 'super-admin') && (
            <NotificationBell />
          )} */}

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
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
