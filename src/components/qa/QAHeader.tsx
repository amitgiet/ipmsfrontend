
import React from 'react';
import { UnifiedHeader } from '@/components/common/UnifiedHeader';

interface QAHeaderProps {
  currentUser: any;
  onLogout: () => void;
}

export const QAHeader: React.FC<QAHeaderProps> = ({ currentUser, onLogout }) => {
  return <UnifiedHeader title="ProjectHub" />;
};
