import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { UserRole } from '@/components/types/auth';
import { TeamMember } from '@/components/types/team';
import { skillsService } from '@/services/skillsService';
import { cn } from '@/lib/utils';

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
  const [availableSkills, setAvailableSkills] = useState<
    Array<{ id: string | number; name: string }>
  >([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch skills when search, page or popover open changes
  useEffect(() => {
    if (open) {
      fetchSkills(search, page);
    }
  }, [search, page, open]);

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
      console.error('Error fetching skills:', error);
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

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Name + Email */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              onFormDataChange((prev: any) => ({
                ...prev,
                name: e.target.value
              }))
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
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
          <Label htmlFor="mobile_no">Mobile Number</Label>
          <Input
            id="mobile_no"
            type="tel"
            value={formData.mobile_no}
            onChange={(e) =>
              onFormDataChange((prev: any) => ({
                ...prev,
                mobile_no: e.target.value
              }))
            }
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <Label htmlFor="emergency_contact">Emergency Contact</Label>
          <Input
            id="emergency_contact"
            value={formData.emergency_contact}
            onChange={(e) =>
              onFormDataChange((prev: any) => ({
                ...prev,
                emergency_contact: e.target.value
              }))
            }
            placeholder="Name and phone number"
          />
        </div>
      </div>

      {/* Password + Role */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="password">
            Password {editingMember && '(leave empty to keep current)'}
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              onFormDataChange((prev: any) => ({
                ...prev,
                password: e.target.value
              }))
            }
            required={!editingMember}
          />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
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
          >
            <option value="admin">Admin</option>
            <option value="team_lead">Team Lead</option>
            <option value="product_owner">Product Owner</option>
            <option value="developer">Developer</option>
            <option value="qa">QA</option>
            <option value="client">Client</option>
          </select>
        </div>
      </div>

      {/* Skills dropdown with search + pagination */}
      <div>
        <Label>Skills</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
              aria-expanded={open}
            >
              {formData.skills.length > 0
                ? `${formData.skills.length} selected`
                : 'Select skills...'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput
                placeholder="Search skills..."
                value={search}
                onValueChange={(value) => {
                  setSearch(value);
                  setPage(1);
                }}
                autoFocus
              />
              <CommandEmpty>No skills found.</CommandEmpty>
              <CommandGroup
                style={{
                  maxHeight: '250px',  // fixed max height
                  overflowY: 'auto',   // vertical scroll when content overflows
                }}
              >
                {availableSkills.map((skill) => (
                  <CommandItem
                    key={skill.id}
                    onSelect={() => toggleSkill(skill.id)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        formData.skills.includes(skill.id) ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {skill.name}
                  </CommandItem>
                ))}

                {loadingSkills && (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}

                {!loadingSkills && hasMore && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Load more
                  </Button>
                )}
              </CommandGroup>
            </Command>
          </PopoverContent>

        </Popover>
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{editingMember ? 'Update' : 'Add'} Team Member</Button>
      </div>
    </form>
  );
};
