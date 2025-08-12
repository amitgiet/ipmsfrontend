
import React from 'react';
import { Badge } from '@/components/ui/badge';

const roleColors = {
  admin: 'bg-red-100 text-red-800 border-red-200',
  team_lead: 'bg-blue-100 text-blue-800 border-blue-200',
  product_owner: 'bg-green-100 text-green-800 border-green-200',
  developer: 'bg-purple-100 text-purple-800 border-purple-200',
  qa: 'bg-orange-100 text-orange-800 border-orange-200',
  client: 'bg-gray-100 text-gray-800 border-gray-200',
};

interface RoleIndicatorProps {
  role: keyof typeof roleColors;
}

export const RoleIndicator: React.FC<RoleIndicatorProps> = ({ role }) => {
  const roleColor = roleColors[role];
  
  return (
    <Badge className={roleColor}>
      {role.replace('_', ' ').toUpperCase()}
    </Badge>
  );
};
