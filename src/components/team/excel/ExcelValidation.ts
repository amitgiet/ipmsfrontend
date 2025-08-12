import { UserRole } from '@/components/types/auth';

export interface ExcelTeamMember {
  name: string;
  email: string;
  mobile_no?: string;
  emergency_contact?: string;
  password: string;
  role: UserRole;
  skills: string[];
  is_active: boolean;
}

export const validateRole = (role: string | null | undefined): UserRole | null => {
  if (!role || typeof role !== 'string') return null;
  const cleanRole = role.toString().trim().toLowerCase();
  const validRoles: UserRole[] = ['admin', 'team_lead', 'product_owner', 'developer', 'qa', 'client'];
  return validRoles.includes(cleanRole as UserRole) ? cleanRole as UserRole : null;
};

export const validateSkills = (skillsString: string | null | undefined): string[] => {
  // Handle null, undefined, or empty string cases
  if (!skillsString || skillsString.toString().trim() === '') return [];
  
  const skills = skillsString.toString().split(',').map(s => s.trim()).filter(s => s);
  // For Excel import, we'll accept any non-empty skill names
  // The backend can handle skill validation and mapping
  return skills;
};

export const validateIsActive = (isActiveValue: any): boolean => {
  if (isActiveValue === null || isActiveValue === undefined || isActiveValue === '') {
    return true; // Default to active if not specified
  }
  const stringValue = isActiveValue.toString().toUpperCase().trim();
  return stringValue === 'TRUE' || stringValue === '1' || stringValue === 'YES';
};

export const validateTeamMember = (member: any, rowIndex: number): string[] => {
  const errors: string[] = [];
  
  // Log the raw member data for debugging
  console.log(`Row ${rowIndex + 2} data:`, member);
  
  // Name validation
  if (!member.name || member.name.toString().trim() === '') {
    errors.push(`Row ${rowIndex + 2}: Name is required and cannot be empty`);
  }
  
  // Email validation
  const email = member.email ? member.email.toString().trim() : '';
  if (!email) {
    errors.push(`Row ${rowIndex + 2}: Email is required`);
  } else if (!email.includes('@') || !email.includes('.')) {
    errors.push(`Row ${rowIndex + 2}: Email must be a valid email address`);
  }
  
  // Password validation
  const password = member.password ? member.password.toString().trim() : '';
  if (!password) {
    errors.push(`Row ${rowIndex + 2}: Password is required`);
  } else if (password.length < 6) {
    errors.push(`Row ${rowIndex + 2}: Password must be at least 6 characters long`);
  }
  
  // Role validation
  const validatedRole = validateRole(member.role);
  if (!validatedRole) {
    errors.push(`Row ${rowIndex + 2}: Role must be one of: admin, team_lead, product_owner, developer, qa, client (got: "${member.role}")`);
  }
  
  return errors;
};
