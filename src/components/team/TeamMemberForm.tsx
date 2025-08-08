
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { UserRole } from '@/components/types/auth';
import { TeamMember, availableSkills } from '@/components/types/team';

interface TeamMemberFormProps {
  formData: {
    name: string;
    email: string;
    mobile_no: string;
    emergency_contact: string;
    password: string;
    role: UserRole;
    skills: string[];
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
  const handleSkillToggle = (skill: string) => {
    onFormDataChange(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
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
          {availableSkills.map((skill) => (
            <Badge
              key={skill}
              variant={formData.skills.includes(skill) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleSkillToggle(skill)}
            >
              {skill}
            </Badge>
          ))}
        </div>
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
