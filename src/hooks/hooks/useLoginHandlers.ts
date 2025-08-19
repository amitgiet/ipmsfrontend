
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useLoginHandlers = () => {
  const [error, setError] = useState('');
  const { login, teamLogin, isLoading } = useAuth();
  const navigate = useNavigate();

  const validateCredentials = (email: string, password: string): boolean => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleAdminLogin = async (email: string, password: string) => {
    setError('');
    console.log('🔄 Admin login attempt for:', email);
    
    if (!validateCredentials(email, password)) {
      return;
    }
    
    try {
      const success = await login(email, password);
      console.log('✅ Admin login result:', success);
      
      if (success) {
        console.log('✅ Admin login successful, navigating to dashboard');
        navigate('/dashboard');
      } else {
        console.log('❌ Admin login failed');
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('❌ Admin login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  const handleTeamLogin = async (email: string, password: string) => {
    setError('');
    console.log('🔄 Team login attempt for:', email);
    
    if (!validateCredentials(email, password)) {
      return;
    }
    
    try {
      const success = await teamLogin(email, password);
      console.log('✅ Team login result:', success);
      
      if (success) {
        console.log('✅ Team login successful, navigating to dashboard');
        navigate('/dashboard');
      } else {
        console.log('❌ Team login failed');
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('❌ Team login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  const handleClientLogin = async (email: string, password: string) => {
    setError('');
    console.log('🔄 Client login attempt for:', email);
    
    if (!validateCredentials(email, password)) {
      return;
    }
    
    try {
      const success = await login(email, password);
      console.log('✅ Client login result:', success);
      
      if (success) {
        console.log('✅ Client login successful, navigating to dashboard');
        navigate('/dashboard');
      } else {
        console.log('❌ Client login failed');
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('❌ Client login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  return {
    error,
    setError,
    isLoading,
    handleAdminLogin,
    handleTeamLogin,
    handleClientLogin
  };
};
