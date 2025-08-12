import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const login = (credentials) => {
    return dispatch(loginUser(credentials));
  };

  const logout = async () => {
    try {
      console.log('🔄 Logging out user...');
      
      // Dispatch the logout action
      const result = await dispatch(logoutUser());
      
      // Additional cleanup
      if (result.meta.requestStatus === 'fulfilled') {
        console.log('✅ Logout successful');
        
        // Force clear any remaining data
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear cookies
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        
        // Reload the page to ensure complete cleanup
        window.location.href = '/login';
      } else {
        console.error('❌ Logout failed:', result.error);
        // Even if logout fails, clear local data
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('❌ Error in logout function:', error);
      // Emergency cleanup
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    }
  };

  return {
    ...auth,
    login,
    logout
  };
}; 