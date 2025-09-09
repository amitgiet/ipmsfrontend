import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, Loader2, Eye, EyeOff, Search, X } from 'lucide-react';
import { UserRole } from '@/components/types/auth';
import { TeamMember } from '@/components/types/team';
import { skillsService } from '@/services/skillsService';

interface TeamMemberFormProps {
  formData: {
    name: string;
    email: string;
    mobile_no: string;
    emergency_contact: string;
    password: string;
    role: UserRole;
    skills: (string | number)[];
    is_active: boolean;
  };
  editingMember: TeamMember | null;
  onFormDataChange: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const TeamMemberForm: React.FC<TeamMemberFormProps> = ({
  formData,
  editingMember,
  onFormDataChange,
  onSubmit,
  onCancel,
  loading = false
}) => {
  // Password validation state
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const [mobileError, setMobileError] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');
  const [availableSkills, setAvailableSkills] = useState<
    Array<{ id: string | number; name: string }>
  >([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Name validation function
  const validateName = (name: string) => {
    if (name.length === 0) {
      setNameError('');
      return true;
    }
    
    // Only allow alphabets, spaces, and optionally numbers
    // Pattern: letters, spaces, numbers, but no special characters
    if (!/^[a-zA-Z\s0-9]+$/.test(name)) {
      setNameError('Name can only contain letters, spaces, and numbers');
      return false;
    }
    
    // Must have at least one letter
    if (!/[a-zA-Z]/.test(name)) {
      setNameError('Name must contain at least one letter');
      return false;
    }
    
    // Check for consecutive special characters or excessive spaces
    if (/\s{2,}/.test(name)) {
      setNameError('Name cannot have consecutive spaces');
      return false;
    }
    
    // Check for excessive numbers (should not be more than letters)
    const letterCount = (name.match(/[a-zA-Z]/g) || []).length;
    const numberCount = (name.match(/[0-9]/g) || []).length;
    
    if (numberCount > letterCount) {
      setNameError('Name should contain more letters than numbers');
      return false;
    }
    
    setNameError('');
    return true;
  };

  // Mobile number validation function
  const validateMobileNumber = (mobile: string) => {
    // Remove any non-digit characters
    const cleanMobile = mobile.replace(/\D/g, '');
    
    if (cleanMobile.length === 0) {
      setMobileError('');
      return true;
    }
    
    if (cleanMobile.length !== 10) {
      setMobileError('Please enter a valid 10-digit mobile number');
      return false;
    }
    
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setMobileError('Mobile number should start with 6, 7, 8, or 9');
      return false;
    }
    
    setMobileError('');
    return true;
  };

  // Password validation function
  const validatePassword = (password: string) => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('At least 8 characters');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('At least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('At least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('At least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('At least one special character');
    }
    
    setPasswordErrors(errors);
    
    // Calculate password strength
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
    
    if (score <= 2) setPasswordStrength('weak');
    else if (score <= 4) setPasswordStrength('medium');
    else setPasswordStrength('strong');
    
    return errors.length === 0;
  };

  // Fetch skills when search or page changes
  useEffect(() => {
    fetchSkills(search, page);
  }, [search, page]);

  // Fetch initial skills when editing a member or component mounts
  useEffect(() => {
    if (editingMember && editingMember.skills && editingMember.skills.length > 0) {
      // Fetch skills to display existing skill names
      fetchSkills('', 1);
    }
  }, [editingMember]);



  const fetchSkills = async (searchTerm: string, pageNum: number) => {
    setLoadingSkills(true);
    try {
      const result = await skillsService.getSkills({
        search: searchTerm,
        page: pageNum
      });
      if (result.success) {
        const skillsData = result.data.data || [];
        if (pageNum === 1) {
          setAvailableSkills(skillsData);
        } else {
          setAvailableSkills((prev) => [...prev, ...skillsData]);
        }
        setHasMore(skillsData.length > 0);
      } else {
        setAvailableSkills([]);
        setHasMore(false);
      }
    } catch (error) {
      setAvailableSkills([]);
      setHasMore(false);
    } finally {
      setLoadingSkills(false);
    }
  };

  // Toggle skill selection
  const toggleSkill = (skillId: string | number) => {
    onFormDataChange((prev: typeof formData) => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter((id) => id !== skillId)
        : [...prev.skills, skillId]
    }));
  };

