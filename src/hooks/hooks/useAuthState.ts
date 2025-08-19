
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, TeamUser } from '@/types/auth';
import { fetchUserProfile } from '@/services/authService';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [teamUser, setTeamUser] = useState<TeamUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const createFallbackUser = (supabaseUser: any): User => ({
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.email?.split('@')[0] || 'User',
    role: 'admin',
  });

  useEffect(() => {
    console.log('🔄 AuthState initializing...');
    
    const initializeAuth = async () => {
      try {
        // Check for stored client user first
        const storedClientUser = localStorage.getItem('client_user');
        if (storedClientUser) {
          try {
            const clientUserData = JSON.parse(storedClientUser);
            console.log('✅ Found stored client user:', clientUserData.email);
            setUser(clientUserData);
            setIsLoading(false);
            return;
          } catch (error) {
            console.error('❌ Invalid stored client user:', error);
            localStorage.removeItem('client_user');
          }
        }

        // Check for stored team user
        const storedTeamUser = localStorage.getItem('team_user');
        if (storedTeamUser) {
          try {
            const teamUserData = JSON.parse(storedTeamUser);
            console.log('✅ Found stored team user:', teamUserData.email);
            setTeamUser(teamUserData);
            setIsLoading(false);
            return;
          } catch (error) {
            console.error('❌ Invalid stored team user:', error);
            localStorage.removeItem('team_user');
          }
        }

        // Check Supabase session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Session check error:', error);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          console.log('✅ Found Supabase session:', session.user.email);
          try {
            const userData = await fetchUserProfile(session.user);
            setUser(userData);
          } catch (error) {
            console.error('❌ Failed to fetch user profile, but will continue with basic user data');
            setUser(createFallbackUser(session.user));
          }
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Clear team/client user when Supabase user signs in
          localStorage.removeItem('team_user');
          localStorage.removeItem('client_user');
          setTeamUser(null);
          
          try {
            const userData = await fetchUserProfile(session.user);
            setUser(userData);
          } catch (error) {
            console.error('❌ Profile fetch failed in auth state change');
            setUser(createFallbackUser(session.user));
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    teamUser,
    isLoading,
    setUser,
    setTeamUser,
    setIsLoading,
  };
};
