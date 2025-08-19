
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Target, User, ArrowRight, Plus, Trash2, Users, CheckCircle } from 'lucide-react';

interface MindmapNode {
  id: string;
  title: string;
  type: 'user' | 'epic' | 'feature' | 'task' | 'user_story';
  children: MindmapNode[];
  isExpanded: boolean;
  hasUserStory?: boolean;
}

interface MindmapNodeProps {
  node: MindmapNode;
  level: number;
  isLast: boolean;
  parentConnections: boolean[];
  onToggleExpand: (nodeId: string) => void;
  onSetSelectedParent: (nodeId: string) => void;
  onOpenUserStoryDialog: (node: MindmapNode) => void;
  onDeleteNode: (nodeId: string) => void;
  readOnly?: boolean;
}

const typeColors = {
  user: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  epic: 'bg-purple-100 text-purple-800 border-purple-200',
  feature: 'bg-blue-100 text-blue-800 border-blue-200',
  task: 'bg-green-100 text-green-800 border-green-200',
  child: 'bg-orange-100 text-orange-800 border-orange-200',
};

const typeIcons = {
  user: Users,
  epic: Target,
  feature: Target,
  task: Target,
  user_story: User,
};

export const MindmapNodeComponent = ({
  node,
  level,
  isLast,
  parentConnections,
  onToggleExpand,
  onSetSelectedParent,
  onOpenUserStoryDialog,
  onDeleteNode,
  readOnly = false
}: MindmapNodeProps) => {
  const Icon = typeIcons[node.type] || Target;

  const handleAdminAction = (actionName: string) => {
    if (readOnly) {
      alert(`Access Denied: Your role does not allow you to ${actionName}. Admin users have read-only access.`);
      return;
    }
  };

  const renderChildren = () => {
    if (!node.isExpanded || node.children.length === 0) return null;

    return (
      <div className="relative">
        {node.children.map((child, index) => {
          const isLastChild = index === node.children.length - 1;
          const newParentConnections = [...parentConnections, !isLast];
          return (
            <MindmapNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              isLast={isLastChild}
              parentConnections={newParentConnections}
              onToggleExpand={onToggleExpand}
              onSetSelectedParent={onSetSelectedParent}
              onOpenUserStoryDialog={onOpenUserStoryDialog}
              onDeleteNode={onDeleteNode}
              readOnly={readOnly}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="flex items-start">
        {parentConnections.map((showLine, index) => (
          <div key={index} className="w-6 flex justify-center">
            {showLine && (
              <div className="w-px bg-gray-300 h-full absolute top-0"></div>
            )}
          </div>
        ))}

        {level > 0 && (
          <div className="w-6 h-6 flex items-center justify-center relative">
            <div className="absolute w-px bg-gray-300 h-3 top-0"></div>
            <div className="w-3 h-px bg-gray-300"></div>
            {!isLast && (
              <div className="absolute w-px bg-gray-300 h-3 bottom-0"></div>
            )}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 group ${node.hasUserStory ? 'bg-green-50 border border-green-200' : ''
            }`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 flex-shrink-0"
              onClick={() => onToggleExpand(node.id)}
              disabled={node.children.length === 0}
            >
              {node?.children?.length > 0 ? (
                node?.isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
              ) : null}
            </Button>

            <Icon className="h-4 w-4 flex-shrink-0" />

            <span className="flex-1 min-w-0 truncate">{node?.title}</span>

            {node?.hasUserStory && (
              <div className="flex items-center" title="Has user story">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              </div>
            )}

            <Badge className={`${typeColors[node?.type]} flex-shrink-0`}>
              {node?.type === 'user_story' ? 'user story' : node?.type === 'user' ? 'user' : node?.type === 'epic' ? 'epic' : node?.type === 'feature' ? 'feature' : node?.type === 'task' ? 'task' : 'child'}
            </Badge>

            <div className="opacity-0 group-hover:opacity-100 flex gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => {
                  if (readOnly) {
                    handleAdminAction('add child items');
                  } else {
                    onSetSelectedParent(node.id);
                  }
                }}
                title="Add child item"
              >
                <Plus className="h-3 w-3" />
              </Button>

              {node?.type != 'user' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-orange-600"
                  onClick={() => {
                    if (readOnly) {
                      handleAdminAction('convert items to user stories');
                    } else {
                      onOpenUserStoryDialog(node);
                    }
                  }}
                  title="Convert to user story"
                >
                  <ArrowRight className="h-3 w-3" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-red-600"
                onClick={() => {
                  if (readOnly) {
                    handleAdminAction('delete items');
                  } else {
                    onDeleteNode(node.id);
                  }
                }}
                title="Delete item"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Render children */}
          {renderChildren()}
        </div>
      </div>
    </div>
  );
};
