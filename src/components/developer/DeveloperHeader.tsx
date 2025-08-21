
import React from 'react';
import { UnifiedHeader } from '@/components/common/UnifiedHeader';

interface DeveloperHeaderProps {
  currentUser: any;
  onLogout: () => void;
}

export const DeveloperHeader = ({ currentUser, onLogout }: DeveloperHeaderProps) => {
  return <UnifiedHeader title="ProjectHub - Developer Dashboard" />;
};
