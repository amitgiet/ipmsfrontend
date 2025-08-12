
import React from 'react';

interface MindmapTipsProps {
  readOnly?: boolean;
}

export const MindmapTips = ({ readOnly = false }: MindmapTipsProps) => {
  if (readOnly) {
    return null;
  }

  return (
    <div className="text-sm text-gray-600">
      <p><strong>Tip:</strong> Create users → add epics and assign to users → break epics into features → break features into tasks → break tasks into user stories</p>
      <p>Use the + icon next to any item to add child items. Use the arrow icon to convert any item to a user story.</p>
    </div>
  );
};
