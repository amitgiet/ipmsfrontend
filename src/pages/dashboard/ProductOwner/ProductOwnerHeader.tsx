
import React from 'react';
import { UnifiedHeader } from '@/components/common/UnifiedHeader';

interface ProductOwnerHeaderProps {
  currentUser: any;
  onLogout: () => void;
}

export const ProductOwnerHeader = ({ currentUser, onLogout }: ProductOwnerHeaderProps) => {
  // The UnifiedHeader already has its own logout functionality using useAuth
  // So we don't need to pass onLogout to it
  return <UnifiedHeader title="ProjectHub - Product Owner Dashboard" />;
};
