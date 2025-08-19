
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/auth';
import { 
  authenticateAdmin, 
  authenticateTeamMember, 
  registerUser, 
  signOutUser 
} from '@/services/authService';

export const useAuthOperations = (
  setUser: (user: any) => void,
  setTeamUser: (user: any) => void,
  setIsLoading: (loading: boolean) => void
) => {
  const { toast } = useToast();

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      await authenticateAdmin(email, password);
      
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const teamLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const teamUserData = await authenticateTeamMember(email, password);
      
      setTeamUser(teamUserData);
      setUser(null);
      localStorage.setItem('team_user', JSON.stringify(teamUserData));
      
      toast({
        title: "Welcome!",
        description: `Successfully logged in as ${teamUserData.name}`,
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role: UserRole, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      await registerUser(email, password, role, name);
      
      toast({
        title: "Account Created!",
        description: "Please check your email to confirm your account.",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      if (setTeamUser) {
        setTeamUser(null);
        localStorage.removeItem('team_user');
      }
      
      if (setUser) {
        await signOutUser();
      }
      
      setUser(null);
      setTeamUser(null);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
      setUser(null);
      setTeamUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    teamLogin,
    signUp,
    logout
  };
};
