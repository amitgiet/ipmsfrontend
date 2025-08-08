
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  FolderOpen, 
  Home,
  Award,
  UserCog,
  BarChart3,
  ChevronDown
} from 'lucide-react';

interface AdminSidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  projectsCount: number;
  teamMembersCount: number;
}

export const AdminSidebar = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  activeSection,
  setActiveSection,
  projectsCount,
  teamMembersCount
}: AdminSidebarProps) => {
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <div className={`fixed left-0 top-[73px] h-[calc(100vh-73px)] bg-white/90 backdrop-blur-md border-r border-gray-200/50 transition-all duration-300 z-40 shadow-lg ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Admin Panel</h1>
              <p className="text-xs text-gray-500 mt-1">Management Dashboard</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hover:bg-blue-50"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        <Button
          variant={activeSection === 'dashboard' ? 'default' : 'ghost'}
          className={`w-full justify-start transition-all duration-200 ${
            sidebarCollapsed ? 'px-2' : ''
          } ${
            activeSection === 'dashboard' 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md' 
              : 'hover:bg-blue-50 hover:text-blue-700'
          }`}
          onClick={() => setActiveSection('dashboard')}
        >
          <Home className="h-4 w-4" />
          {!sidebarCollapsed && <span className="ml-2">Dashboard</span>}
        </Button>
        
        <Button
          variant={activeSection === 'projects' ? 'default' : 'ghost'}
          className={`w-full justify-start transition-all duration-200 ${
            sidebarCollapsed ? 'px-2' : ''
          } ${
            activeSection === 'projects' 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md' 
              : 'hover:bg-blue-50 hover:text-blue-700'
          }`}
          onClick={() => setActiveSection('projects')}
        >
          <FolderOpen className="h-4 w-4" />
          {!sidebarCollapsed && (
            <>
              <span className="ml-2">Projects</span>
              <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700">
                {projectsCount}
              </Badge>
            </>
          )}
        </Button>
        
        <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full justify-start hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 ${
                sidebarCollapsed ? 'px-2' : ''
              }`}
            >
              <Settings className="h-4 w-4" />
              {!sidebarCollapsed && (
                <>
                  <span className="ml-2">Settings</span>
                  <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${settingsOpen ? 'rotate-180' : ''}`} />
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          {!sidebarCollapsed && (
            <CollapsibleContent className="space-y-1 ml-4 mt-2">
              <Button
                variant={activeSection === 'skills' ? 'default' : 'ghost'}
                size="sm"
                className={`w-full justify-start transition-all duration-200 ${
                  activeSection === 'skills' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md' 
                    : 'hover:bg-blue-50 hover:text-blue-700'
                }`}
                onClick={() => setActiveSection('skills')}
              >
                <Award className="h-4 w-4" />
                <span className="ml-2">Skills Master</span>
              </Button>
              <Button
                variant={activeSection === 'team' ? 'default' : 'ghost'}
                size="sm"
                className={`w-full justify-start transition-all duration-200 ${
                  activeSection === 'team' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md' 
                    : 'hover:bg-blue-50 hover:text-blue-700'
                }`}
                onClick={() => setActiveSection('team')}
              >
                <UserCog className="h-4 w-4" />
                <span className="ml-2">Team Management</span>
                <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700">
                  {teamMembersCount}
                </Badge>
              </Button>
            </CollapsibleContent>
          )}
        </Collapsible>
        
        <div className="pt-4 border-t border-gray-200/50">
          <Button
            variant="ghost"
            className={`w-full justify-start hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 ${
              sidebarCollapsed ? 'px-2' : ''
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            {!sidebarCollapsed && <span className="ml-2">Analytics</span>}
          </Button>
        </div>
      </nav>
    </div>
  );
};
