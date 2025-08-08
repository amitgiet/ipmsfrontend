
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';

// Role colors mapping
const roleColors = {
  admin: 'bg-red-100 text-red-800 border-red-200',
  team_lead: 'bg-blue-100 text-blue-800 border-blue-200',
  product_owner: 'bg-green-100 text-green-800 border-green-200',
  developer: 'bg-purple-100 text-purple-800 border-purple-200',
  qa: 'bg-orange-100 text-orange-800 border-orange-200',
  client: 'bg-gray-100 text-gray-800 border-gray-200',
};

export const TeamMembersTable = ({
  teamMembers = [],
  onEdit,
  onDelete,
  onToggleActive
}) => {
  const [showPassword, setShowPassword] = useState({});

  const togglePasswordVisibility = (memberId) => {
    setShowPassword(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Mobile</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Skills</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teamMembers.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="font-medium">{member.name}</TableCell>
            <TableCell>{member.email}</TableCell>
            <TableCell>{member.mobile_no || '-'}</TableCell>
            <TableCell>
              <Badge className={roleColors[member.role] || 'bg-gray-100 text-gray-800 border-gray-200'}>
                {member.role?.replace('_', ' ').toUpperCase() || 'N/A'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {(member.skills || []).slice(0, 2).map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {(member.skills || []).length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{(member.skills || []).length - 2}
                  </Badge>
                )}
                {(member.skills || []).length === 0 && (
                  <span className="text-gray-400 text-xs">No skills</span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Switch
                  checked={member.is_active}
                  onCheckedChange={() => onToggleActive(member.id, member.is_active)}
                />
                <span className={`text-sm ${member.is_active ? 'text-green-600' : 'text-red-600'}`}>
                  {member.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(member)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(member.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
