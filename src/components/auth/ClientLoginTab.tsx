
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Loader2 } from 'lucide-react';

interface ClientLoginTabProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

export const ClientLoginTab = ({ onSubmit, isLoading }: ClientLoginTabProps) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(credentials.email, credentials.password);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
          <User className="h-4 w-4" />
          Client Access
        </div>
        <div className="mt-2 text-xs text-gray-500">
          For project clients and stakeholders
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="client-email" className="text-sm font-medium text-gray-700">Email Address</Label>
          <Input
            id="client-email"
            type="email"
            placeholder="client@company.com"
            value={credentials.email}
            onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
            className="h-12 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-password" className="text-sm font-medium text-gray-700">Password</Label>
          <Input
            id="client-password"
            type="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
            className="h-12 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            required
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 rounded-lg font-medium transition-all duration-200" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Signing In...
            </>
          ) : (
            'Sign In as Client'
          )}
        </Button>
      </form>
    </div>
  );
};
