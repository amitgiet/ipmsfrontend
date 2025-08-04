import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../features/auth/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const { user, teamUser } = useSelector((state) => state.auth);
  const currentUser = user || teamUser;

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">IPMS</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser && (
              <>
                <span className="text-sm text-gray-700">
                  Welcome, {currentUser.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 