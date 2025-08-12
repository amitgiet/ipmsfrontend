
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { UserRole } from '@/components/types/auth';
import { TeamMember } from '@/components/types/team';
import { skillsService } from '@/services/skillsService';
import { useToast } from '@/hooks/use-toast';

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
}

export const TeamMemberForm: React.FC<TeamMemberFormProps> = ({
  formData,
  editingMember,
  onFormDataChange,
  onSubmit,
  onCancel
}) => {
  const { toast } = useToast();
  const [availableSkills, setAvailableSkills] = useState<Array<{id: string | number, name: string}>>([]);
  const [loadingSkills, setLoadingSkills] = useState(true);

  // Fetch skills from API on component mount
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoadingSkills(true);
    try {
      const result = await skillsService.getSkills();
      
      if (result.success) {
        const skillsData = result.data.data || result.data || [];
        // Store both id and name for each skill
        const skillsWithIds = skillsData.map((skill: any) => ({
          id: skill.id,
          name: skill.name || skill
        }));
        setAvailableSkills(skillsWithIds);
      } else {
        console.error('Failed to fetch skills:', result.error);
        toast({
          title: "Error",
          description: "Failed to fetch skills. Using default skills.",
          variant: "destructive",
        });
        // Fallback to default skills if API fails
        setAvailableSkills([
          { id: 'react', name: 'React' },
          { id: 'typescript', name: 'TypeScript' },
          { id: 'nodejs', name: 'Node.js' },
          { id: 'python', name: 'Python' },
          { id: 'javascript', name: 'JavaScript' },
          { id: 'uiux', name: 'UI/UX Design' },
          { id: 'project-management', name: 'Project Management' },
          { id: 'devops', name: 'DevOps' },
          { id: 'database', name: 'Database Design' },
          { id: 'testing', name: 'Testing' },
          { id: 'mobile', name: 'Mobile Development' },
          { id: 'cloud', name: 'Cloud Computing' },
          { id: 'ml', name: 'Machine Learning' },
          { id: 'data-analysis', name: 'Data Analysis' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast({
        title: "Error",
        description: "Failed to fetch skills. Using default skills.",
        variant: "destructive",
      });
      // Fallback to default skills if API fails
      setAvailableSkills([
        { id: 'react', name: 'React' },
        { id: 'typescript', name: 'TypeScript' },
        { id: 'nodejs', name: 'Node.js' },
        { id: 'python', name: 'Python' },
        { id: 'javascript', name: 'JavaScript' },
        { id: 'uiux', name: 'UI/UX Design' },
        { id: 'project-management', name: 'Project Management' },
        { id: 'devops', name: 'DevOps' },
        { id: 'database', name: 'Database Design' },
        { id: 'testing', name: 'Testing' },
        { id: 'mobile', name: 'Mobile Development' },
        { id: 'cloud', name: 'Cloud Computing' },
        { id: 'ml', name: 'Machine Learning' },
        { id: 'data-analysis', name: 'Data Analysis' }
      ]);
    } finally {
      setLoadingSkills(false);
    }
  };

  const handleSkillToggle = (skillId: string | number) => {
    onFormDataChange(prev => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter(s => s !== skillId)
        : [...prev.skills, skillId]
    }));
  };

  // Helper function to check if a skill is selected
  const isSkillSelected = (skillId: string | number) => {
    return formData.skills.includes(skillId);
  };

  // Helper function to get skill name by ID
  const getSkillNameById = (skillId: string | number) => {
    const skill = availableSkills.find(s => s.id === skillId);
    return skill ? skill.name : skillId;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onFormDataChange(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onFormDataChange(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="mobile_no">Mobile Number</Label>
          <Input
            id="mobile_no"
            type="tel"
            value={formData.mobile_no}
            onChange={(e) => onFormDataChange(prev => ({ ...prev, mobile_no: e.target.value }))}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <Label htmlFor="emergency_contact">Emergency Contact</Label>
          <Input
            id="emergency_contact"
            value={formData.emergency_contact}
            onChange={(e) => onFormDataChange(prev => ({ ...prev, emergency_contact: e.target.value }))}
            placeholder="Name and phone number"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="password">
            Password {editingMember && '(leave empty to keep current)'}
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => onFormDataChange(prev => ({ ...prev, password: e.target.value }))}
            required={!editingMember}
          />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role} onValueChange={(value: UserRole) => onFormDataChange(prev => ({ ...prev, role: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="team_lead">Team Lead</SelectItem>
              <SelectItem value="product_owner">Product Owner</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="qa">QA</SelectItem>
              <SelectItem value="client">Client</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Skills</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {loadingSkills ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading skills...
            </div>
          ) : availableSkills.length > 0 ? (
            availableSkills.map((skill) => (
              <Badge
                key={skill.id}
                variant={isSkillSelected(skill.id) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => handleSkillToggle(skill.id)}
              >
                {getSkillNameById(skill.id)}
              </Badge>
            ))
          ) : (
            <div className="text-sm text-gray-500">
              No skills available. Please add skills in the Skills Management section.
            </div>
          )}
        </div>
        {formData.skills.length > 0 && (
          <div className="mt-2 text-xs text-gray-600">
            Selected: {formData.skills.length} skill{formData.skills.length !== 1 ? 's' : ''} 
            ({formData.skills.map(id => getSkillNameById(id)).join(', ')})
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => onFormDataChange(prev => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="is_active">Active (can login)</Label>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {editingMember ? 'Update' : 'Add'} Team Member
        </Button>
      </DialogFooter>
    </form>
  );
};
