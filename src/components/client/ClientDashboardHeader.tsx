
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, LogOut, KeyRound } from 'lucide-react';
import { User as UserType } from '@/types/auth';
import { useNavigate } from 'react-router-dom';

interface ClientDashboardHeaderProps {
  user: UserType;
  onLogout: () => void;
}

const ClientDashboardHeader = ({ user, onLogout }: ClientDashboardHeaderProps) => {
  const navigate = useNavigate();

  const handleUpdatePassword = () => {
    navigate('/settings');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">My Projects</h1>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">CLIENT</Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">{user?.name || user?.email}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleUpdatePassword}
            className="flex items-center gap-2"
          >
            <KeyRound className="h-4 w-4" />
            Update Password
          </Button>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ClientDashboardHeader; 