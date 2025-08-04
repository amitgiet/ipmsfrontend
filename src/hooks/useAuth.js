import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const login = (credentials) => {
    return dispatch(loginUser(credentials));
  };

  const logout = () => {
    return dispatch(logoutUser());
  };

  return {
    ...auth,
    login,
    logout
  };
}; 