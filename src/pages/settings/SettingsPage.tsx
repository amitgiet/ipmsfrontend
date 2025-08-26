
import React from 'react';
import { UnifiedHeader } from '@/components/common/UnifiedHeader';
import { PasswordUpdateForm } from '@/components/auth/PasswordUpdateForm';
 

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader title="Settings" />
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>

          <div className="grid gap-8">
            <div className="flex justify-center">
              <PasswordUpdateForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;