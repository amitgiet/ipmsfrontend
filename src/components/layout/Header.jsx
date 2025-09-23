import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../features/auth/authSlice';
import { User, LogOut, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const dispatch = useDispatch();
  const { user, teamUser } = useSelector((state) => state.auth);
  const currentUser = user || teamUser;
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900" onClick={() => {
              navigate('/dashboard');
            }}>IPMS</h1>
          </div>

          <div className="flex items-center space-x-4">
            {currentUser && (
              <>
                <span className=" flex flex-col items-start justify-start text-sm text-gray-700">
                  <p className="flex items-center gap-2"><User className="h-4 w-4" /> {currentUser.name} ({user.role.replace('_', ' ').replace('-', ' ').toUpperCase()})</p>
                  <p className="flex items-center gap-2 text-sm text-gray-700"><Mail className="h-4 w-4" /> {currentUser.email}</p>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleLogout();
                  }}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 