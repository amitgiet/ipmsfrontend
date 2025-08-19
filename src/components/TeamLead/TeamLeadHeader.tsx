
import React from 'react';
import { UnifiedHeader } from '@/components/common/UnifiedHeader';

interface TeamLeadHeaderProps {
  currentUser: any;
  onLogout: () => void;
}

export const TeamLeadHeader = ({ currentUser, onLogout }: TeamLeadHeaderProps) => {
  return <UnifiedHeader title="ProjectHub - Team Lead Dashboard" />;
};
