
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface TeamUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  skills: string[];
  is_active: boolean;
}

export type UserRole = 'super-admin' | 'admin' | 'team_lead' | 'product_owner' | 'developer' | 'qa' | 'client';

export interface AuthState {
  user: User | null;
  teamUser: TeamUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType {
  user: User | null;
  teamUser: TeamUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  teamLogin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signUp: (email: string, password: string, role: UserRole, name: string) => Promise<boolean>;
}
