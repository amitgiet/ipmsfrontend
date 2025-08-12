
import React, { ReactNode } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { hasPermission } from '@/utils/permissions';
import { permissions } from '@/utils/permissions';

interface PermissionWrapperProps {
  children: ReactNode;
  action: keyof typeof permissions;
  fallback?: ReactNode;
  hideWhenNoAccess?: boolean;
}

export const PermissionWrapper: React.FC<PermissionWrapperProps> = ({
  children,
  action,
  fallback = null,
  hideWhenNoAccess = true
}) => {
  const { userRole } = useUserRole();
  
  const canPerformAction = hasPermission(userRole, action);
  
  if (!canPerformAction) {
    return hideWhenNoAccess ? null : (fallback || <div className="text-gray-500 italic">Access restricted</div>);
  }
  
  return <>{children}</>;
};
