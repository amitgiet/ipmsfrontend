
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { UserRole } from '@/components/types/auth';

export const ExcelTemplateDownloader: React.FC = () => {
  const downloadTemplate = () => {
    const validRoles: UserRole[] = ['admin', 'team_lead', 'product_owner', 'developer', 'qa', 'client'];
    
    // Main template data with examples for each role
    const templateData = [
      {
        name: 'John Doe (Admin)',
        email: 'john.admin@example.com',
        mobile_no: '+1234567890',
        emergency_contact: 'Jane Doe +0987654321',
        password: 'password123',
        role: 'admin',
        skills: 'Project Management,Leadership',
        is_active: 'TRUE'
      },
      {
        name: 'Sarah Smith (Team Lead)',
        email: 'sarah.lead@example.com',
        mobile_no: '+1234567891',
        emergency_contact: 'Mike Smith +0987654322',
        password: 'password123',
        role: 'team_lead',
        skills: 'React,TypeScript,Team Management',
        is_active: 'TRUE'
      },
      {
        name: 'Mike Johnson (Developer)',
        email: 'mike.dev@example.com',
        mobile_no: '+1234567892',
        emergency_contact: 'Lisa Johnson +0987654323',
        password: 'password123',
        role: 'developer',
        skills: 'React,TypeScript,Node.js',
        is_active: 'TRUE'
      },
      {
        name: 'Lisa Brown (QA)',
        email: 'lisa.qa@example.com',
        mobile_no: '+1234567893',
        emergency_contact: 'Tom Brown +0987654324',
        password: 'password123',
        role: 'qa',
        skills: 'Testing,Mobile Development',
        is_active: 'TRUE'
      },
      {
        name: 'David Wilson (Product Owner)',
        email: 'david.po@example.com',
        mobile_no: '+1234567894',
        emergency_contact: 'Anna Wilson +0987654325',
        password: 'password123',
        role: 'product_owner',
        skills: 'Project Management,UI/UX Design',
        is_active: 'TRUE'
      },
      {
        name: 'Client User',
        email: 'client@example.com',
        mobile_no: '+1234567895',
        emergency_contact: 'Client Contact +0987654326',
        password: 'password123',
        role: 'client',
        skills: '',
        is_active: 'TRUE'
      }
    ];

    // Reference data for roles - using the actual UserRole type
    const rolesReference = validRoles.map(role => ({
      role: role,
      description: getRoleDescription(role)
    }));

    // Available skills reference
    const skillsReference = [
      { skill: 'React' },
      { skill: 'TypeScript' },
      { skill: 'Node.js' },
      { skill: 'Python' },
      { skill: 'JavaScript' },
      { skill: 'UI/UX Design' },
      { skill: 'Project Management' },
      { skill: 'DevOps' },
      { skill: 'Database Design' },
      { skill: 'Testing' },
      { skill: 'Mobile Development' },
      { skill: 'Cloud Computing' },
      { skill: 'Machine Learning' },
      { skill: 'Data Analysis' },
      { skill: 'Leadership' },
      { skill: 'Team Management' }
    ];

    // Instructions sheet
    const instructions = [
      { field: 'name', required: 'Yes', description: 'Full name of the team member' },
      { field: 'email', required: 'Yes', description: 'Valid email address (must contain @)' },
      { field: 'mobile_no', required: 'No', description: 'Phone number with country code' },
      { field: 'emergency_contact', required: 'No', description: 'Emergency contact name and phone' },
      { field: 'password', required: 'Yes', description: 'Password (minimum 6 characters)' },
      { field: 'role', required: 'Yes', description: `Must be exactly one of: ${validRoles.join(', ')}` },
      { field: 'skills', required: 'No', description: 'Comma-separated list of skills (see Skills sheet for available options)' },
      { field: 'is_active', required: 'No', description: 'TRUE or FALSE (defaults to TRUE if empty)' }
    ];

    const workbook = XLSX.utils.book_new();
    
    // Add main template sheet
    const templateSheet = XLSX.utils.json_to_sheet(templateData);
    XLSX.utils.book_append_sheet(workbook, templateSheet, 'Team Members');
    
    // Add roles reference sheet
    const rolesSheet = XLSX.utils.json_to_sheet(rolesReference);
    XLSX.utils.book_append_sheet(workbook, rolesSheet, 'Valid Roles');
    
    // Add skills reference sheet
    const skillsSheet = XLSX.utils.json_to_sheet(skillsReference);
    XLSX.utils.book_append_sheet(workbook, skillsSheet, 'Available Skills');
    
    // Add instructions sheet
    const instructionsSheet = XLSX.utils.json_to_sheet(instructions);
    XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');
    
    XLSX.writeFile(workbook, 'team_members_template.xlsx');
  };

  const getRoleDescription = (role: UserRole): string => {
    const descriptions: Record<UserRole, string> = {
      admin: 'Full system access and user management',
      team_lead: 'Manages team members and project assignments',
      product_owner: 'Defines requirements and manages product backlog',
      developer: 'Develops and maintains application features',
      qa: 'Tests and ensures quality of deliverables',
      client: 'Client access to view project progress'
    };
    return descriptions[role];
  };

  return (
    <Button onClick={downloadTemplate} variant="outline">
      <Download className="h-4 w-4 mr-2" />
      Download Template
    </Button>
  );
};
