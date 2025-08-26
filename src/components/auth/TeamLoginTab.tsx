
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Loader2 } from 'lucide-react';

interface TeamLoginTabProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

export const TeamLoginTab = ({ onSubmit, isLoading }: TeamLoginTabProps) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(credentials.email, credentials.password);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
          <Users className="h-4 w-4" />
          Team Member Access
        </div>
        <div className="mt-2 text-xs text-gray-500">
          For developers, QA, team leads, etc.
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="team-email" className="text-sm font-medium text-gray-700">Email Address</Label>
          <Input
            id="team-email"
            type="email"
            placeholder="team@company.com"
            value={credentials.email}
            onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
            className="h-12 rounded-lg border-gray-200 focus:border-green-500 focus:ring-green-500"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="team-password" className="text-sm font-medium text-gray-700">Password</Label>
          <Input
            id="team-password"
            type="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
            className="h-12 rounded-lg border-gray-200 focus:border-green-500 focus:ring-green-500"
            required
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-medium transition-all duration-200" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Signing In...
            </>
          ) : (
            'Sign In as Team Member'
          )}
        </Button>
      </form>
    </div>
  );
};
