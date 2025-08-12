
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { toast } from 'react-toastify';

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
  const [passwords, setPasswords] = useState({});
  const [loadingPasswords, setLoadingPasswords] = useState({});

  // Clear any cached passwords when component mounts or team members change
  useEffect(() => {
    setPasswords({});
    setShowPassword({});
    setLoadingPasswords({});
  }, [teamMembers]);

  // Function to clear cached password for a specific member
  const clearCachedPassword = (memberId) => {
    setPasswords(prev => {
      const newPasswords = { ...prev };
      delete newPasswords[memberId];
      return newPasswords;
    });
    setShowPassword(prev => ({
      ...prev,
      [memberId]: false
    }));
  };

  const togglePasswordVisibility = async (memberId) => {
    // If password is already visible, hide it and clear cache
    if (showPassword[memberId]) {
      setShowPassword(prev => ({
        ...prev,
        [memberId]: false
      }));
      // Clear cached password so it will fetch fresh data next time
      clearCachedPassword(memberId);
      return;
    }

    // If password is not loaded yet, fetch it from API
    if (!passwords[memberId]) {
      setLoadingPasswords(prev => ({
        ...prev,
        [memberId]: true
      }));

      try {
        const result = await apiCall(
          allRoutes.teams.password(memberId),
          'post'
        );

        // Handle different possible response structures
        let decryptedPassword = null;
        
        if (result.success && result.data) {
          // Try different possible data structures
          decryptedPassword = result.data.password || result.data.data?.password || result.data;
        } else if (result.data && result.data.password) {
          // Direct data access
          decryptedPassword = result.data.password;
        } else if (result.password) {
          // Root level password
          decryptedPassword = result.password;
        }

        if (decryptedPassword) {
          // Update passwords state first
          setPasswords(prev => ({
            ...prev,
            [memberId]: decryptedPassword
          }));
          
          // Then show the password
          setShowPassword(prev => ({
            ...prev,
            [memberId]: true
          }));
        } else {
          console.error('Password not found in response:', result);
          toast.error("Password not found in response");
        }
      } catch (error) {
        console.error('Error fetching password:', error);
        toast.error("Failed to fetch password. Please try again.");
      } finally {
        setLoadingPasswords(prev => ({
          ...prev,
          [memberId]: false
        }));
      }
    } else {
      // Password is already loaded, just show/hide it
      setShowPassword(prev => ({
        ...prev,
        [memberId]: !prev[memberId]
      }));
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Password</TableHead>
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
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">
                  {showPassword[member.id] ? (passwords[member.id] || '••••••••') : '••••••••'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePasswordVisibility(member.id)}
                  disabled={loadingPasswords[member.id]}
                  className="h-8 w-8 p-0"
                >
                  {loadingPasswords[member.id] ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : showPassword[member.id] ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </TableCell>
            <TableCell>{member.mobile_no || '-'}</TableCell>
            <TableCell>
              <Badge className={roleColors[member.role] || 'bg-gray-100 text-gray-800 border-gray-200'}>
                {member.role?.replace('_', ' ').toUpperCase() || 'N/A'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {(member.skills || []).slice(0, 2).map((skill) => (
                  <Badge key={typeof skill === 'object' ? skill.id : skill} variant="outline" className="text-xs">
                    {typeof skill === 'object' ? skill.name : skill}
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
