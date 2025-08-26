
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, User } from 'lucide-react';

export const LoginTabsList = () => {
  return (
    <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 p-1 rounded-xl">
      <TabsTrigger 
        value="admin" 
        className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-3"
      >
        <Shield className="h-4 w-4" />
        Admin
      </TabsTrigger>
      <TabsTrigger 
        value="team"
        className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-3"
      >
        <Users className="h-4 w-4" />
        Team
      </TabsTrigger>
      <TabsTrigger 
        value="client"
        className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-3"
      >
        <User className="h-4 w-4" />
        Client
      </TabsTrigger>
    </TabsList>
  );
};
