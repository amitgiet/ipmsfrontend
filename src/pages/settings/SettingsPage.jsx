import React from 'react';
import { useSelector } from 'react-redux';

const SettingsPage = () => {
  const { user, teamUser } = useSelector((state) => state.auth);
  const currentUser = user || teamUser;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="input-field mt-1"
                defaultValue={currentUser?.name || ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="input-field mt-1"
                defaultValue={currentUser?.email || ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input
                type="text"
                className="input-field mt-1"
                defaultValue={currentUser?.role || ''}
                disabled
              />
            </div>
            <button className="btn-primary">Update Profile</button>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Email Notifications</span>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Push Notifications</span>
              <input type="checkbox" className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Dark Mode</span>
              <input type="checkbox" className="rounded" />
            </div>
            <button className="btn-secondary">Save Preferences</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 