
import React from 'react';

export const NoTasks: React.FC = () => {
  return (
    <div className="text-center py-12 text-gray-500">
      <p className="text-lg">No tasks found</p>
      <p className="text-sm">Add tasks to break down this user story into manageable pieces</p>
    </div>
  );
};
