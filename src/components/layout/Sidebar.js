import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const { user, teamUser } = useSelector((state) => state.auth);
  const currentUser = user || teamUser;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Projects', href: '/projects', icon: '📁' },
    { name: 'Sprints', href: '/sprints', icon: '🏃' },
    { name: 'Stories', href: '/stories', icon: '📝' },
    { name: 'Tasks', href: '/tasks', icon: '✅' },
    { name: 'Timesheet', href: '/timesheet', icon: '⏰' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200">
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
        </div>
        
        <nav className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        {currentUser && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              <p>Role: {currentUser.role}</p>
              <p>Team: {currentUser.team || 'N/A'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 