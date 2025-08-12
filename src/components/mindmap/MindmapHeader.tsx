
import React from 'react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

interface MindmapHeaderProps {
  readOnly?: boolean;
}

export const MindmapHeader = ({ readOnly = false }: MindmapHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        Project Mindmap
        {readOnly && <Eye className="h-4 w-4 text-gray-500" />}
      </CardTitle>
      <CardDescription>
        {readOnly 
          ? "View project breakdown - Admin view (read-only)"
          : "Start by adding users, then create epics and assign them to users."
        }
      </CardDescription>
    </CardHeader>
  );
};
