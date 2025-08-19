
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/auth';
import { TeamMember } from '@/types/team';

export const useTeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTeamMembers = async () => {
    try {
      console.log('🔄 Fetching team members...');
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('📊 Team members fetch result:', { data, error, count: data?.length });

      if (error) throw error;
      
      // Cast the role field to UserRole type to fix TypeScript error
      const typedData = (data || []).map(member => ({
        ...member,
        role: member.role as UserRole
      }));
      
      console.log('✅ Typed team members:', typedData);
      setTeamMembers(typedData);
    } catch (error) {
      console.error('❌ Error fetching team members:', error);
      toast({
        title: "Error",
        description: "Failed to fetch team members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveTeamMember = async (formData: any, editingMember: TeamMember | null) => {
    try {
      console.log('🔄 Saving team member:', { formData, editingMember });
      
      if (editingMember) {
        // Update existing member
        const updateData: any = {
          name: formData.name,
          email: formData.email,
          mobile_no: formData.mobile_no || null,
          emergency_contact: formData.emergency_contact || null,
          role: formData.role,
          skills: formData.skills || [],
          is_active: formData.is_active,
          updated_at: new Date().toISOString()
        };

        console.log('📝 Update data:', updateData);

        // Only update password if provided
        if (formData.password) {
          console.log('🔐 Hashing new password...');
          const { data: hashedPassword, error: hashError } = await supabase.rpc('hash_password', {
            password: formData.password
          });
          
          if (hashError) {
            console.error('❌ Password hashing error:', hashError);
            throw hashError;
          }
          
          updateData.password_hash = hashedPassword;
          console.log('✅ Password hashed successfully');
        }

        const { error } = await supabase
          .from('team_members')
          .update(updateData)
          .eq('id', editingMember.id);

        if (error) {
          console.error('❌ Update error:', error);
          throw error;
        }

        console.log('✅ Team member updated successfully');
        toast({
          title: "Success",
          description: "Team member updated successfully",
        });
      } else {
        // Create new member
        if (!formData.password) {
          console.error('❌ No password provided for new member');
          toast({
            title: "Error",
            description: "Password is required for new team members",
            variant: "destructive",
          });
          return false;
        }

        console.log('🔐 Hashing password for new member...');
        
        // First check if the hash_password function exists and works
        const { data: hashedPassword, error: hashError } = await supabase.rpc('hash_password', {
          password: formData.password
        });

        if (hashError) {
          console.error('❌ Password hashing error:', hashError);
          toast({
            title: "Error",
            description: `Password hashing failed: ${hashError.message}`,
            variant: "destructive",
          });
          return false;
        }

        if (!hashedPassword) {
          console.error('❌ Password hashing returned null');
          toast({
            title: "Error",
            description: "Password hashing failed - no hash returned",
            variant: "destructive",
          });
          return false;
        }

        console.log('✅ Password hashed successfully, hash length:', hashedPassword.length);
        
        const insertData = {
          name: formData.name,
          email: formData.email,
          mobile_no: formData.mobile_no || null,
          emergency_contact: formData.emergency_contact || null,
          password_hash: hashedPassword,
          role: formData.role,
          skills: formData.skills || [],
          is_active: formData.is_active !== false // Default to true if not specified
        };
        
        console.log('📝 Insert data:', { ...insertData, password_hash: '[REDACTED]' });

        const { data: insertResult, error: insertError } = await supabase
          .from('team_members')
          .insert([insertData])
          .select();

        console.log('📊 Insert result:', { 
          insertResult, 
          insertError,
          insertedCount: insertResult?.length || 0 
        });

        if (insertError) {
          console.error('❌ Insert error details:', {
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
            code: insertError.code
          });
          
          toast({
            title: "Error",
            description: `Failed to create team member: ${insertError.message}`,
            variant: "destructive",
          });
          return false;
        }

        if (!insertResult || insertResult.length === 0) {
          console.error('❌ Insert succeeded but no data returned');
          toast({
            title: "Warning",
            description: "Team member may have been created but confirmation failed",
            variant: "destructive",
          });
          // Still refresh the list to check
          await fetchTeamMembers();
          return true;
        }

        console.log('✅ Team member created successfully:', insertResult[0]);
        toast({
          title: "Success",
          description: "Team member added successfully",
        });
      }

      // Refresh the team members list
      await fetchTeamMembers();
      return true;
    } catch (error) {
      console.error('❌ Error saving team member:', error);
      toast({
        title: "Error",
        description: `Failed to save team member: ${error}`,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteTeamMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Team member deleted successfully",
      });
      fetchTeamMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Team member ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
      fetchTeamMembers();
    } catch (error) {
      console.error('Error toggling team member status:', error);
      toast({
        title: "Error",
        description: "Failed to update team member status",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  return {
    teamMembers,
    loading,
    saveTeamMember,
    deleteTeamMember,
    toggleActive,
    fetchTeamMembers
  };
};
