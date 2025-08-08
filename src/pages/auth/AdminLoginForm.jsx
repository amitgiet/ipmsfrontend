import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, Shield, Code, TestTube, User, Crown } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { loginUser } from '@/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';

const roleIcons = {
  admin: Crown,
  team_lead: Shield,
  product_owner: Users,
  developer: Code,
  qa: TestTube,
  client: User,
};

const roleLabels = {
  admin: 'Administrator',
  team_lead: 'Team Lead',
  product_owner: 'Product Owner',
  developer: 'Developer',
  qa: 'QA Engineer',
  client: 'Client',
};

export const AdminLoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('developer');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password || !name) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      // Use apiCall utility with proper route
      const result = await apiCall(
        allRoutes.auth.login,
        'post',
        {
          email,
          password,
          name,
          role
        }
      );

      if (result.success) {
        console.log('✅ Login successful:', result.data);

        // Extract user data from response
        const userData = result.data.user || result.data;
        const token = result.data.token || result.data.access_token;

        // Store token in localStorage
        if (token) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('isAuthenticated', 'true');
        }

        // Dispatch login action with actual API response
        dispatch(loginUser.fulfilled({
          user: userData,
          teamUser: null,
          token: token
        }, 'loginUser', { email, password, name, role }));
        
        console.log('✅ Login successful, navigating to dashboard');
        navigate('/dashboard');
      } else {
        // Handle API call failure
        setError(result.error?.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('❌ Login failed:', err);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Create Account
        </CardTitle>
        <CardDescription>
          Join your project management team
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roleLabels).map(([key, label]) => {
                  const Icon = roleIcons[key];
                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
