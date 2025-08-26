import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { TeamMemberForm } from '@/components/team/TeamMemberForm.tsx';
import { TeamMembersTable } from '@/components/team/TeamMembersTable';
// import { ExcelImportDialog } from '@/components/team/ExcelImportDialog';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { toast } from 'react-toastify';

export const TeamManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  });

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_no: '',
    emergency_contact: '',
    password: '',
    role: 'developer',
    skills: [],
    is_active: true,
  });

  // Available page size options
  const pageSizeOptions = [10, 25, 50, 100];

  // Fetch team members on component mount
  useEffect(() => {
    fetchTeamMembers(1);
  }, []);

  const fetchTeamMembers = async (page = 1, pageSize = pagination.per_page) => {
    setLoading(true);
    try {
      const result = await apiCall(`${allRoutes.teams.list}?page=${page}&per_page=${pageSize}`, 'get');

      if (result.success) {
        const members = result.data.data || result.data || [];
        const meta = result.data.meta || {};

        setTeamMembers(members);
        setPagination({
          current_page: meta.current_page || 1,
          last_page: meta.last_page || 1,
          per_page: pageSize,
          total: meta.total || 0
        });
      } else {
        toast.error("Failed to fetch team members. Please try again.");
      }

    } catch (error) {
      toast.error("Failed to fetch team members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchTeamMembers(newPage, pagination.per_page);
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    const newSize = parseInt(newPageSize);
    // Reset to first page when changing page size
    fetchTeamMembers(1, newSize);
  };

  // Sorting functions
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <span className="text-gray-400">↕</span>;
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Search filtering function
  const getFilteredAndSortedTeamMembers = () => {
    let filteredMembers = teamMembers;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredMembers = teamMembers.filter(member => {
        // Search in name
        if (member.name?.toLowerCase().includes(query)) return true;
        
        // Search in email
        if (member.email?.toLowerCase().includes(query)) return true;
        
        // Search in role
        if (member.role?.toLowerCase().includes(query)) return true;
        
        // Search in skills
        if (member.skills && Array.isArray(member.skills)) {
          const hasMatchingSkill = member.skills.some(skill => {
            const skillName = typeof skill === 'object' ? skill.name : skill;
            return skillName?.toLowerCase().includes(query);
          });
          if (hasMatchingSkill) return true;
        }
        
        return false;
      });
    }

    // Apply sorting
    if (!sortConfig.key) return filteredMembers;

    return filteredMembers.sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case 'name':
          aValue = (a.name || '').toLowerCase();
          bValue = (b.name || '').toLowerCase();
          break;
        case 'email':
          aValue = (a.email || '').toLowerCase();
          bValue = (b.email || '').toLowerCase();
          break;
        case 'role':
          aValue = (a.role || '').toLowerCase();
          bValue = (b.role || '').toLowerCase();
          break;
        case 'status':
          aValue = a.is_active ? 1 : 0;
          bValue = b.is_active ? 1 : 0;
          break;
        case 'skills':
          aValue = (a.skills || []).length;
          bValue = (b.skills || []).length;
          break;
        default:
          aValue = a[sortConfig.key] || '';
          bValue = b[sortConfig.key] || '';
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const saveTeamMember = async (memberData, editingMember) => {
    setSaving(true);
    try {
      // Transform the data to match API expectations
      const transformedData = {
        ...memberData,
        phone: memberData.mobile_no, // Transform mobile_no to phone
        // Remove mobile_no if it exists to avoid confusion
        mobile_no: undefined
      };

      // Remove undefined fields
      Object.keys(transformedData).forEach(key => {
        if (transformedData[key] === undefined) {
          delete transformedData[key];
        }
      });

      let result;
      if (editingMember) {
        // Update existing team member
        result = await apiCall(
          allRoutes.teams.update(editingMember.id),
          'put',
          transformedData
        );
      } else {
        // Create new team member
        result = await apiCall(
          allRoutes.teams.create,
          'post',
          transformedData
        );
      }

      if (result.success) {
        toast.success(editingMember ? "Team member updated successfully" : "Team member created successfully");


        // Refresh the team members list
        await fetchTeamMembers(pagination.current_page, pagination.per_page);
        return true;
      }
    } catch (error) {
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteTeamMember = async (memberId) => {
    try {
      const result = await apiCall(
        allRoutes.teams.delete(memberId),
        'delete'
      );

      if (result.success) {
        toast.success("Team member deleted successfully");

        // Refresh the team members list
        await fetchTeamMembers(pagination.current_page, pagination.per_page);
      } else {
        toast.error(result.error?.message || "Failed to delete team member. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to delete team member. Please try again.");
    }
  };

  const toggleActive = async (memberId, currentStatus) => {
    try {
      const result = await apiCall(
        allRoutes.teams.update(memberId),
        'put',
        { is_active: !currentStatus }
      );

      if (result.success) {
        toast.success(`Team member ${!currentStatus ? 'activated' : 'deactivated'} successfully`);

        // Refresh the team members list
        await fetchTeamMembers(pagination.current_page, pagination.per_page);
      } else {
        toast.error(result.error?.message || "Failed to update team member status. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to update team member status. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobile_no: '',
      emergency_contact: '',
      password: '',
      role: 'developer',
      skills: [],
      is_active: true,
    });
    setEditingMember(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await saveTeamMember(formData, editingMember);
    if (success) {
      setIsAddDialogOpen(false);
      resetForm();
    }
  };

  const handleEdit = (member) => {
    // Handle different skills data structures
    let extractedSkills = [];
    if (member.skills && Array.isArray(member.skills)) {
      extractedSkills = member.skills.map(skill => {
        if (typeof skill === 'object' && skill.id !== undefined) {
          return skill.id;
        } else if (typeof skill === 'object' && skill.skill_id !== undefined) {
          return skill.skill_id;
        } else if (typeof skill === 'string' || typeof skill === 'number') {
          return skill;
        }
        return skill;
      });
    }

    const formDataToSet = {
      name: member.name,
      email: member.email,
      mobile_no: member.phone || member.mobile_no || '', // Handle both phone and mobile_no
      emergency_contact: member.emergency_contact || '',
      password: '',
      role: member.role,
      skills: extractedSkills,
      is_active: member.is_active,
    };

    setFormData(formDataToSet);
    setEditingMember(member);
    setIsAddDialogOpen(true);
  };

  const handleBulkImport = async (importedMembers) => {
    let successCount = 0;
    let errorCount = 0;

    for (const member of importedMembers) {
      const success = await saveTeamMember(member, null);
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
    }

    if (errorCount > 0) {
      toast.error(`Imported ${successCount} members successfully. ${errorCount} failed.`);
    }

    return successCount > 0;
  };


  return (
    <div className="space-y-6 w-full p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Management ({pagination.total})</h2>
          <p className="text-gray-600">Manage your team members and their access</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent 
              className="max-w-2xl"
              onPointerDownOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle>
                  {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
                </DialogTitle>
                <DialogDescription>
                  {editingMember
                    ? 'Update team member information and permissions'
                    : 'Add a new team member to your organization'}
                </DialogDescription>
              </DialogHeader>
              <TeamMemberForm
                formData={formData}
                editingMember={editingMember}
                onFormDataChange={setFormData}
                onSubmit={handleSubmit}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent>
          {/* Search Bar */}
          <div className="flex items-center justify-between mb-4 mt-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by name, email, role, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 pl-10 pr-10"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                  >
                    <X className="h-3 w-3 text-gray-500" />
                  </Button>
                )}
              </div>
              {searchQuery && (
                <div className="text-sm text-gray-600">
                  {getFilteredAndSortedTeamMembers().length} of {teamMembers.length} results
                </div>
              )}
            </div>
            {/* Rows per page selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show</span>
              <Select value={pagination.per_page.toString()} onValueChange={handlePageSizeChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">entries</span>
            </div>
          </div>

          <TeamMembersTable
            teamMembers={getFilteredAndSortedTeamMembers()}
            onEdit={handleEdit}
            onDelete={deleteTeamMember}
            onToggleActive={toggleActive}
            onSort={handleSort}
            sortConfig={sortConfig}
            getSortIcon={getSortIcon}
          />
          
          {/* No results message */}
          {getFilteredAndSortedTeamMembers().length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? (
                <div>
                  <p>No team members found matching "{searchQuery}"</p>
                  <p className="text-sm mt-1">Try adjusting your search terms</p>
                </div>
              ) : (
                <p>No team members found. Add your first team member to get started.</p>
              )}
            </div>
          )}

          {/* Total count display */}
          <div className="text-sm text-gray-500 mt-2 text-center">
            Total: {pagination.total} team members
            {searchQuery && ` • Showing ${getFilteredAndSortedTeamMembers().length} filtered results`}
          </div>

          {/* Pagination */}
          {pagination.total > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
                {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
                {pagination.total} results
                <span className="ml-2 text-gray-400">(Page {pagination.current_page} of {pagination.last_page})</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === pagination.current_page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page >= pagination.last_page}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* <ExcelImportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onImport={handleBulkImport}
      /> */}
    </div>
  );
};
