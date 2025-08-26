import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';

export const PasswordUpdateForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user, teamUser } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      toast.error("Current password is required");
      return false;
    }

    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirmation do not match");
      return false;
    }

    return true;
  };

  const updateAdminPassword = async () => {
    const { error } = await apiCall(allRoutes.auth.update_password, 'post', {
      password: formData.newPassword
    });

    if (error) {
      throw error;
    }
  };

  const updateTeamMemberPassword = async () => {
    if (!teamUser) return;

    const { error } = await apiCall(allRoutes.auth.update_password, 'post', {
      member_id: teamUser.id,
      current_password: formData.currentPassword,
      new_password: formData.newPassword
    });

    if (error) {
      throw error;
    }
  };

  const updateClientPassword = async () => {
    if (!user || user.role !== 'client') return;

    // For clients, verify current password and update
    if (formData.currentPassword !== 'Dots123') {
      throw new Error('Current password is incorrect');
    }

    // Update client password in profiles table
      const { error } = await apiCall(allRoutes.auth.update_password, 'post', { 
        // Note: In a real implementation, you'd want to hash the password
        // For now, keeping it simple as per the existing client auth pattern
        password: formData.newPassword,
        updated_at: new Date().toISOString()
      })

    if (error) {
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      if (user && user.role === 'client') {
        await updateClientPassword();
      } else if (user && user.role === 'admin') {
        await updateAdminPassword();
      } else if (teamUser) {
        await updateTeamMemberPassword();
      }

      toast.success("Password updated successfully");

      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('Password update error:', error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password by entering your current password and choosing a new one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
              minLength={6}
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordUpdateForm;
