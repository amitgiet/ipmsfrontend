
import React from 'react';
import { Users } from 'lucide-react';
import { MindmapNodeComponent } from './MindmapNode';

interface MindmapNode {
  id: string;
  title: string;
  type: 'user' | 'epic' | 'feature' | 'task' | 'user_story';
  children: MindmapNode[];
  isExpanded: boolean;
  hasUserStory?: boolean;
}

interface MindmapContentProps {
  nodes: MindmapNode[];
  onToggleExpand: (nodeId: string) => Promise<void>;
  onSetSelectedParent: (nodeId: string) => void;
  onOpenUserStoryDialog: (node: MindmapNode) => void;
  onDeleteNode: (nodeId: string) => Promise<void>;
  readOnly?: boolean;
}

export const MindmapContent = ({
  nodes,
  onToggleExpand,
  onSetSelectedParent,
  onOpenUserStoryDialog,
  onDeleteNode,
  readOnly = false
}: MindmapContentProps) => { 
  return (
    <div className="border rounded-lg p-4 min-h-[300px] overflow-x-auto">
      {nodes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>{readOnly ? "No users available to view." : "No users created yet. Start by adding your first user above."}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {nodes.map((node, index) => (
            <MindmapNodeComponent
              key={node.id}
              node={node}
              level={0}
              isLast={index === nodes.length - 1}
              parentConnections={[]}
              onToggleExpand={onToggleExpand}
              onSetSelectedParent={readOnly ? () => {} : onSetSelectedParent}
              onOpenUserStoryDialog={readOnly ? () => {} : onOpenUserStoryDialog}
              onDeleteNode={readOnly ? () => {} : onDeleteNode}
              readOnly={readOnly}
            />
          ))}
        </div>
      )}
    </div>
  );
};