  useEffect(() => {
   if(editingMember){
    onFormDataChange((prev: any) => ({
      ...prev,
      skills: editingMember.skills.map((skill: any) => skill.id)
    }));
   }
  }, [editingMember]);

  // Form submission handler with password validation
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate name
    if (!validateName(formData.name)) {
      return;
    }
    
    // Validate mobile number
    if (!validateMobileNumber(formData.mobile_no)) {
      return;
    }
    
    // Validate password if it's a new member or if password is being changed
    if (!editingMember || formData.password) {
      if (!validatePassword(formData.password)) {
        // Don't submit if password validation fails
        return;
      }
    }
    
    // If validation passes, call the original onSubmit
    onSubmit(e);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      
      {/* Name + Email */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => {
              const newName = e.target.value;
              onFormDataChange((prev: any) => ({
                ...prev,
                name: newName
              }));
              // Validate name when it changes
              validateName(newName);
            }}
            placeholder="Enter full name (letters, spaces, numbers only)"
            className={nameError ? 'border-red-500' : ''}
            required
          />
          {nameError && (
            <p className="text-sm text-red-500 mt-1">{nameError}</p>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              onFormDataChange((prev: any) => ({
                ...prev,
                email: e.target.value
              }))
            }
            required
          />
        </div>
      </div>

      {/* Mobile + Emergency Contact */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="mobile_no">Mobile Number <span className="text-red-500">*</span></Label>
          <Input
            id="mobile_no"
            type="tel"
            value={formData.mobile_no}
            onChange={(e) => {
              const newMobile = e.target.value;
              onFormDataChange((prev: any) => ({
                ...prev,
                mobile_no: newMobile
              }));
              // Validate mobile number when it changes
              validateMobileNumber(newMobile);
            }}
            placeholder="Enter 10-digit mobile number"
            className={mobileError ? 'border-red-500' : ''}
            required
          />
          {mobileError && (
            <p className="text-sm text-red-500 mt-1">{mobileError}</p>
              )}
        </div>
      </div>

      {/* Password + Role */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="password">
            Password {editingMember && '(leave empty to keep current)'} {!editingMember && <span className="text-red-500">*</span>}
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => {
                const newPassword = e.target.value;
                onFormDataChange((prev: any) => ({
                  ...prev,
                  password: newPassword
                }));
                // Validate password when it changes
                if (newPassword) {
                  validatePassword(newPassword);
                } else {
                  setPasswordErrors([]);
                  setPasswordStrength('weak');
                }
              }}
              required={!editingMember}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          
          {/* Password requirements and strength indicator */}
          {formData.password && (
            <div className="mt-2 space-y-2">
              {/* Password strength indicator */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Strength:</span>
                <div className="flex gap-1">
                  <div className={`h-2 w-8 rounded ${
                    passwordStrength === 'weak' ? 'bg-red-400' : 
                    passwordStrength === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                  }`}></div>
                  <div className={`h-2 w-8 rounded ${
                    passwordStrength === 'weak' ? 'bg-gray-200' : 
                    passwordStrength === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                  }`}></div>
                  <div className={`h-2 w-8 rounded ${
                    passwordStrength === 'weak' ? 'bg-gray-200' : 
                    passwordStrength === 'medium' ? 'bg-gray-200' : 'bg-green-400'
                  }`}></div>
                </div>
                <span className={`text-xs font-medium ${
                  passwordStrength === 'weak' ? 'text-red-600' : 
                  passwordStrength === 'medium' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                </span>
              </div>
              
              {/* Password requirements */}
              <div className="text-xs text-gray-600">
                <p className="font-medium mb-1">Password must contain:</p>
                <ul className="space-y-1">
                  <li className={`flex items-center gap-1 ${formData.password.length >= 8 ? 'text-green-600' : 'text-red-500'}`}>
                    <span>{formData.password.length >= 8 ? '✓' : '✗'}</span>
                    At least 8 characters
                  </li>
                  <li className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-red-500'}`}>
                    <span>{/[A-Z]/.test(formData.password) ? '✓' : '✗'}</span>
                    At least one uppercase letter
                  </li>
                  <li className={`flex items-center gap-1 ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-red-500'}`}>
                    <span>{/[a-z]/.test(formData.password) ? '✓' : '✗'}</span>
                    At least one lowercase letter
                  </li>
                  <li className={`flex items-center gap-1 ${/\d/.test(formData.password) ? 'text-green-600' : 'text-red-500'}`}>
                    <span>{/\d/.test(formData.password) ? '✓' : '✗'}</span>
                    At least one number
                  </li>
                  <li className={`flex items-center gap-1 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'text-green-600' : 'text-red-500'}`}>
                    <span>{/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? '✓' : '✗'}</span>
                    At least one special character
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) =>
              onFormDataChange((prev: any) => ({
                ...prev,
                role: e.target.value as UserRole
              }))
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
            required
          >
            <option value="admin">Admin</option>
            <option value="team_lead">Team Lead</option>
            <option value="product_owner">Product Owner</option>
            <option value="developer">Developer</option>
            <option value="qa">QA</option>
            {/* <option value="client">Client</option> */}
          </select>
        </div>
      </div>

      {/* Skills multi-select with checkboxes */}
      <div>
        <Label>Skills <span className="text-red-500">*</span></Label>
        
        {/* Selected Skills Display */}
        {formData.skills.length > 0 && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  {formData.skills.length} skill(s) selected
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFormDataChange((prev: any) => ({ ...prev, skills: [] }))}
                className="h-6 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
              >
                Clear
              </Button>
            </div>
            <p className="text-xs text-blue-700 break-words">
              {formData.skills
                .map(skillId => 
                  availableSkills.find(skill => skill.id == skillId)?.name || 
                  editingMember?.skills.find((skill: any) => skill.id == skillId)?.name || 
                  skillId
                )
                .join(', ')}
            </p>
          </div>
        )}
        
        {/* Search Bar */}
        <div className="mt-3 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search skills..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10 pr-10"
            />
            {search && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 px-2 text-gray-500 hover:text-gray-700"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Search Results Info */}
        {search && (
          <div className="mt-2 text-xs text-gray-500">
            Found {availableSkills.filter(skill => 
              skill.name.toLowerCase().includes(search.toLowerCase())
            ).length} skill(s) matching "{search}"
          </div>
        )}
        
        {/* Multi-Select Checkbox List */}
        <div className="mt-3 min-h-[200px] max-h-[200px] overflow-y-auto border rounded-lg p-2 space-y-2">
          {availableSkills
            .filter(skill => !search || skill.name.toLowerCase().includes(search.toLowerCase()))
            .map((skill) => (
              <div key={skill.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                <Checkbox
                  id={`skill-${skill.id}`}
                  checked={formData.skills.includes(skill.id)}
                  onCheckedChange={(checked) => toggleSkill(skill.id)}
                />
                <label htmlFor={`skill-${skill.id}`} className="flex-1 cursor-pointer">
                  <span className="font-medium text-sm">{skill.name}</span>
                </label>
              </div>
            ))}
                  {availableSkills.filter(skill => 
          !search || skill.name.toLowerCase().includes(search.toLowerCase())
        ).length === 0 && search && (
          <div className="text-center py-4 text-gray-500">
            <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No skills found matching "{search}"</p>
            <p className="text-xs">Try adjusting your search terms</p>
          </div>
        )}
        </div>
        
  
        
        {availableSkills.length === 0 && !search && (
          <p className="text-sm text-gray-500 mt-2">
            No skills available.
          </p>
        )}
      </div>

      {/* Active toggle */}
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) =>
            onFormDataChange((prev: any) => ({
              ...prev,
              is_active: checked
            }))
          }
        />
        <Label htmlFor="is_active">Active (can login)</Label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {editingMember ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            `${editingMember ? 'Update' : 'Add'} Team Member`
          )}
        </Button>
      </div>
    </form>
  );
};
